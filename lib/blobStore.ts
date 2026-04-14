import { del, get, list, put } from '@vercel/blob'
import { readEnv } from './env'

const BLOB_ACCESS = 'private' as const

function getBlobToken() {
  return readEnv('BLOB_READ_WRITE_TOKEN')
}

export function hasBlobStore() {
  return Boolean(getBlobToken())
}

function requireBlobToken() {
  const token = getBlobToken()
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set.')
  }
  return token
}

async function streamToString(stream: ReadableStream<Uint8Array>) {
  return await new Response(stream).text()
}

export async function readJsonBlob<T>(pathname: string, fallback: T): Promise<T> {
  if (!hasBlobStore()) {
    return fallback
  }

  const result = await get(pathname, {
    access: BLOB_ACCESS,
    token: requireBlobToken(),
    useCache: false
  })

  if (!result || result.statusCode !== 200 || !result.stream) {
    return fallback
  }

  const text = await streamToString(result.stream)
  if (!text.trim()) {
    return fallback
  }

  try {
    return JSON.parse(text) as T
  } catch {
    return fallback
  }
}

export async function writeJsonBlob(pathname: string, value: unknown) {
  await put(pathname, JSON.stringify(value, null, 2), {
    access: BLOB_ACCESS,
    token: requireBlobToken(),
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  })
}

export async function deleteBlobPath(pathname: string) {
  if (!hasBlobStore()) {
    return
  }

  try {
    await del(pathname, { token: requireBlobToken() })
  } catch {
    // Ignore missing blobs.
  }
}

export async function listBlobPaths(prefix: string) {
  if (!hasBlobStore()) {
    return [] as string[]
  }

  const token = requireBlobToken()
  const pathnames: string[] = []
  let cursor: string | undefined

  do {
    const result = await list({ prefix, cursor, token })
    pathnames.push(...result.blobs.map((blob) => blob.pathname))
    cursor = result.hasMore ? result.cursor : undefined
  } while (cursor)

  return pathnames
}

export async function deleteBlobPrefix(prefix: string) {
  const pathnames = await listBlobPaths(prefix)
  if (pathnames.length === 0) {
    return
  }

  await del(pathnames, { token: requireBlobToken() })
}
export function readEnv(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string') {
    return undefined
  }

  const normalized = value.replace(/(?:\\r\\n|\\n|\\r)+$/g, '').trim()
  return normalized.length > 0 ? normalized : undefined
}
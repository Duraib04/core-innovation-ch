import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app'
import { type CollectionReference, type DocumentReference, getFirestore } from 'firebase-admin/firestore'
import { readEnv } from './env'

type FirebaseServiceAccount = {
  projectId: string
  clientEmail: string
  privateKey: string
}

let initialized = false

function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
}

function loadServiceAccount(): FirebaseServiceAccount | null {
  const rawJson = readEnv('FIREBASE_SERVICE_ACCOUNT_KEY') || readEnv('FIREBASE_SERVICE_ACCOUNT_JSON')
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson) as Partial<FirebaseServiceAccount>
      if (!parsed.projectId || !parsed.clientEmail || !parsed.privateKey) {
        return null
      }

      return {
        projectId: String(parsed.projectId),
        clientEmail: String(parsed.clientEmail),
        privateKey: normalizePrivateKey(String(parsed.privateKey))
      }
    } catch {
      return null
    }
  }

  const projectId = readEnv('FIREBASE_PROJECT_ID')
  const clientEmail = readEnv('FIREBASE_CLIENT_EMAIL')
  const privateKey = readEnv('FIREBASE_PRIVATE_KEY')
  if (!projectId || !clientEmail || !privateKey) {
    return null
  }

  return {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey)
  }
}

export function hasFirebaseConfig() {
  return Boolean(loadServiceAccount())
}

export function getFirestoreDb() {
  const serviceAccount = loadServiceAccount()
  if (!serviceAccount) {
    throw new Error('Firebase is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.')
  }

  if (!initialized) {
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
        projectId: serviceAccount.projectId
      })
    }
    initialized = true
  }

  return getFirestore()
}

export async function deleteDocumentTree(reference: DocumentReference) {
  const subcollections = await reference.listCollections()
  for (const collection of subcollections) {
    await deleteCollectionTree(collection)
  }
  await reference.delete()
}

export async function deleteCollectionTree(collection: CollectionReference) {
  const snapshot = await collection.get()
  for (const document of snapshot.docs) {
    await deleteDocumentTree(document.ref)
  }
}

export async function listCollectionDocuments<T>(collection: CollectionReference) {
  const snapshot = await collection.get()
  return snapshot.docs.map((document) => ({ id: document.id, ...(document.data() as T) }))
}

export async function replaceCollectionDocuments<T extends { id: string }>(collection: CollectionReference, documents: T[]) {
  await deleteCollectionTree(collection)
  await Promise.all(documents.map((document) => collection.doc(document.id).set(document)))
}

export async function upsertDocument<T extends Record<string, unknown>>(reference: DocumentReference, data: T) {
  await reference.set(data, { merge: true })
}
import { hasBlobStore, readJsonBlob, writeJsonBlob } from './blobStore'
import { getFirestoreDb, hasFirebaseConfig, listCollectionDocuments, replaceCollectionDocuments } from './firebaseStore'

export interface CustomerAccountRecord {
  id: string
  name: string
  email: string
  password_hash: string
  salt: string
  created_at: string
  status: 'active' | 'disabled'
  deleted_at: string
  updated_at: string
  updated_by: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

const CUSTOMER_ACCOUNTS_PATH = 'system/customer_accounts.json'
const CUSTOMER_ACCOUNTS_COLLECTION = 'customer_accounts'

export async function listCustomerAccounts() {
  if (hasFirebaseConfig()) {
    const db = getFirestoreDb()
    const documents = await listCollectionDocuments<CustomerAccountRecord>(db.collection(CUSTOMER_ACCOUNTS_COLLECTION))
    return documents
      .map((account) => ({
        ...account,
        status: account.status || 'active',
        deleted_at: account.deleted_at || '',
        updated_at: account.updated_at || '',
        updated_by: account.updated_by || '',
        phone: account.phone || '',
        address: account.address || '',
        city: account.city || '',
        country: account.country || ''
      }))
      .sort((left, right) => right.created_at.localeCompare(left.created_at))
  }

  if (hasBlobStore()) {
    const accounts = await readJsonBlob<CustomerAccountRecord[]>(CUSTOMER_ACCOUNTS_PATH, [])
    return Array.isArray(accounts) ? accounts : []
  }

  return []
}

export async function saveCustomerAccounts(accounts: CustomerAccountRecord[]) {
  if (hasFirebaseConfig()) {
    const db = getFirestoreDb()
    await replaceCollectionDocuments(db.collection(CUSTOMER_ACCOUNTS_COLLECTION), accounts)
    return
  }

  if (hasBlobStore()) {
    await writeJsonBlob(CUSTOMER_ACCOUNTS_PATH, accounts)
  }
}
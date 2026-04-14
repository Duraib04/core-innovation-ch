import { deleteBlobPath, deleteBlobPrefix, hasBlobStore, listBlobPaths, readJsonBlob, writeJsonBlob } from './blobStore'
import { deleteDocumentTree, getFirestoreDb, hasFirebaseConfig, listCollectionDocuments } from './firebaseStore'

function getTablePath(dbName: string, tableName: string) {
  return `ddsql/${dbName}/${tableName}.json`
}

function getDatabaseRef(dbName: string) {
  return getFirestoreDb().collection('ddsql_databases').doc(dbName)
}

function getTablesCollection(dbName: string) {
  return getDatabaseRef(dbName).collection('tables')
}

function getTableRef(dbName: string, tableName: string) {
  return getTablesCollection(dbName).doc(tableName)
}

function getRowsCollection(dbName: string, tableName: string) {
  return getTableRef(dbName, tableName).collection('rows')
}

function sortRows(rows: Record<string, unknown>[]) {
  return [...rows].sort((left, right) => {
    const leftStamp = String(left.created_at || left.createdAt || left.updated_at || left.updatedAt || left.id || '')
    const rightStamp = String(right.created_at || right.createdAt || right.updated_at || right.updatedAt || right.id || '')
    return rightStamp.localeCompare(leftStamp)
  })
}

// Database operations – backed by Firebase Firestore
export class DdSQL {
  static async createDatabase(_dbName: string): Promise<boolean> {
    try {
      if (hasFirebaseConfig()) {
        await getDatabaseRef(_dbName).set({
          name: _dbName,
          created_at: new Date().toISOString()
        }, { merge: true })
        return true
      }

      return hasBlobStore() ? true : false
    } catch { return false }
  }

  static async deleteDatabase(dbName: string): Promise<boolean> {
    try {
      if (hasFirebaseConfig()) {
        await deleteDocumentTree(getDatabaseRef(dbName))
        return true
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        await deleteBlobPrefix(`ddsql/${dbName}/`)
        return true
      }
    } catch { return false }

    return false
  }

  static async listDatabases(): Promise<string[]> {
    try {
      if (hasFirebaseConfig()) {
        const snapshot = await getFirestoreDb().collection('ddsql_databases').get()
        return snapshot.docs.map((document) => document.id).sort()
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        const pathnames = await listBlobPaths('ddsql/')
        return Array.from(new Set(pathnames.map((pathname) => pathname.split('/')[1]).filter(Boolean))).sort()
      }
    } catch { return [] }

    return []
  }

  static async createTable(
    dbName: string,
    tableName: string,
    _schema: Record<string, string>
  ): Promise<boolean> {
    try {
      if (hasFirebaseConfig()) {
        await getTableRef(dbName, tableName).set({
          name: tableName,
          schema: _schema,
          created_at: new Date().toISOString()
        }, { merge: true })
        return true
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        const tablePath = getTablePath(dbName, tableName)
        const existing = await readJsonBlob<Record<string, unknown>[]>(tablePath, [])
        if (existing.length === 0) {
          await writeJsonBlob(tablePath, [])
        }
        return true
      }
    } catch { return false }

    return false
  }

  static async listTables(dbName: string): Promise<string[]> {
    try {
      if (hasFirebaseConfig()) {
        const snapshot = await getTablesCollection(dbName).get()
        return snapshot.docs.map((document) => document.id).sort()
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        const pathnames = await listBlobPaths(`ddsql/${dbName}/`)
        return pathnames
          .map((pathname) => pathname.split('/').pop() || '')
          .filter(Boolean)
          .map((filename) => filename.replace(/\.json$/i, ''))
          .sort()
      }
    } catch { return [] }

    return []
  }

  static async deleteTable(dbName: string, tableName: string): Promise<boolean> {
    try {
      if (hasFirebaseConfig()) {
        await deleteDocumentTree(getTableRef(dbName, tableName))
        return true
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        await deleteBlobPath(getTablePath(dbName, tableName))
        return true
      }
    } catch { return false }

    return false
  }

  static async insertRow(
    dbName: string,
    tableName: string,
    rowData: Record<string, unknown>
  ): Promise<boolean> {
    try {
      if (hasFirebaseConfig()) {
        const id = rowData.id ? String(rowData.id) : Date.now().toString()
        const data = { ...rowData, id }
        await getRowsCollection(dbName, tableName).doc(id).set(data, { merge: true })
        return true
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        const tablePath = getTablePath(dbName, tableName)
        const rows = await readJsonBlob<Record<string, unknown>[]>(tablePath, [])
        const id = rowData.id ? String(rowData.id) : Date.now().toString()
        const data = { ...rowData, id }
        const nextRows = rows.filter((row) => String(row.id ?? '') !== id)
        nextRows.push(data)
        await writeJsonBlob(tablePath, nextRows)
        return true
      }
    } catch { return false }

    return false
  }

  static async getTableData(
    dbName: string,
    tableName: string
  ): Promise<Record<string, unknown>[]> {
    try {
      if (hasFirebaseConfig()) {
        const rows = await listCollectionDocuments<Record<string, unknown>>(getRowsCollection(dbName, tableName))
        return sortRows(rows)
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        return await readJsonBlob<Record<string, unknown>[]>(getTablePath(dbName, tableName), [])
      }
    } catch { return [] }

    return []
  }

  static async deleteRow(
    dbName: string,
    tableName: string,
    rowId: string
  ): Promise<boolean> {
    try {
      if (hasFirebaseConfig()) {
        await getRowsCollection(dbName, tableName).doc(rowId).delete()
        return true
      }

      if (!hasFirebaseConfig() && hasBlobStore()) {
        const tablePath = getTablePath(dbName, tableName)
        const rows = await readJsonBlob<Record<string, unknown>[]>(tablePath, [])
        await writeJsonBlob(
          tablePath,
          rows.filter((row) => String(row.id ?? '') !== rowId)
        )
        return true
      }
    } catch { return false }

    return false
  }

  static async queryTable(
    dbName: string,
    tableName: string,
    filter?: Record<string, unknown>
  ): Promise<Record<string, unknown>[]> {
    try {
      const rows = await this.getTableData(dbName, tableName)
      if (!filter) return rows
      return rows.filter((row) =>
        Object.entries(filter).every(([key, value]) => row[key] === value)
      )
    } catch { return [] }
  }
}

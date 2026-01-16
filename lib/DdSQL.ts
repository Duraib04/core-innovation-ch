import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const ENCRYPTION_KEY = process.env.DDSQL_KEY || 'dd-shop-default-secure-key-change-in-production-12345'
const DATA_DIR = path.join(process.cwd(), 'data', 'DdSQL')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

interface EncryptedData {
  iv: string
  encryptedData: string
}

// Encryption utilities
function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32),
    iv
  )
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return { iv: iv.toString('hex'), encryptedData: encrypted }
}

function decrypt(data: EncryptedData): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32),
    Buffer.from(data.iv, 'hex')
  )
  let decrypted = decipher.update(data.encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

// Database operations
export class DdSQL {
  static listDatabases(): string[] {
    try {
      if (!fs.existsSync(DATA_DIR)) return []
      return fs.readdirSync(DATA_DIR).filter(f => fs.statSync(path.join(DATA_DIR, f)).isDirectory())
    } catch {
      return []
    }
  }

  static createDatabase(dbName: string): boolean {
    try {
      const dbPath = path.join(DATA_DIR, dbName)
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true })
        // Create metadata file
        const metadata = { name: dbName, created: new Date().toISOString(), tables: [] }
        const encrypted = encrypt(JSON.stringify(metadata))
        fs.writeFileSync(path.join(dbPath, 'metadata.json'), JSON.stringify(encrypted))
        return true
      }
      return false
    } catch {
      return false
    }
  }

  static deleteDatabase(dbName: string): boolean {
    try {
      const dbPath = path.join(DATA_DIR, dbName)
      if (fs.existsSync(dbPath)) {
        fs.rmSync(dbPath, { recursive: true, force: true })
        return true
      }
      return false
    } catch {
      return false
    }
  }

  static listTables(dbName: string): string[] {
    try {
      const dbPath = path.join(DATA_DIR, dbName)
      if (!fs.existsSync(dbPath)) return []
      return fs.readdirSync(dbPath).filter(f => f.endsWith('.table') && fs.statSync(path.join(dbPath, f)).isFile())
    } catch {
      return []
    }
  }

  static createTable(dbName: string, tableName: string, schema: Record<string, string>): boolean {
    try {
      const dbPath = path.join(DATA_DIR, dbName)
      if (!fs.existsSync(dbPath)) return false
      
      const tableFile = path.join(dbPath, `${tableName}.table`)
      const tableData = {
        name: tableName,
        schema: schema,
        rows: [],
        created: new Date().toISOString()
      }
      const encrypted = encrypt(JSON.stringify(tableData))
      fs.writeFileSync(tableFile, JSON.stringify(encrypted))
      return true
    } catch {
      return false
    }
  }

  static insertRow(dbName: string, tableName: string, rowData: Record<string, unknown>): boolean {
    try {
      const tableFile = path.join(DATA_DIR, dbName, `${tableName}.table`)
      if (!fs.existsSync(tableFile)) return false
      
      const encryptedContent = JSON.parse(fs.readFileSync(tableFile, 'utf8'))
      const tableData = JSON.parse(decrypt(encryptedContent))
      
      tableData.rows.push({ ...rowData, id: Date.now().toString() })
      
      const encrypted = encrypt(JSON.stringify(tableData))
      fs.writeFileSync(tableFile, JSON.stringify(encrypted))
      return true
    } catch {
      return false
    }
  }

  static getTableData(dbName: string, tableName: string): Record<string, unknown>[] {
    try {
      const tableFile = path.join(DATA_DIR, dbName, `${tableName}.table`)
      if (!fs.existsSync(tableFile)) return []
      
      const encryptedContent = JSON.parse(fs.readFileSync(tableFile, 'utf8'))
      const tableData = JSON.parse(decrypt(encryptedContent))
      return tableData.rows || []
    } catch {
      return []
    }
  }

  static deleteRow(dbName: string, tableName: string, rowId: string): boolean {
    try {
      const tableFile = path.join(DATA_DIR, dbName, `${tableName}.table`)
      if (!fs.existsSync(tableFile)) return false
      
      const encryptedContent = JSON.parse(fs.readFileSync(tableFile, 'utf8'))
      const tableData = JSON.parse(decrypt(encryptedContent))
      
      tableData.rows = tableData.rows.filter((row: Record<string, unknown>) => row.id !== rowId)
      
      const encrypted = encrypt(JSON.stringify(tableData))
      fs.writeFileSync(tableFile, JSON.stringify(encrypted))
      return true
    } catch {
      return false
    }
  }

  static deleteTable(dbName: string, tableName: string): boolean {
    try {
      const tableFile = path.join(DATA_DIR, dbName, `${tableName}.table`)
      if (fs.existsSync(tableFile)) {
        fs.unlinkSync(tableFile)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  static queryTable(dbName: string, tableName: string, filter?: Record<string, unknown>): Record<string, unknown>[] {
    try {
      let rows = this.getTableData(dbName, tableName)
      
      if (filter) {
        rows = rows.filter(row => {
          return Object.entries(filter).every(([key, value]) => row[key] === value)
        })
      }
      
      return rows
    } catch {
      return []
    }
  }
}

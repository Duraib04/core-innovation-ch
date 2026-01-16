'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiDatabase, FiTable, FiPlus, FiTrash2, FiRefreshCw, FiLogOut } from 'react-icons/fi'

interface DatabaseItem {
  name: string
}

interface TableItem {
  name: string
}

interface TableSchema {
  [key: string]: string
}

export default function DdSQLPage() {
  const router = useRouter()
  const [databases, setDatabases] = useState<DatabaseItem[]>([])
  const [selectedDb, setSelectedDb] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [tables, setTables] = useState<TableItem[]>([])
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateDb, setShowCreateDb] = useState(false)
  const [showCreateTable, setShowCreateTable] = useState(false)
  const [newDbName, setNewDbName] = useState('')
  const [newTableName, setNewTableName] = useState('')
  const [newTableSchema, setNewTableSchema] = useState<TableSchema>({})
  const [schemaField, setSchemaField] = useState({ name: '', type: 'string' })

  // Fetch databases on mount
  useEffect(() => {
    loadDatabases()
  }, [])

  const loadDatabases = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ddsql?action=listDatabases')
      const data = await response.json()
      console.log('Databases loaded:', data)
      setDatabases(data.databases || [])
    } catch (err) {
      console.error('Error loading databases:', err)
      alert(`Error loading databases: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const loadTables = async (dbName: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ddsql?action=listTables&db=${dbName}`)
      const data = await response.json()
      setSelectedDb(dbName)
      setTables(data.tables || [])
      setSelectedTable(null)
      setTableData([])
    } catch (err) {
      alert('Error loading tables')
    } finally {
      setLoading(false)
    }
  }

  const loadTableData = async (dbName: string, tableName: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/ddsql?action=getTableData&db=${dbName}&table=${tableName}`)
      const data = await response.json()
      setSelectedTable(tableName)
      setTableData(data.data || [])
    } catch (err) {
      alert('Error loading table data')
    } finally {
      setLoading(false)
    }
  }

  const createDatabase = async () => {
    if (!newDbName.trim()) return
    try {
      const response = await fetch('/api/ddsql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'createDatabase', db: newDbName })
      })
      const data = await response.json()
      console.log('Create database response:', { status: response.status, data })
      
      if (response.ok && data.success) {
        setNewDbName('')
        setShowCreateDb(false)
        await loadDatabases()
      } else {
        alert(`Failed to create database: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('Error creating database:', err)
      alert(`Error creating database: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const deleteDatabase = async (dbName: string) => {
    if (!confirm(`Delete database "${dbName}"?`)) return
    try {
      const response = await fetch('/api/ddsql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteDatabase', db: dbName })
      })
      if (response.ok) {
        setSelectedDb(null)
        loadDatabases()
      }
    } catch (err) {
      alert('Error deleting database')
    }
  }

  const createTable = async () => {
    if (!newTableName.trim() || Object.keys(newTableSchema).length === 0) {
      alert('Table name and schema required')
      return
    }
    try {
      const response = await fetch('/api/ddsql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createTable',
          db: selectedDb,
          table: newTableName,
          schema: newTableSchema
        })
      })
      if (response.ok) {
        setNewTableName('')
        setNewTableSchema({})
        setShowCreateTable(false)
        if (selectedDb) loadTables(selectedDb)
      }
    } catch (err) {
      alert('Error creating table')
    }
  }

  const deleteTable = async (tableName: string) => {
    if (!confirm(`Delete table "${tableName}"?`)) return
    try {
      const response = await fetch('/api/ddsql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteTable',
          db: selectedDb,
          table: tableName
        })
      })
      if (response.ok && selectedDb) {
        setSelectedTable(null)
        loadTables(selectedDb)
      }
    } catch (err) {
      alert('Error deleting table')
    }
  }

  const deleteRow = async (rowId: string) => {
    if (!selectedDb || !selectedTable) return
    try {
      const response = await fetch('/api/ddsql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deleteRow',
          db: selectedDb,
          table: selectedTable,
          data: { id: rowId }
        })
      })
      if (response.ok) {
        loadTableData(selectedDb, selectedTable)
      }
    } catch (err) {
      alert('Error deleting row')
    }
  }

  const initializeSampleData = async () => {
    try {
      const response = await fetch('/api/ddsql/init', { method: 'POST' })
      const data = await response.json()
      if (response.ok) {
        alert(`Database initialized!\n\nCreated:\n- ${Object.keys(data.data).map((k: string) => `${data.data[k as keyof typeof data.data]} ${k}`).join('\n- ')}`)
        await loadDatabases()
        // Auto-select the new ecommerce DB and load its tables
        setSelectedDb('ecommerce')
        await loadTables('ecommerce')
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const generatePersonas = async () => {
    try {
      const res = await fetch('/api/ddsql/personas', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        alert(`Personas generated for ${data.count} customers.`)
        // Ensure ecommerce is selected and tables refreshed
        await loadDatabases()
        setSelectedDb('ecommerce')
        await loadTables('ecommerce')
      } else {
        alert(`Failed to generate personas: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black border-b border-primary/20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold glow">DdSQL - Admin Dashboard</h1>
          <div className="flex gap-3">
            <motion.button
              onClick={initializeSampleData}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm font-semibold"
            >
              <FiPlus size={16} />
              Load Sample Data
            </motion.button>
            <motion.button
              onClick={generatePersonas}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-semibold"
            >
              Generate Personas
            </motion.button>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <FiLogOut />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-3 gap-6">
        {/* Left Panel: Databases */}
        <div className="col-span-1 bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiDatabase /> Databases
            </h2>
            <motion.button
              onClick={() => setShowCreateDb(true)}
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-primary/20 hover:bg-primary/40 rounded-lg"
            >
              <FiPlus />
            </motion.button>
          </div>

          <div className="space-y-2">
            {databases.map((db: DatabaseItem) => (
              <motion.div
                key={db.name}
                whileHover={{ x: 4 }}
                className={`p-3 rounded-lg cursor-pointer transition-all border ${
                  selectedDb === db.name
                    ? 'bg-primary/30 border-primary'
                    : 'bg-gray-800 border-gray-700 hover:border-primary/50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span onClick={() => loadTables(db.name)} className="flex-1">
                    {db.name}
                  </span>
                  <motion.button
                    onClick={() => deleteDatabase(db.name)}
                    whileHover={{ scale: 1.2 }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 size={16} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Create Database Modal */}
          <AnimatePresence>
            {showCreateDb && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCreateDb(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-gray-900 to-black border border-primary/30 rounded-xl p-6 max-w-md w-full"
                >
                  <h3 className="text-xl font-bold mb-4">Create Database</h3>
                  <input
                    type="text"
                    value={newDbName}
                    onChange={(e) => setNewDbName(e.target.value)}
                    placeholder="Database name"
                    className="w-full px-4 py-2 bg-gray-800 border border-primary/20 rounded-lg mb-4"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      onClick={createDatabase}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 py-2 bg-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50"
                    >
                      Create
                    </motion.button>
                    <motion.button
                      onClick={() => setShowCreateDb(false)}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Middle Panel: Tables */}
        <div className="col-span-1 bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiTable /> Tables
            </h2>
            <motion.button
              onClick={() => setShowCreateTable(true)}
              disabled={!selectedDb}
              whileHover={{ scale: 1.1 }}
              className="p-2 bg-primary/20 hover:bg-primary/40 rounded-lg disabled:opacity-50"
            >
              <FiPlus />
            </motion.button>
          </div>

          {selectedDb ? (
            <div className="space-y-2">
              {tables.map((table: TableItem) => (
                <motion.div
                  key={table.name}
                  whileHover={{ x: 4 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    selectedTable === table.name
                      ? 'bg-secondary/30 border-secondary'
                      : 'bg-gray-800 border-gray-700 hover:border-secondary/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span onClick={() => loadTableData(selectedDb, table.name)} className="flex-1">
                      {table.name}
                    </span>
                    <motion.button
                      onClick={() => deleteTable(table.name)}
                      whileHover={{ scale: 1.2 }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Select a database first</p>
          )}

          {/* Create Table Modal */}
          <AnimatePresence>
            {showCreateTable && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setShowCreateTable(false)}
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gradient-to-br from-gray-900 to-black border border-primary/30 rounded-xl p-6 max-w-md w-full"
                >
                  <h3 className="text-xl font-bold mb-4">Create Table</h3>
                  <input
                    type="text"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    placeholder="Table name"
                    className="w-full px-4 py-2 bg-gray-800 border border-primary/20 rounded-lg mb-4"
                  />
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Schema</p>
                    <div className="space-y-2 mb-3">
                      {Object.entries(newTableSchema).map(([field, type]) => (
                        <div key={field} className="flex justify-between items-center text-sm bg-gray-800 p-2 rounded">
                          <span>{field} ({type})</span>
                          <button
                            onClick={() => {
                              const newSchema = { ...newTableSchema }
                              delete newSchema[field]
                              setNewTableSchema(newSchema)
                            }}
                            className="text-red-400"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={schemaField.name}
                        onChange={(e) => setSchemaField({ ...schemaField, name: e.target.value })}
                        placeholder="Field name"
                        className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      />
                      <select
                        value={schemaField.type}
                        onChange={(e) => setSchemaField({ ...schemaField, type: e.target.value })}
                        className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
                      >
                        <option>string</option>
                        <option>number</option>
                        <option>boolean</option>
                        <option>date</option>
                      </select>
                      <button
                        onClick={() => {
                          if (schemaField.name) {
                            setNewTableSchema({ ...newTableSchema, [schemaField.name]: schemaField.type })
                            setSchemaField({ name: '', type: 'string' })
                          }
                        }}
                        className="px-2 py-1 bg-primary rounded text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      onClick={createTable}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 py-2 bg-primary rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50"
                    >
                      Create
                    </motion.button>
                    <motion.button
                      onClick={() => setShowCreateTable(false)}
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Data */}
        <div className="col-span-1 bg-gradient-to-br from-gray-900 to-black border border-primary/20 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Data Preview</h2>
          
          {selectedTable && tableData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-700">
                  <tr>
                    {Object.keys(tableData[0]).map(key => (
                      <th key={key} className="text-left p-2 font-semibold text-primary">{key}</th>
                    ))}
                    <th className="text-left p-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  {tableData.map((row: Record<string, unknown>) => (
                    <tr key={String(row.id)} className="border-b border-gray-800 hover:bg-gray-800/50">
                      {Object.values(row).map((value, i) => (
                        <td key={i} className="p-2 text-gray-300 text-xs truncate">
                          {String(value)}
                        </td>
                      ))}
                      <td className="p-2">
                        <motion.button
                          onClick={() => deleteRow(String(row.id))}
                          whileHover={{ scale: 1.2 }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 size={14} />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">{selectedTable ? 'No data yet' : 'Select a table to view data'}</p>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useMemo, useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  status: string
  deletedAt?: string
  updatedAt?: string
  phone?: string
  address?: string
  city?: string
  country?: string
}

export default function AdminUsersPage() {
  const [secret, setSecret] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', city: '', country: '' })
  const [editing, setEditing] = useState<User | null>(null)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query) return users
    const q = query.toLowerCase()
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, query])

  const fetchUsers = async () => {
    if (!secret) {
      setError('Enter admin secret to load users')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users?q=' + encodeURIComponent(query), {
        headers: { 'x-admin-secret': secret }
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to load users')
      setUsers(json.users || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // do nothing until secret entered
  }, [])

  const handleCreate = async () => {
    if (!secret) return setError('Enter admin secret')
    if (!form.name || !form.email || !form.password) {
      setError('Name, email, password are required')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret
        },
        body: JSON.stringify(form)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create user')
      setUsers((prev) => [json.user, ...prev])
      setForm({ name: '', email: '', password: '', phone: '', address: '', city: '', country: '' })
    } catch (e: any) {
      setError(e.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (status?: string) => {
    if (!secret || !editing) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret
        },
        body: JSON.stringify({
          id: editing.id,
          name: editing.name,
          email: editing.email,
          phone: editing.phone,
          address: editing.address,
          city: editing.city,
          country: editing.country,
          status: status || editing.status
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Update failed')
      setUsers((prev) => prev.map((u) => (u.id === json.user.id ? json.user : u)))
      setEditing(null)
    } catch (e: any) {
      setError(e.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async (id: string) => {
    if (!secret) return
    if (!confirm('Disable this user?')) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret
        },
        body: JSON.stringify({ id })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Disable failed')
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'disabled', deletedAt: new Date().toISOString() } : u)))
    } catch (e: any) {
      setError(e.message || 'Disable failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-3 md:p-6 space-y-4 md:space-y-6 pt-24 md:pt-6">
      <div className="w-full px-4 md:px-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 flex-wrap">
          <input
            type="password"
            placeholder="Admin secret"
            className="px-3 py-2 rounded border border-white/20 bg-black text-white text-sm flex-1 sm:w-64"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
          <button
            onClick={fetchUsers}
            className="px-4 py-2 rounded bg-white text-black font-semibold disabled:opacity-50 text-sm whitespace-nowrap"
            disabled={loading}
          >
            Load
          </button>
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-2 rounded border border-white/20 bg-black text-white text-sm flex-1 sm:w-72"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {error && <div className="text-red-300 text-sm">{error}</div>}

        <div className="p-3 md:p-4 border border-white/15 rounded-xl bg-[#0a0a0a] space-y-3">
          <p className="font-semibold text-sm">Add User</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            <input className="input text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input text-sm" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <input className="input text-sm" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input text-sm" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input className="input text-sm" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input className="input text-sm" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
          </div>
          <button onClick={handleCreate} className="px-4 py-2 rounded bg-white text-black font-semibold w-full sm:w-fit text-sm" disabled={loading}>
            Create User
          </button>
        </div>

        <div className="space-y-2">
          {loading && <p className="text-sm text-white/60">Loading...</p>}
          {!loading && filtered.length === 0 && <p className="text-sm text-white/60">No users</p>}
          <div className="grid gap-3">
            {filtered.map((u) => (
              <div key={u.id} className="border border-white/15 rounded-xl p-4 bg-[#0c0c0c] flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 justify-between">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-sm text-white/70">{u.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${u.status === 'disabled' ? 'bg-red-900/40 text-red-200' : 'bg-green-900/30 text-green-200'}`}>
                    {u.status}
                  </span>
                </div>
                <div className="text-xs text-white/60 flex flex-wrap gap-3">
                  <span>Created: {new Date(u.createdAt).toLocaleString()}</span>
                  {u.updatedAt && <span>Updated: {new Date(u.updatedAt).toLocaleString()}</span>}
                  {u.deletedAt && <span>Disabled: {new Date(u.deletedAt).toLocaleString()}</span>}
                </div>
                {editing?.id === u.id ? (
                  <div className="grid sm:grid-cols-2 gap-2">
                    <input className="input" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                    <input className="input" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                    <input className="input" value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} placeholder="Phone" />
                    <input className="input" value={editing.address || ''} onChange={(e) => setEditing({ ...editing, address: e.target.value })} placeholder="Address" />
                    <input className="input" value={editing.city || ''} onChange={(e) => setEditing({ ...editing, city: e.target.value })} placeholder="City" />
                    <input className="input" value={editing.country || ''} onChange={(e) => setEditing({ ...editing, country: e.target.value })} placeholder="Country" />
                    <div className="flex gap-2">
                      <button className="px-3 py-2 rounded bg-white text-black text-sm" onClick={() => handleUpdate()}>Save</button>
                      <button className="px-3 py-2 rounded border border-white/30 text-sm" onClick={() => setEditing(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 text-sm">
                    <button className="px-3 py-1 rounded border border-white/30" onClick={() => setEditing(u)}>Edit</button>
                    {u.status !== 'disabled' && (
                      <button className="px-3 py-1 rounded border border-red-300 text-red-200" onClick={() => handleDisable(u.id)}>
                        Disable
                      </button>
                    )}
                    {u.status === 'disabled' && (
                      <button className="px-3 py-1 rounded border border-green-300 text-green-200" onClick={() => { setEditing({ ...u, status: 'active' }); handleUpdate('active') }}>
                        Re-activate
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

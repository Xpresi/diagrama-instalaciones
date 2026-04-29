import { useState, useMemo } from 'react'
import { useSchema } from '../store/SchemaContext'

export default function Buscador({ onSelect }) {
  const { state } = useSchema()
  const [query, setQuery] = useState('')

  const resultados = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return state.nodes.filter(n =>
      n.id.toLowerCase().includes(q) ||
      (n.data.nombre || '').toLowerCase().includes(q)
    ).slice(0, 8)
  }, [query, state.nodes])

  return (
    <div className="relative flex-1">
      <input
        type="search"
        placeholder="Buscar por código o nombre..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full bg-slate-700 text-white rounded-xl px-4 py-2 text-sm outline-none border border-slate-600 focus:border-blue-500 placeholder-slate-400"
      />
      {resultados.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
          {resultados.map(n => (
            <button
              key={n.id}
              onClick={() => { onSelect(n.id); setQuery('') }}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700 border-b border-slate-700 last:border-0"
            >
              <span className="font-bold text-blue-300">{n.id}</span>
              {n.data.nombre && <span className="text-slate-300 ml-2">{n.data.nombre}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'

export default function ModalGuardar({ onConfirm, onClose }) {
  const [nombre, setNombre] = useState('diagrama')

  function handleConfirm() {
    const n = nombre.trim() || 'diagrama'
    onConfirm(n.endsWith('.json') ? n : n + '.json')
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-white font-bold text-lg mb-4 text-center">Guardar esquema</h2>
        <label className="text-xs text-slate-400 mb-1 block">Nombre del fichero</label>
        <div className="flex items-center gap-1 mb-6">
          <input
            autoFocus
            className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none border-2 border-slate-600 focus:border-blue-500"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            onKeyDown={handleKey}
          />
          <span className="text-slate-400 text-sm">.json</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-700 text-slate-300">Cancelar</button>
          <button onClick={handleConfirm} className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold">Guardar</button>
        </div>
      </div>
    </div>
  )
}

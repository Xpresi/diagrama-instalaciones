import { useState } from 'react'

export default function ModalCodigo({ prefijo, onConfirm, onClose }) {
  const [digitos, setDigitos] = useState('')

  function handleChange(e) {
    const v = e.target.value.replace(/\D/g, '').slice(0, 3)
    setDigitos(v)
  }

  function handleConfirm() {
    if (digitos.length === 3) onConfirm(digitos)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-slate-800 rounded-2xl p-6 w-72 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-white font-bold text-lg mb-4 text-center">Código de instalación</h2>
        <div className="flex items-center gap-2 mb-6 justify-center">
          <span className="text-blue-300 font-bold text-2xl">{prefijo}</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={3}
            value={digitos}
            onChange={handleChange}
            placeholder="000"
            autoFocus
            className="bg-slate-700 text-white text-2xl font-bold rounded-lg px-3 py-2 w-24 text-center outline-none border-2 border-slate-600 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl bg-slate-700 text-slate-300">Cancelar</button>
          <button
            onClick={handleConfirm}
            disabled={digitos.length !== 3}
            className="flex-1 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-40"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  )
}

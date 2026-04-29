import { useRef } from 'react'

export default function MenuPrincipal({ onGuardar, onCargar, onClose }) {
  const fileRef = useRef()

  function handleCargar(e) {
    const file = e.target.files[0]
    if (file) { onCargar(file); onClose() }
    e.target.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={onClose}>
      <div className="w-full bg-slate-800 rounded-t-2xl p-4 pb-8" onClick={e => e.stopPropagation()}>
        <h2 className="text-white font-bold text-lg mb-4 text-center">Esquema</h2>
        <div className="space-y-3">
          <button
            onClick={() => { onGuardar(); onClose() }}
            className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-left px-4"
          >
            Guardar esquema (JSON)
          </button>
          <button
            onClick={() => fileRef.current.click()}
            className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-left px-4"
          >
            Cargar esquema (JSON)
          </button>
        </div>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleCargar} />
      </div>
    </div>
  )
}

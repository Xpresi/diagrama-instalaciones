import { TIPOS } from '../constants/tiposInstalacion'

export default function SelectorTipo({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-slate-800 rounded-t-2xl p-4 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-white font-bold text-lg mb-4 text-center">Tipo de instalación</h2>
        <div className="grid grid-cols-2 gap-3">
          {TIPOS.map(t => (
            <button
              key={t.tipo}
              onClick={() => onSelect(t)}
              className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-xl p-4 text-left"
            >
              <span className="font-bold text-blue-300">{t.prefijo}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

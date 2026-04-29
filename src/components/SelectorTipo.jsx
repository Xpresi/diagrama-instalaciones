import { TIPOS } from '../constants/tiposInstalacion'

const RAYOS = [0, 45, 90, 135, 180, 225, 270, 315]

function FormaIcon({ forma }) {
  switch (forma) {
    case 'circulo':
      return <svg width="36" height="36" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" /></svg>
    case 'cuadrado':
      return <svg width="36" height="36" viewBox="0 0 48 48"><rect x="4" y="4" width="40" height="40" fill="#10b981" stroke="#6ee7b7" strokeWidth="2" /></svg>
    case 'triangulo':
      return <svg width="36" height="36" viewBox="0 0 48 48"><polygon points="24,4 44,44 4,44" fill="#f59e0b" stroke="#fcd34d" strokeWidth="2" /></svg>
    case 'rombo':
      return <svg width="36" height="36" viewBox="0 0 48 48"><polygon points="24,2 46,24 24,46 2,24" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="2" /></svg>
    case 'rectangulo':
      return <svg width="36" height="28" viewBox="0 0 64 40"><rect x="2" y="2" width="60" height="36" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" /></svg>
    case 'reloj':
      return <svg width="36" height="36" viewBox="0 0 48 48"><polygon points="4,4 44,4 24,24" fill="#06b6d4" stroke="#67e8f9" strokeWidth="2" /><polygon points="4,44 44,44 24,24" fill="#06b6d4" stroke="#67e8f9" strokeWidth="2" /></svg>
    case 'sol':
      return (
        <svg width="36" height="36" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="10" fill="#facc15" stroke="#fde68a" strokeWidth="2" />
          {RAYOS.map(deg => {
            const r = deg * Math.PI / 180
            return <line key={deg} x1={24 + 13 * Math.cos(r)} y1={24 + 13 * Math.sin(r)} x2={24 + 22 * Math.cos(r)} y2={24 + 22 * Math.sin(r)} stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
          })}
        </svg>
      )
    case 'olas':
      return (
        <svg width="36" height="36" viewBox="0 0 48 48">
          <path d="M2,14 Q10,6 18,14 Q26,22 34,14 Q42,6 50,14" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <path d="M2,24 Q10,16 18,24 Q26,32 34,24 Q42,16 50,24" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
          <path d="M2,34 Q10,26 18,34 Q26,42 34,34 Q42,26 50,34" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'rejilla':
      return (
        <svg width="36" height="36" viewBox="0 0 48 48">
          <rect x="2" y="2" width="44" height="44" fill="none" stroke="#a3e635" strokeWidth="2" />
          <line x1="17" y1="2"  x2="17" y2="46" stroke="#a3e635" strokeWidth="2" />
          <line x1="31" y1="2"  x2="31" y2="46" stroke="#a3e635" strokeWidth="2" />
          <line x1="2"  y1="17" x2="46" y2="17" stroke="#a3e635" strokeWidth="2" />
          <line x1="2"  y1="31" x2="46" y2="31" stroke="#a3e635" strokeWidth="2" />
        </svg>
      )
    default:
      return null
  }
}

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
              className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white rounded-xl p-3 flex items-center gap-3"
            >
              <FormaIcon forma={t.forma} />
              <span className="font-bold text-blue-300 text-lg">{t.prefijo}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

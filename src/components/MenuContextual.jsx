export default function MenuContextual({ x, y, onMover, onConectar, onEditar, onBorrar, onClose }) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="absolute bg-slate-800 rounded-2xl shadow-xl overflow-hidden w-48"
        style={{
          left: Math.min(x, window.innerWidth - 200),
          top: Math.min(y, window.innerHeight - 200),
        }}
        onClick={e => e.stopPropagation()}
      >
        {[
          { label: 'Mover',    action: onMover    },
          { label: 'Conectar', action: onConectar },
          { label: 'Editar',   action: onEditar   },
          { label: 'Borrar',   action: onBorrar, danger: true },
        ].map(item => (
          <button
            key={item.label}
            onClick={() => { item.action(); onClose() }}
            className={`w-full text-left px-4 py-3 text-sm border-b border-slate-700 last:border-0 ${item.danger ? 'text-red-400' : 'text-white'} hover:bg-slate-700`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

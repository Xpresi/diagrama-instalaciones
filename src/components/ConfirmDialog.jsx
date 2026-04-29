export default function ConfirmDialog({ mensaje, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-800 rounded-2xl p-6 w-72 shadow-xl">
        <p className="text-white text-center mb-6">{mensaje}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 rounded-xl bg-slate-700 text-slate-300">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 py-2 rounded-xl bg-red-600 text-white">Borrar</button>
        </div>
      </div>
    </div>
  )
}

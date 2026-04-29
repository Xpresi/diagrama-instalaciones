import Buscador from './Buscador'

export default function Toolbar({ onBuscarSelect, onMenuClick }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-30 bg-slate-900/90 backdrop-blur px-3 pt-3 pb-2 flex gap-2 items-center">
      <Buscador onSelect={onBuscarSelect} />
      <button
        onClick={onMenuClick}
        className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center text-lg shrink-0"
        aria-label="Menú"
      >
        ☰
      </button>
    </div>
  )
}

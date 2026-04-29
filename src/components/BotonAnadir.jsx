export default function BotonAnadir({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-3xl font-light shadow-lg flex items-center justify-center"
      aria-label="Añadir instalación"
    >
      +
    </button>
  )
}

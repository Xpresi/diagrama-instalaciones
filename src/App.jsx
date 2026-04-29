import { useState, useCallback } from 'react'
import './index.css'
import { SchemaProvider, useSchema } from './store/SchemaContext'
import { GRID_SIZE } from './constants/tiposInstalacion'
import Canvas from './components/Canvas'
import BotonAnadir from './components/BotonAnadir'
import SelectorTipo from './components/SelectorTipo'
import ModalCodigo from './components/ModalCodigo'

function AppContent() {
  const { state, dispatch } = useSchema()
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)
  const [rfInstance, setRfInstance] = useState(null)

  const handleLongPress = useCallback((nodeId, e) => {
    const touch = e.touches?.[0] || e
    console.log('longpress', nodeId, touch.clientX, touch.clientY)
    // será expandido en Task 6
  }, [])

  const handleDoubleTap = useCallback((nodeId) => {
    console.log('doubletap', nodeId)
    // será expandido en Task 6
  }, [])

  function buildNodeHandlers() {
    return {
      onLongPressId: handleLongPress,
      onDoubleTapId: handleDoubleTap,
    }
  }

  function handleSelectTipo(tipo) {
    setTipoSeleccionado(tipo)
    setMostrarSelector(false)
  }

  function handleConfirmCodigo(digitos) {
    const id = `${tipoSeleccionado.prefijo}${digitos}`
    const viewport = rfInstance?.getViewport() || { x: 0, y: 0, zoom: 1 }
    const centerX = (window.innerWidth / 2 - viewport.x) / viewport.zoom
    const centerY = (window.innerHeight / 2 - viewport.y) / viewport.zoom
    const snappedX = Math.round(centerX / GRID_SIZE) * GRID_SIZE
    const snappedY = Math.round(centerY / GRID_SIZE) * GRID_SIZE

    const node = {
      id,
      type: tipoSeleccionado.forma,
      position: { x: snappedX, y: snappedY },
      data: {
        id,
        tipo: tipoSeleccionado.tipo,
        nombre: '',
        valorMin: null,
        valorMax: null,
        cl: null,
        notas: '',
        ...buildNodeHandlers(),
      },
    }
    dispatch({ type: 'ADD_NODE', payload: node })
    setTipoSeleccionado(null)
  }

  return (
    <div className="w-screen h-screen bg-slate-900 overflow-hidden relative pt-14">
      <Canvas onInit={setRfInstance} />
      <BotonAnadir onClick={() => setMostrarSelector(true)} />
      {mostrarSelector && (
        <SelectorTipo onSelect={handleSelectTipo} onClose={() => setMostrarSelector(false)} />
      )}
      {tipoSeleccionado && (
        <ModalCodigo
          prefijo={tipoSeleccionado.prefijo}
          onConfirm={handleConfirmCodigo}
          onClose={() => setTipoSeleccionado(null)}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <SchemaProvider>
      <AppContent />
    </SchemaProvider>
  )
}

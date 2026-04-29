import { useState, useCallback } from 'react'
import './index.css'
import { SchemaProvider, useSchema } from './store/SchemaContext'
import { GRID_SIZE } from './constants/tiposInstalacion'
import Canvas from './components/Canvas'
import BotonAnadir from './components/BotonAnadir'
import SelectorTipo from './components/SelectorTipo'
import ModalCodigo from './components/ModalCodigo'
import MenuContextual from './components/MenuContextual'
import FichaInstalacion from './components/FichaInstalacion'
import ConfirmDialog from './components/ConfirmDialog'

function AppContent() {
  const { state, dispatch } = useSchema()
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)
  const [rfInstance, setRfInstance] = useState(null)
  const [menu, setMenu] = useState(null)           // { nodeId, x, y }
  const [fichaNodeId, setFichaNodeId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [conectandoDesde, setConectandoDesde] = useState(null)

  const handleLongPress = useCallback((nodeId, e) => {
    const touch = e.touches?.[0] || e
    setMenu({ nodeId, x: touch.clientX, y: touch.clientY })
  }, [])

  const handleDoubleTap = useCallback((nodeId) => {
    setFichaNodeId(nodeId)
  }, [])

  function buildNodeHandlers() {
    return { onLongPressId: handleLongPress, onDoubleTapId: handleDoubleTap }
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
      data: { id, tipo: tipoSeleccionado.tipo, nombre: '', valorMin: null, valorMax: null, cl: null, notas: '', ...buildNodeHandlers() },
    }
    dispatch({ type: 'ADD_NODE', payload: node })
    setTipoSeleccionado(null)
  }

  function handleConectar() {
    setConectandoDesde(menu.nodeId)
  }

  function confirmarBorrado() {
    dispatch({ type: 'DELETE_NODE', payload: confirmId })
    setConfirmId(null)
  }

  // Cuando se carga un esquema desde JSON, los nodos necesitan los handlers actualizados
  function refreshNodeHandlers(nodes) {
    return nodes.map(n => ({
      ...n,
      data: { ...n.data, ...buildNodeHandlers() },
    }))
  }

  return (
    <div className="w-screen h-screen bg-slate-900 overflow-hidden relative pt-14">
      <Canvas
        onInit={setRfInstance}
        conectandoDesde={conectandoDesde}
        onConectarCompletado={() => setConectandoDesde(null)}
      />
      <BotonAnadir onClick={() => setMostrarSelector(true)} />
      {conectandoDesde && (
        <div className="fixed top-16 left-0 right-0 z-30 flex justify-center pointer-events-none">
          <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            Pulsa la instalación destino
          </span>
        </div>
      )}
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
      {menu && (
        <MenuContextual
          x={menu.x}
          y={menu.y}
          onConectar={handleConectar}
          onEditar={() => setFichaNodeId(menu.nodeId)}
          onBorrar={() => setConfirmId(menu.nodeId)}
          onClose={() => setMenu(null)}
        />
      )}
      {fichaNodeId && (
        <FichaInstalacion nodeId={fichaNodeId} onClose={() => setFichaNodeId(null)} />
      )}
      {confirmId && (
        <ConfirmDialog
          mensaje={`¿Borrar la instalación ${confirmId} y todas sus conexiones?`}
          onConfirm={confirmarBorrado}
          onCancel={() => setConfirmId(null)}
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

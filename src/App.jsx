import { useState, useCallback, useMemo } from 'react'
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
import RamalEdge from './edges/RamalEdge'
import Toolbar from './components/Toolbar'
import MenuPrincipal from './components/MenuPrincipal'
import { useExportImport } from './hooks/useExportImport'

function AppContent() {
  const { state, dispatch } = useSchema()
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)
  const [rfInstance, setRfInstance] = useState(null)
  const [menu, setMenu] = useState(null)           // { nodeId, x, y }
  const [fichaNodeId, setFichaNodeId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [conectandoDesde, setConectandoDesde] = useState(null)
  const [menuMid, setMenuMid] = useState(null)     // { edgeId, x, y }
  const [mostrarMenu, setMostrarMenu] = useState(false)

  // Toque en el punto medio de una conexión
  const handleMidTap = useCallback((edgeId, midX, midY, e) => {
    if (conectandoDesde) {
      // El punto medio es el destino: crear ramal
      dispatch({
        type: 'ADD_EDGE',
        payload: {
          source: conectandoDesde,
          target: edgeId + '-mid',
          id: `edge-${Date.now()}`,
          type: 'ramal',
          data: { ramal: edgeId, onMidTap: handleMidTap, conectandoDesde: null },
        },
      })
      setConectandoDesde(null)
      return
    }
    // Obtener coordenadas de pantalla desde el evento
    const clientX = e?.nativeEvent?.clientX ?? e?.clientX ?? midX
    const clientY = e?.nativeEvent?.clientY ?? e?.clientY ?? midY
    setMenuMid({ edgeId, x: clientX, y: clientY })
  }, [conectandoDesde, dispatch])

  function buildEdgeHandlers() {
    return { onMidTap: handleMidTap, conectandoDesde }
  }

  const edgeTypes = useMemo(() => ({ ramal: RamalEdge }), [])
  const { exportar, importar } = useExportImport(state, dispatch)

  const handleNodeSingleTap = useCallback((nodeId, e) => {
    if (conectandoDesde) return // Canvas.jsx ya gestiona esto
    const touch = e.nativeEvent?.changedTouches?.[0] || e.nativeEvent || e
    setMenu({ nodeId, x: touch.clientX ?? touch.pageX ?? window.innerWidth / 2, y: touch.clientY ?? touch.pageY ?? window.innerHeight / 2 })
  }, [conectandoDesde])

  const handleNodeDoubleTap = useCallback((nodeId) => {
    setFichaNodeId(nodeId)
  }, [])

  function handleSelectTipo(tipo) {
    setTipoSeleccionado(tipo)
    setMostrarSelector(false)
  }

  function handleConfirmCodigo(digitos) {
    const id = `${tipoSeleccionado.prefijo}${digitos}`
    const viewport = rfInstance?.getViewport() || { x: 0, y: 0, zoom: 1 }
    const centerX = (window.innerWidth / 2 - viewport.x) / viewport.zoom
    const centerY = (window.innerHeight / 2 - viewport.y) / viewport.zoom
    dispatch({
      type: 'ADD_NODE',
      payload: {
        id,
        type: tipoSeleccionado.forma,
        position: { x: Math.round(centerX / GRID_SIZE) * GRID_SIZE, y: Math.round(centerY / GRID_SIZE) * GRID_SIZE },
        data: { id, tipo: tipoSeleccionado.tipo, nombre: '', valorMin: null, valorMax: null, cl: null, notas: '' },
      },
    })
    setTipoSeleccionado(null)
  }

  function confirmarBorrado() {
    dispatch({ type: 'DELETE_NODE', payload: confirmId })
    setConfirmId(null)
  }

  function handleBuscarSelect(nodeId) {
    const node = state.nodes.find(n => n.id === nodeId)
    if (node && rfInstance) {
      rfInstance.setCenter(node.position.x + 24, node.position.y + 24, { zoom: 1.5, duration: 500 })
    }
  }

  // Sincronizar conectandoDesde en los edges cuando cambia
  const nodesWithHandlers = state.nodes
  const edgesWithHandlers = useMemo(() =>
    state.edges.map(e => ({ ...e, data: { ...e.data, onMidTap: handleMidTap, conectandoDesde } })),
    [state.edges, handleMidTap, conectandoDesde]
  )

  return (
    <div className="w-screen h-screen bg-slate-900 overflow-hidden relative pt-14">
      <Toolbar onBuscarSelect={handleBuscarSelect} onMenuClick={() => setMostrarMenu(true)} />
      <Canvas
        onInit={setRfInstance}
        edgeTypes={edgeTypes}
        edgeData={buildEdgeHandlers()}
        edges={edgesWithHandlers}
        conectandoDesde={conectandoDesde}
        onConectarCompletado={() => setConectandoDesde(null)}
        onNodeSingleTap={handleNodeSingleTap}
        onNodeDoubleTap={handleNodeDoubleTap}
      />
      <BotonAnadir onClick={() => setMostrarSelector(true)} />
      {conectandoDesde && (
        <div className="fixed top-16 left-0 right-0 z-30 flex justify-center pointer-events-none">
          <span className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">
            Pulsa instalación o punto medio destino
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
          onConectar={() => setConectandoDesde(menu.nodeId)}
          onEditar={() => setFichaNodeId(menu.nodeId)}
          onBorrar={() => setConfirmId(menu.nodeId)}
          onClose={() => setMenu(null)}
        />
      )}
      {menuMid && (
        <div className="fixed inset-0 z-50" onClick={() => setMenuMid(null)}>
          <div
            className="absolute bg-slate-800 rounded-2xl shadow-xl overflow-hidden w-48"
            style={{ left: Math.min(menuMid.x, window.innerWidth - 200), top: Math.min(menuMid.y, window.innerHeight - 120) }}
            onClick={e => e.stopPropagation()}
          >
            {[
              { label: 'Conectar desde aquí', action: () => { setConectandoDesde(menuMid.edgeId + '-mid'); setMenuMid(null) } },
              { label: 'Eliminar conexión',   action: () => { dispatch({ type: 'DELETE_EDGE', payload: menuMid.edgeId }); setMenuMid(null) }, danger: true },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className={`w-full text-left px-4 py-3 text-sm border-b border-slate-700 last:border-0 hover:bg-slate-700 ${item.danger ? 'text-red-400' : 'text-white'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {fichaNodeId && (
        <FichaInstalacion nodeId={fichaNodeId} onClose={() => setFichaNodeId(null)} />
      )}
      {mostrarMenu && (
        <MenuPrincipal
          onGuardar={exportar}
          onCargar={(file) => importar(file, {}, buildEdgeHandlers())}
          onClose={() => setMostrarMenu(false)}
        />
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

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
import ModalGuardar from './components/ModalGuardar'
import { useExportImport } from './hooks/useExportImport'

function AppContent() {
  const { state, dispatch } = useSchema()
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null)
  const [rfInstance, setRfInstance] = useState(null)
  const [menu, setMenu] = useState(null)
  const [fichaNodeId, setFichaNodeId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [conectandoDesde, setConectandoDesde] = useState(null)
  const [menuMid, setMenuMid] = useState(null)   // { edgeId, flowX, flowY }
  const [mostrarMenu, setMostrarMenu] = useState(false)
  const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false)

  const edgeTypes = useMemo(() => ({ ramal: RamalEdge }), [])
  const { exportarConPicker, exportarConNombre, usaPicker, importar } = useExportImport(state, dispatch)

  // Crea un nodo de unión en el punto medio, parte la arista en dos
  function crearUnionEnMedio(edgeId, flowX, flowY) {
    const edge = state.edges.find(e => e.id === edgeId)
    if (!edge) return null
    const unionId = `union-${Date.now()}`
    dispatch({ type: 'DELETE_EDGE', payload: edgeId })
    dispatch({ type: 'ADD_NODE', payload: {
      id: unionId,
      type: 'union',
      position: { x: flowX - 8, y: flowY - 8 },
      data: { id: unionId, tipo: 0 },
    }})
    dispatch({ type: 'ADD_EDGE', payload: { id: `edge-${Date.now()}-a`, source: edge.source, target: unionId, type: 'ramal', data: {} }})
    dispatch({ type: 'ADD_EDGE', payload: { id: `edge-${Date.now()}-b`, source: unionId, target: edge.target, type: 'ramal', data: {} }})
    return unionId
  }

  const handleMidTap = useCallback((edgeId, flowX, flowY, screenX, screenY) => {
    if (conectandoDesde) {
      const unionId = crearUnionEnMedio(edgeId, flowX, flowY)
      if (unionId) {
        dispatch({ type: 'ADD_EDGE', payload: {
          id: `edge-${Date.now()}`,
          source: conectandoDesde,
          target: unionId,
          type: 'ramal',
          data: {},
        }})
        setConectandoDesde(null)
      }
      return
    }
    setMenuMid({ edgeId, flowX, flowY, screenX, screenY })
  }, [conectandoDesde, state.edges])

  const edgesWithHandlers = useMemo(() =>
    state.edges.map(e => ({ ...e, data: { ...e.data, onMidTap: handleMidTap, conectandoDesde } })),
    [state.edges, handleMidTap, conectandoDesde]
  )

  const handleNodeSingleTap = useCallback((nodeId, e) => {
    if (conectandoDesde) return
    // Nodos de unión: un toque inicia conexión directamente (sin menú)
    const node = state.nodes.find(n => n.id === nodeId)
    if (node?.type === 'union') {
      setConectandoDesde(nodeId)
      return
    }
    const touch = e.nativeEvent?.changedTouches?.[0] || e.nativeEvent || e
    const x = touch.clientX ?? touch.pageX ?? window.innerWidth / 2
    const y = touch.clientY ?? touch.pageY ?? window.innerHeight / 2
    setMenu({ nodeId, x, y })
  }, [conectandoDesde, state.nodes])

  const handleNodeDoubleTap = useCallback((nodeId) => {
    const node = state.nodes.find(n => n.id === nodeId)
    if (node?.type === 'union') return
    setFichaNodeId(nodeId)
  }, [state.nodes])

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

  return (
    <div className="w-screen h-screen bg-slate-900 overflow-hidden relative pt-14">
      <Toolbar onBuscarSelect={handleBuscarSelect} onMenuClick={() => setMostrarMenu(true)} />
      <Canvas
        onInit={setRfInstance}
        edgeTypes={edgeTypes}
        edges={edgesWithHandlers}
        conectandoDesde={conectandoDesde}
        onConectarCompletado={() => setConectandoDesde(null)}
        onNodeSingleTap={handleNodeSingleTap}
        onNodeDoubleTap={handleNodeDoubleTap}
      />
      {!fichaNodeId && <BotonAnadir onClick={() => setMostrarSelector(true)} />}
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
            className="absolute bg-slate-800 rounded-2xl shadow-xl overflow-hidden w-52"
            style={{ left: Math.min(menuMid.screenX ?? window.innerWidth / 2, window.innerWidth - 220), top: Math.min(menuMid.screenY ?? window.innerHeight / 2, window.innerHeight - 120) }}
            onClick={e => e.stopPropagation()}
          >
            {[
              {
                label: 'Conectar desde aquí',
                action: () => {
                  const unionId = crearUnionEnMedio(menuMid.edgeId, menuMid.flowX, menuMid.flowY)
                  if (unionId) setConectandoDesde(unionId)
                  setMenuMid(null)
                },
              },
              {
                label: 'Eliminar conexión',
                action: () => { dispatch({ type: 'DELETE_EDGE', payload: menuMid.edgeId }); setMenuMid(null) },
                danger: true,
              },
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
          onGuardar={() => {
            setMostrarMenu(false)
            if (usaPicker) exportarConPicker()
            else setMostrarModalGuardar(true)
          }}
          onCargar={(file) => importar(file, {}, {})}
          onClose={() => setMostrarMenu(false)}
        />
      )}
      {mostrarModalGuardar && (
        <ModalGuardar
          onConfirm={(nombre) => { exportarConNombre(nombre); setMostrarModalGuardar(false) }}
          onClose={() => setMostrarModalGuardar(false)}
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

import { useCallback } from 'react'
import {
  ReactFlow, Background, BackgroundVariant,
  applyNodeChanges, applyEdgeChanges,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useSchema } from '../store/SchemaContext'
import { GRID_SIZE } from '../constants/tiposInstalacion'

import CirculoNode    from '../nodes/CirculoNode'
import CuadradoNode   from '../nodes/CuadradoNode'
import TrianguloNode  from '../nodes/TrianguloNode'
import RomboNode      from '../nodes/RomboNode'
import RectanguloNode from '../nodes/RectanguloNode'
import RelojArenaNode from '../nodes/RelojArenaNode'
import SolNode        from '../nodes/SolNode'
import OlasNode       from '../nodes/OlasNode'
import RejillaNode    from '../nodes/RejillaNode'

const nodeTypes = {
  circulo:    CirculoNode,
  cuadrado:   CuadradoNode,
  triangulo:  TrianguloNode,
  rombo:      RomboNode,
  rectangulo: RectanguloNode,
  reloj:      RelojArenaNode,
  sol:        SolNode,
  olas:       OlasNode,
  rejilla:    RejillaNode,
}

export default function Canvas({ onInit, edgeTypes, edgeData, conectandoDesde, onConectarCompletado, moviendoNodeId, onMoverCompletado }) {
  const { state, dispatch } = useSchema()

  const onNodesChange = useCallback(changes => {
    dispatch({ type: 'SET_NODES', payload: applyNodeChanges(changes, state.nodes) })
  }, [state.nodes, dispatch])

  const onEdgesChange = useCallback(changes => {
    dispatch({ type: 'SET_EDGES', payload: applyEdgeChanges(changes, state.edges) })
  }, [state.edges, dispatch])

  const onConnect = useCallback(connection => {
    const edge = { ...connection, id: `edge-${Date.now()}`, type: 'ramal', data: edgeData || {} }
    dispatch({ type: 'ADD_EDGE', payload: edge })
  }, [dispatch, edgeData])

  const onNodeClick = useCallback((_e, node) => {
    if (conectandoDesde && conectandoDesde !== node.id) {
      const edge = {
        source: conectandoDesde.endsWith('-mid') ? conectandoDesde.replace('-mid', '').replace('edge-', '') : conectandoDesde,
        target: node.id,
        id: `edge-${Date.now()}`,
        type: 'ramal',
        data: { ...edgeData, ramal: conectandoDesde.endsWith('-mid') ? conectandoDesde.replace('-mid', '') : null },
      }
      dispatch({ type: 'ADD_EDGE', payload: edge })
      onConectarCompletado?.()
    }
  }, [conectandoDesde, dispatch, onConectarCompletado, edgeData])

  const onPaneClick = useCallback((e) => {
    if (!moviendoNodeId) return
    // Convertir coordenadas de pantalla a coordenadas del canvas
    const bounds = e.currentTarget?.getBoundingClientRect?.() || { left: 0, top: 0 }
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    const flowPos = { x: clientX - bounds.left, y: clientY - bounds.top }
    // React Flow expone screenToFlowPosition si tenemos la instancia, pero podemos usar la posición del evento
    // El evento onPaneClick de React Flow ya trae position en coordenadas del canvas
    const x = Math.round((e.position?.x ?? flowPos.x) / GRID_SIZE) * GRID_SIZE
    const y = Math.round((e.position?.y ?? flowPos.y) / GRID_SIZE) * GRID_SIZE
    dispatch({ type: 'UPDATE_NODE', payload: { id: moviendoNodeId, changes: { position: { x, y } } } })
    onMoverCompletado?.()
  }, [moviendoNodeId, dispatch, onMoverCompletado])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={state.nodes}
        edges={state.edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        fitView
        panOnScroll={false}
        zoomOnPinch={true}
        panOnDrag={!conectandoDesde && !moviendoNodeId}
        selectionOnDrag={false}
        onInit={onInit}
      >
        <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} color="#334155" />
      </ReactFlow>
    </div>
  )
}

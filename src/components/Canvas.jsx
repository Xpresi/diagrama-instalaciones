import { useCallback, useRef } from 'react'
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

export default function Canvas({ onInit, edgeTypes, edgeData, edges: edgesOverride, conectandoDesde, onConectarCompletado, onNodeSingleTap, onNodeDoubleTap }) {
  const { state, dispatch } = useSchema()
  const edges = edgesOverride ?? state.edges
  const lastTap = useRef({ nodeId: null, time: 0, timer: null })

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

  const onNodeClick = useCallback((e, node) => {
    // Modo conectar: el toque selecciona el destino directamente
    if (conectandoDesde && conectandoDesde !== node.id) {
      const edge = {
        source: conectandoDesde.endsWith('-mid') ? conectandoDesde.replace('-mid', '') : conectandoDesde,
        target: node.id,
        id: `edge-${Date.now()}`,
        type: 'ramal',
        data: { ...edgeData, ramal: conectandoDesde.endsWith('-mid') ? conectandoDesde : null },
      }
      dispatch({ type: 'ADD_EDGE', payload: edge })
      onConectarCompletado?.()
      return
    }

    const now = Date.now()
    const prev = lastTap.current

    if (prev.nodeId === node.id && now - prev.time < 350) {
      // Doble toque
      clearTimeout(prev.timer)
      lastTap.current = { nodeId: null, time: 0, timer: null }
      onNodeDoubleTap?.(node.id)
    } else {
      // Primer toque — esperar si viene un segundo
      clearTimeout(prev.timer)
      const timer = setTimeout(() => {
        lastTap.current = { nodeId: null, time: 0, timer: null }
        onNodeSingleTap?.(node.id, e)
      }, 350)
      lastTap.current = { nodeId: node.id, time: now, timer }
    }
  }, [conectandoDesde, dispatch, onConectarCompletado, edgeData, onNodeSingleTap, onNodeDoubleTap])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={state.nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        fitView
        panOnScroll={false}
        zoomOnPinch={true}
        panOnDrag={!conectandoDesde}
        selectionOnDrag={false}
        onInit={onInit}
      >
        <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} color="#334155" />
      </ReactFlow>
    </div>
  )
}

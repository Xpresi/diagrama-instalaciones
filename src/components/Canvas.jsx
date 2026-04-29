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

const nodeTypes = {
  circulo:    CirculoNode,
  cuadrado:   CuadradoNode,
  triangulo:  TrianguloNode,
  rombo:      RomboNode,
  rectangulo: RectanguloNode,
  reloj:      RelojArenaNode,
  sol:        SolNode,
  olas:       OlasNode,
}

export default function Canvas({ onInit, edgeTypes, conectandoDesde, onConectarCompletado }) {
  const { state, dispatch } = useSchema()

  const onNodesChange = useCallback(changes => {
    dispatch({ type: 'SET_NODES', payload: applyNodeChanges(changes, state.nodes) })
  }, [state.nodes, dispatch])

  const onEdgesChange = useCallback(changes => {
    dispatch({ type: 'SET_EDGES', payload: applyEdgeChanges(changes, state.edges) })
  }, [state.edges, dispatch])

  const onConnect = useCallback(connection => {
    const edge = { ...connection, id: `edge-${Date.now()}`, type: 'ramal' }
    dispatch({ type: 'ADD_EDGE', payload: edge })
  }, [dispatch])

  const onNodeClick = useCallback((_e, node) => {
    if (conectandoDesde && conectandoDesde !== node.id) {
      const edge = { source: conectandoDesde, target: node.id, id: `edge-${Date.now()}`, type: 'ramal' }
      dispatch({ type: 'ADD_EDGE', payload: edge })
      onConectarCompletado?.()
    }
  }, [conectandoDesde, dispatch, onConectarCompletado])

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={state.nodes}
        edges={state.edges}
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

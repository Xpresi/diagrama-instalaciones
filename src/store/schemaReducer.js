export const initialState = {
  nodes: [],
  edges: [],
}

export function schemaReducer(state, action) {
  switch (action.type) {

    case 'ADD_NODE':
      return { ...state, nodes: [...state.nodes, action.payload] }

    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(n =>
          n.id === action.payload.id
            ? { ...n, ...action.payload.changes, data: { ...n.data, ...action.payload.changes.data } }
            : n
        ),
      }

    case 'DELETE_NODE': {
      const id = action.payload
      return {
        nodes: state.nodes.filter(n => n.id !== id),
        edges: state.edges.filter(e => e.source !== id && e.target !== id),
      }
    }

    case 'ADD_EDGE':
      return { ...state, edges: [...state.edges, action.payload] }

    case 'DELETE_EDGE':
      return { ...state, edges: state.edges.filter(e => e.id !== action.payload) }

    case 'RENAME_NODE_ID': {
      const { oldId, newId } = action.payload
      return {
        nodes: state.nodes.map(n => n.id === oldId ? { ...n, id: newId } : n),
        edges: state.edges.map(e => ({
          ...e,
          source: e.source === oldId ? newId : e.source,
          target: e.target === oldId ? newId : e.target,
        })),
      }
    }

    case 'LOAD_SCHEMA':
      return action.payload

    case 'SET_NODES':
      return { ...state, nodes: action.payload }

    case 'SET_EDGES':
      return { ...state, edges: action.payload }

    default:
      return state
  }
}

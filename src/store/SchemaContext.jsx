import { createContext, useContext, useReducer } from 'react'
import { schemaReducer, initialState } from './schemaReducer'

const SchemaContext = createContext(null)

export function SchemaProvider({ children }) {
  const [state, dispatch] = useReducer(schemaReducer, initialState)
  return (
    <SchemaContext.Provider value={{ state, dispatch }}>
      {children}
    </SchemaContext.Provider>
  )
}

export function useSchema() {
  const ctx = useContext(SchemaContext)
  if (!ctx) throw new Error('useSchema debe usarse dentro de SchemaProvider')
  return ctx
}

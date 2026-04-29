import './index.css'
import { SchemaProvider } from './store/SchemaContext'

export default function App() {
  return (
    <SchemaProvider>
      <div className="w-screen h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Diagrama de Conexiones</p>
      </div>
    </SchemaProvider>
  )
}

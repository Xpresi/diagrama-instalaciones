import './index.css'
import { SchemaProvider } from './store/SchemaContext'
import Canvas from './components/Canvas'

function AppContent() {
  return (
    <div className="w-screen h-screen bg-slate-900 overflow-hidden relative">
      <Canvas />
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

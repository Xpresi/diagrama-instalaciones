import { useState, useEffect } from 'react'
import { useSchema } from '../store/SchemaContext'

export default function FichaInstalacion({ nodeId, onClose }) {
  const { state, dispatch } = useSchema()
  const node = state.nodes.find(n => n.id === nodeId)
  const [form, setForm] = useState(null)

  useEffect(() => {
    if (node) setForm({ ...node.data, id: node.id })
  }, [nodeId])

  if (!node || !form) return null

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function handleSave() {
    const newId = form.id.trim()
    if (!newId) return
    if (newId !== nodeId) {
      dispatch({ type: 'RENAME_NODE_ID', payload: { oldId: nodeId, newId } })
    }
    dispatch({ type: 'UPDATE_NODE', payload: { id: newId, changes: { data: { ...form, id: newId } } } })
    onClose()
  }

  const inputCls = "w-full bg-slate-700 text-white rounded-lg px-3 py-2 text-sm outline-none border border-slate-600 focus:border-blue-500"

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-800 rounded-t-2xl shadow-2xl"
      style={{ height: '50vh' }}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-slate-700">
        <h2 className="text-white font-bold">Ficha de instalación</h2>
        <button onClick={onClose} className="text-slate-400 text-2xl leading-none">×</button>
      </div>
      <div className="overflow-y-auto p-4 space-y-3" style={{ height: 'calc(50vh - 56px)' }}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Código</label>
            <input
              className={inputCls}
              value={form.id || ''}
              onChange={e => handleChange('id', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input
              className={inputCls}
              value={form.nombre || ''}
              onChange={e => handleChange('nombre', e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Valor mín</label>
            <input
              type="number"
              className={inputCls}
              value={form.valorMin ?? ''}
              onChange={e => handleChange('valorMin', e.target.value === '' ? null : parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Valor máx</label>
            <input
              type="number"
              className={inputCls}
              value={form.valorMax ?? ''}
              onChange={e => handleChange('valorMax', e.target.value === '' ? null : parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">cl</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="9.99"
              className={inputCls}
              value={form.cl ?? ''}
              onChange={e => handleChange('cl', e.target.value === '' ? null : parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Cloración</label>
            <button
              type="button"
              onClick={() => handleChange('cloracion', !form.cloracion)}
              className={`w-full py-2 rounded-lg text-sm font-bold ${form.cloracion ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
            >
              {form.cloracion ? 'Cloración sí' : 'Cloración no'}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Notas</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            value={form.notas || ''}
            onChange={e => handleChange('notas', e.target.value)}
          />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Responsable {i}</label>
              <input
                className={inputCls}
                value={form[`resp${i}`] || ''}
                onChange={e => handleChange(`resp${i}`, e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Teléfono {i}</label>
              <input
                type="tel"
                className={inputCls}
                value={form[`tfno${i}`] || ''}
                onChange={e => handleChange(`tfno${i}`, e.target.value)}
              />
            </div>
          </div>
        ))}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}

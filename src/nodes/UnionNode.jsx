import { Handle, Position } from '@xyflow/react'

export default function UnionNode({ id, data, selected }) {
  return (
    <div
      className={`flex items-center justify-center ${selected ? 'opacity-70' : ''}`}
      style={{ width: 16, height: 16 }}
    >
      <div
        className="rounded-full bg-slate-400 border-2 border-slate-300"
        style={{ width: 12, height: 12 }}
      />
      <Handle
        type="source"
        position={Position.Top}
        style={{ opacity: 0, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 1, height: 1, minWidth: 1, minHeight: 1 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        style={{ opacity: 0, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 1, height: 1, minWidth: 1, minHeight: 1 }}
      />
    </div>
  )
}

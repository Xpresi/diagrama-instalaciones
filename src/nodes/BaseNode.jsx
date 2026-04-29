import { Handle, Position } from '@xyflow/react'

export default function BaseNode({ data, selected, children }) {
  return (
    <div className={`flex flex-col items-center select-none ${selected ? 'opacity-70' : ''}`}>
      <span className="text-xs font-bold text-white mb-1 bg-slate-800/90 px-1 rounded pointer-events-none">
        {data.id}
      </span>
      <div className="relative">
        {children}
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
    </div>
  )
}

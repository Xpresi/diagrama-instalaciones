import { Handle, Position } from '@xyflow/react'

export default function BaseNode({ id, data, selected, children }) {
  return (
    <div
      className={`flex flex-col items-center select-none ${selected ? 'opacity-70' : ''}`}
      onTouchStart={data.onTouchStart ? (e) => data.onTouchStart(id, e) : undefined}
      onTouchEnd={data.onTouchEnd}
      onTouchMove={data.onTouchEnd}
      onMouseDown={data.onMouseDown ? (e) => data.onMouseDown(id, e) : undefined}
      onMouseUp={data.onMouseUp}
      onMouseLeave={data.onMouseUp}
    >
      <span className="text-xs font-bold text-white mb-1 bg-slate-800/90 px-1 rounded pointer-events-none">
        {data.id}
      </span>
      <div className="relative">
        {children}
        <Handle type="target" position={Position.Top}    className="!w-2 !h-2 !bg-blue-400" />
        <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-400" />
        <Handle type="target" position={Position.Left}   className="!w-2 !h-2 !bg-blue-400" />
        <Handle type="source" position={Position.Right}  className="!w-2 !h-2 !bg-blue-400" />
      </div>
    </div>
  )
}

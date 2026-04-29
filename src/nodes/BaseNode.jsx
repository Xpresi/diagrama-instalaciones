import { useRef } from 'react'
import { Handle, Position } from '@xyflow/react'

export default function BaseNode({ id, data, selected, children }) {
  const timer = useRef(null)
  const lastTap = useRef(0)

  function onStart(e) {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      clearTimeout(timer.current)
      data.onDoubleTapId?.(id)
      lastTap.current = 0
      return
    }
    lastTap.current = now
    timer.current = setTimeout(() => {
      data.onLongPressId?.(id, e)
    }, 500)
  }

  function onEnd() {
    clearTimeout(timer.current)
  }

  return (
    <div
      className={`flex flex-col items-center select-none ${selected ? 'opacity-70' : ''}`}
      onTouchStart={onStart}
      onTouchEnd={onEnd}
      onTouchMove={onEnd}
      onMouseDown={onStart}
      onMouseUp={onEnd}
      onMouseLeave={onEnd}
    >
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

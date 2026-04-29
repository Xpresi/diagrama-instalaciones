import { useRef } from 'react'
import { BaseEdge, getStraightPath } from '@xyflow/react'

export default function RamalEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2

  const timer = useRef(null)
  const lastTap = useRef(0)

  function onStart(e) {
    e.stopPropagation()
    const now = Date.now()
    if (now - lastTap.current < 300) {
      clearTimeout(timer.current)
      lastTap.current = 0
      return
    }
    lastTap.current = now
    timer.current = setTimeout(() => {
      data?.onLongPressMid?.(id, e)
    }, 500)
  }

  function onEnd(e) {
    e.stopPropagation()
    clearTimeout(timer.current)
  }

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: '#94a3b8', strokeWidth: 2 }} />
      <circle
        cx={midX}
        cy={midY}
        r={8}
        fill="#1e293b"
        stroke="#94a3b8"
        strokeWidth="2"
        style={{ cursor: 'pointer' }}
        onTouchStart={onStart}
        onTouchEnd={onEnd}
        onTouchMove={onEnd}
        onMouseDown={onStart}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      />
    </>
  )
}

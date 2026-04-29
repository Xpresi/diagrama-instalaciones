import { BaseEdge, getStraightPath } from '@xyflow/react'

export default function RamalEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2

  function handleClick(e) {
    e.stopPropagation()
    data?.onMidTap?.(id, midX, midY, e)
  }

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: '#94a3b8', strokeWidth: 2 }} />
      <circle
        cx={midX}
        cy={midY}
        r={10}
        fill={data?.conectandoDesde ? '#3b82f6' : '#1e293b'}
        stroke={data?.conectandoDesde ? '#93c5fd' : '#94a3b8'}
        strokeWidth="2"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
        onTouchEnd={handleClick}
      />
    </>
  )
}

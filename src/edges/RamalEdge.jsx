import { BaseEdge, getStraightPath } from '@xyflow/react'

export default function RamalEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY })
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2
  const active = !!data?.conectandoDesde

  function handleClick(e) {
    e.stopPropagation()
    e.preventDefault()
    data?.onMidTap?.(id, midX, midY, e.clientX, e.clientY)
  }

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: '#94a3b8', strokeWidth: 2 }} />
      <circle
        cx={midX}
        cy={midY}
        r={5}
        fill={active ? '#3b82f6' : '#1e293b'}
        stroke={active ? '#93c5fd' : '#94a3b8'}
        strokeWidth="2"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
      {/* Área táctil ampliada invisible */}
      <circle
        cx={midX}
        cy={midY}
        r={18}
        fill="transparent"
        style={{ cursor: 'pointer' }}
        onClick={handleClick}
      />
    </>
  )
}

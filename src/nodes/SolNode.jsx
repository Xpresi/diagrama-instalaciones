import BaseNode from './BaseNode'

const RAYOS = [0, 45, 90, 135, 180, 225, 270, 315]

export default function SolNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="10" fill="#facc15" stroke="#fde68a" strokeWidth="2" />
        {RAYOS.map(deg => {
          const r = deg * Math.PI / 180
          const x1 = 24 + 13 * Math.cos(r), y1 = 24 + 13 * Math.sin(r)
          const x2 = 24 + 22 * Math.cos(r), y2 = 24 + 22 * Math.sin(r)
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fde68a" strokeWidth="2" strokeLinecap="round" />
        })}
      </svg>
    </BaseNode>
  )
}

import BaseNode from './BaseNode'

export default function RejillaNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="2" y="2" width="44" height="44" fill="none" stroke="#a3e635" strokeWidth="2" />
        <line x1="17" y1="2"  x2="17" y2="46" stroke="#a3e635" strokeWidth="2" />
        <line x1="31" y1="2"  x2="31" y2="46" stroke="#a3e635" strokeWidth="2" />
        <line x1="2"  y1="17" x2="46" y2="17" stroke="#a3e635" strokeWidth="2" />
        <line x1="2"  y1="31" x2="46" y2="31" stroke="#a3e635" strokeWidth="2" />
      </svg>
    </BaseNode>
  )
}

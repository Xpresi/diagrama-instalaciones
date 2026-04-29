import BaseNode from './BaseNode'

export default function CuadradoNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <rect x="4" y="4" width="40" height="40" fill="#10b981" stroke="#6ee7b7" strokeWidth="2" />
      </svg>
    </BaseNode>
  )
}

import BaseNode from './BaseNode'

export default function RectanguloNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="64" height="40" viewBox="0 0 64 40">
        <rect x="2" y="2" width="60" height="36" fill="#ef4444" stroke="#fca5a5" strokeWidth="2" />
      </svg>
    </BaseNode>
  )
}

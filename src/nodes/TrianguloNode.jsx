import BaseNode from './BaseNode'

export default function TrianguloNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <polygon points="24,4 44,44 4,44" fill="#f59e0b" stroke="#fcd34d" strokeWidth="2" />
      </svg>
    </BaseNode>
  )
}

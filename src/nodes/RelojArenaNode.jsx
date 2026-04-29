import BaseNode from './BaseNode'

export default function RelojArenaNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <polygon points="4,4 44,4 24,24" fill="#06b6d4" stroke="#67e8f9" strokeWidth="2" />
        <polygon points="4,44 44,44 24,24" fill="#06b6d4" stroke="#67e8f9" strokeWidth="2" />
      </svg>
    </BaseNode>
  )
}

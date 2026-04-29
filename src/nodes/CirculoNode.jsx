import BaseNode from './BaseNode'

export default function CirculoNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
      </svg>
    </BaseNode>
  )
}

import BaseNode from './BaseNode'

export default function RomboNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <polygon points="24,2 46,24 24,46 2,24" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="2" />
      </svg>
    </BaseNode>
  )
}

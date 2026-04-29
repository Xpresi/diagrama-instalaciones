import BaseNode from './BaseNode'

export default function OlasNode(props) {
  return (
    <BaseNode {...props}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path d="M2,14 Q10,6 18,14 Q26,22 34,14 Q42,6 50,14" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M2,24 Q10,16 18,24 Q26,32 34,24 Q42,16 50,24" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
        <path d="M2,34 Q10,26 18,34 Q26,42 34,34 Q42,26 50,34" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </BaseNode>
  )
}

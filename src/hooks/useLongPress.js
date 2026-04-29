import { useRef, useCallback } from 'react'

export default function useLongPress(onLongPress, onDoubleTap, delay = 500) {
  const timer = useRef(null)
  const lastTap = useRef(0)

  const start = useCallback((e) => {
    const now = Date.now()
    if (now - lastTap.current < 300) {
      clearTimeout(timer.current)
      onDoubleTap(e)
      lastTap.current = 0
      return
    }
    lastTap.current = now
    timer.current = setTimeout(() => onLongPress(e), delay)
  }, [onLongPress, onDoubleTap, delay])

  const cancel = useCallback(() => {
    clearTimeout(timer.current)
  }, [])

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
  }
}

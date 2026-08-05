import { useEffect, useRef, useState } from 'react'

const interactiveSelector =
  'a, button, input, textarea, select, [role="button"], [role="link"], [data-cursor-interactive]'

export default function CustomCursor() {
  const outerRef = useRef(null)
  const dotRef = useRef(null)
  const animationRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const positionRef = useRef({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const enabled =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches

  useEffect(() => {
    if (!enabled) return

    const updatePosition = (event) => {
      targetRef.current = { x: event.clientX, y: event.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
      }
    }

    const animate = () => {
      positionRef.current.x +=
        (targetRef.current.x - positionRef.current.x) * 0.18
      positionRef.current.y +=
        (targetRef.current.y - positionRef.current.y) * 0.18

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    const handlePointerDown = () => setPressed(true)
    const handlePointerUp = () => setPressed(false)
    const handlePointerOver = (event) => {
      const element = event.target.closest(interactiveSelector)
      setHovered(Boolean(element))
    }
    const handlePointerOut = (event) => {
      const toElement = event.relatedTarget
      if (!toElement || !toElement.closest(interactiveSelector)) {
        setHovered(false)
      }
    }

    document.body.classList.add('custom-cursor-enabled')
    document.addEventListener('pointermove', updatePosition)
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('pointerover', handlePointerOver, true)
    document.addEventListener('pointerout', handlePointerOut, true)

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      document.body.classList.remove('custom-cursor-enabled')
      document.removeEventListener('pointermove', updatePosition)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('pointerup', handlePointerUp)
      document.removeEventListener('pointerover', handlePointerOver, true)
      document.removeEventListener('pointerout', handlePointerOut, true)
      cancelAnimationFrame(animationRef.current)
    }
  }, [enabled])

  if (!enabled) {
    return null
  }

  return (
    <>
      <div
        ref={outerRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 shadow-[0_0_40px_rgba(99,102,241,0.24)] transition-all duration-300 will-change-transform ${
          hovered ? 'scale-110 opacity-100' : 'scale-90 opacity-90'
        } ${pressed ? 'scale-95 bg-slate-950/10 shadow-[0_0_56px_rgba(168,85,247,0.28)]' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-200 will-change-transform ${
          pressed ? 'scale-75 bg-cyan-300' : hovered ? 'scale-125 bg-fuchsia-300' : 'scale-100 bg-white'
        }`}
        aria-hidden="true"
      />
    </>
  )
}

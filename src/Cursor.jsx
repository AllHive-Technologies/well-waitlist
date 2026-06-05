import { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailsRef = useRef([])
  const posRef = useRef({ x: -100, y: -100 })
  const ringPosRef = useRef({ x: -100, y: -100 })
  const rafRef = useRef(null)
  const [clicked, setClicked] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const trails = trailsRef.current

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const onDown = () => {
      setClicked(true)
      setTimeout(() => setClicked(false), 350)
    }

    const onEnterInteractive = (e) => {
      if (e.target.closest('a, button, input, [role="button"]')) {
        setHovering(true)
      }
    }
    const onLeaveInteractive = (e) => {
      if (e.target.closest('a, button, input, [role="button"]')) {
        setHovering(false)
      }
    }

    // Smooth ring follow using RAF
    const lerp = (a, b, t) => a + (b - a) * t
    const animate = () => {
      ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.12)
      ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.12)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px)`
      }
      // Animate trail
      trails.forEach((trail, i) => {
        if (!trail) return
        const tx = lerp(
          parseFloat(trail.dataset.x || posRef.current.x),
          posRef.current.x,
          0.08 - i * 0.006
        )
        const ty = lerp(
          parseFloat(trail.dataset.y || posRef.current.y),
          posRef.current.y,
          0.08 - i * 0.006
        )
        trail.dataset.x = tx
        trail.dataset.y = ty
        trail.style.transform = `translate(${tx}px, ${ty}px)`
        trail.style.opacity = String(0.25 - i * 0.028)
        const size = 6 - i * 0.5
        trail.style.width = `${size}px`
        trail.style.height = `${size}px`
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseover', onEnterInteractive)
    document.addEventListener('mouseout', onLeaveInteractive)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseover', onEnterInteractive)
      document.removeEventListener('mouseout', onLeaveInteractive)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Dot — snaps to cursor */}
      <div
        ref={dotRef}
        className={`${styles.dot} ${hovering ? styles.dotHover : ''} ${clicked ? styles.dotClick : ''}`}
      />
      {/* Ring — lags behind */}
      <div
        ref={ringRef}
        className={`${styles.ring} ${hovering ? styles.ringHover : ''} ${clicked ? styles.ringClick : ''}`}
      />
      {/* Trails */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          ref={el => trailsRef.current[i] = el}
          className={styles.trail}
        />
      ))}
    </>
  )
}

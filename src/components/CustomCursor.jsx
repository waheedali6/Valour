'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0
    let mouseY = 0
    let ringX = 0
    let ringY = 0
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'none' })
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const loop = () => {
      ringX = lerp(ringX, mouseX, 0.125)
      ringY = lerp(ringY, mouseY, 0.125)
      gsap.set(ring, { x: ringX, y: ringY })
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    window.addEventListener('mousemove', onMove)

    // Hover states - improved easing
    const hoverEls = document.querySelectorAll(
      'a, button, .pro-card, .theme-btn, .nav-link, .contact-btn, input, textarea, select'
    )

    const expandCursor = () => {
      gsap.to(ring, { scale: 2.6, opacity: 0.65, duration: 0.4, ease: 'power2.out' })
      gsap.to(dot, { scale: 0.3, duration: 0.3 })
    }
    const collapseCursor = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.to(dot, { scale: 1, duration: 0.3 })
    }

    hoverEls.forEach((el) => {
      el.addEventListener('mouseenter', expandCursor)
      el.addEventListener('mouseleave', collapseCursor)
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      hoverEls.forEach((el) => {
        el.removeEventListener('mouseenter', expandCursor)
        el.removeEventListener('mouseleave', collapseCursor)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          zIndex: 99999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.8)',
          pointerEvents: 'none',
          zIndex: 99998,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
        }}
      />
    </>
  )
}

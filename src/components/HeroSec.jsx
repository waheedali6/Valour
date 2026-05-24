'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BLOB_PATHS = [
  'M421,303Q388,356,335,390Q282,424,222,404Q162,384,127,332Q92,280,97,215Q102,150,150,103Q198,56,263,44Q328,32,380,75Q432,118,449,181Q466,244,421,303Z',
  'M411,296Q375,342,327,376Q279,410,224,400Q169,390,130,346Q91,302,88,240Q85,178,120,124Q155,70,215,50Q275,30,337,57Q399,84,428,143Q457,202,411,296Z',
  'M398,285Q361,320,318,357Q275,394,222,388Q169,382,130,340Q91,298,95,240Q99,182,134,136Q169,90,228,68Q287,46,343,72Q399,98,424,160Q449,222,398,285Z',
  'M430,308Q393,366,335,392Q277,418,218,400Q159,382,122,328Q85,274,92,210Q99,146,146,100Q193,54,258,45Q323,36,378,74Q433,112,450,178Q467,244,430,308Z',
]

function lerpPaths(a, b, t) {
  const numsA = a.match(/-?[\d.]+/g).map(Number)
  const numsB = b.match(/-?[\d.]+/g).map(Number)

  let i = 0

  return a.replace(/-?[\d.]+/g, () => {
    const v = numsA[i] + (numsB[i] - numsA[i]) * t
    i++
    return v.toFixed(2)
  })
}

export default function HeroSec() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)
  const blobRef = useRef(null)

  // ── Canvas glitch reveal ─────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    let W = 0
    let H = 0

    const text = 'VALOUR'

    let raf
    let running = true
    let frameCount = 0

    let glitchAmount = 0
    let glitchDirection = 1
    let phase = 'glitch'

    const resizeCanvas = () => {
      W = canvas.offsetWidth
      H = canvas.offsetHeight

      const dpr = window.devicePixelRatio || 1

      canvas.width = W * dpr
      canvas.height = H * dpr

      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resizeCanvas()

    const draw = () => {
      if (!running) return

      frameCount++

      ctx.clearRect(0, 0, W, H)

      const fontSize = Math.min(W * 0.22, 180)

      // ── Animation phases ───────────────────────
      if (frameCount === 180) phase = 'hold'
      if (frameCount === 360) phase = 'fade'

      if (phase === 'glitch') {
        glitchAmount += 2 * glitchDirection

        if (glitchAmount >= 15 || glitchAmount <= 0) {
          glitchDirection *= -1
        }
      } else {
        glitchAmount = 0
      }

      // ── Fade ONLY glitch layers ───────────────
      const glitchOpacity =
        phase === 'fade'
          ? Math.max(0, 1 - (frameCount - 360) / 120)
          : 1

      // ── Text setup ────────────────────────────
      ctx.font = `700 ${fontSize}px "Times New Roman", serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Red glitch
      ctx.fillStyle = `rgba(255,100,100,${glitchOpacity})`
      ctx.fillText(
        text,
        W / 2 + glitchAmount,
        H / 2 - 3
      )

      // Blue glitch
      ctx.fillStyle = `rgba(100,100,255,${glitchOpacity})`
      ctx.fillText(
        text,
        W / 2 - glitchAmount,
        H / 2 + 3
      )

      // Permanent white text
      ctx.fillStyle = 'rgba(255,255,255,1)'
      ctx.fillText(text, W / 2, H / 2)

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    window.addEventListener('resize', resizeCanvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // ── Blob morphing ────────────────────────────────────────────────
  useEffect(() => {
    const blob = blobRef.current
    if (!blob) return

    let raf
    const duration = 3200

    const tick = (now) => {
      const total = BLOB_PATHS.length
      const cycle = (now % (duration * total)) / duration

      const current = Math.floor(cycle)
      const next = (current + 1) % total

      const t = cycle - current

      // Smooth cubic easing
      const eased =
        t < 0.5
          ? 4 * t * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2

      blob.setAttribute(
        'd',
        lerpPaths(
          BLOB_PATHS[current],
          BLOB_PATHS[next],
          eased
        )
      )

      raf = requestAnimationFrame(tick)
    }

    blob.setAttribute('d', BLOB_PATHS[0])

    raf = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(raf)
  }, [])

  // ── Scroll animations ────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.to(section, {
        backgroundSize: '118%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 2.2,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      className='hero-sec hero-canvas-sec'
      ref={sectionRef}
    >
      {/* Morphing blob */}
      <svg
        className='hero-blob-svg'
        viewBox='0 0 500 500'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          ref={blobRef}
          fill='rgba(255,255,255,0.04)'
        />
      </svg>

      {/* Vignette */}
      <div className='hero-vignette' />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className='hero-canvas'
      />

      {/* Corner metadata */}
      <div className='hero-corner hero-corner-tl'>
        <span className='hero-corner-label'>EST.</span>
        <span className='hero-corner-val'>2024</span>
      </div>

      <div className='hero-corner hero-corner-tr'>
        <span className='hero-corner-label'>
          COLLECTION
        </span>
        <span className='hero-corner-val'>
          LUCENT
        </span>
      </div>

      <div className='hero-corner hero-corner-br'>
        <span className='hero-corner-label'>
          SCROLL TO
        </span>
        <span className='hero-corner-val'>
          EXPLORE ↓
        </span>
      </div>
    </section>
  )
}
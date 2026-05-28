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

const TEXT = 'VALOUR'
const CHAR_DELAY = 360   // ms between each character appearing
const CHAR_FADE = 500    // ms each character takes to fade in

export default function HeroSec() {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)
  const blobRef = useRef(null)

  // ── Canvas ───────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let W = 0, H = 0
    let raf
    let running = true
    const startTime = performance.now()

    // Per-character alpha targets
    const charAlpha = new Array(TEXT.length).fill(0)

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

    const draw = (time) => {
      if (!running) return
      ctx.clearRect(0, 0, W, H)

      const elapsed = time - startTime
      const cx = W / 2
      const cy = H / 2
      const fontSize = Math.min(W * 0.22, 180)

      ctx.font = `700 ${fontSize}px "Times New Roman", serif`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'

      // Measure total text width to center the whole word
      const totalWidth = ctx.measureText(TEXT).width
      let startX = cx - totalWidth / 2

      // Update per-character alpha
      TEXT.split('').forEach((_, i) => {
        const charStart = i * CHAR_DELAY
        const charElapsed = elapsed - charStart
        charAlpha[i] = Math.min(Math.max(charElapsed / CHAR_FADE, 0), 1)
        // ease out quad
        charAlpha[i] = 1 - Math.pow(1 - charAlpha[i], 2)
      })

      // All characters revealed?
      const allRevealed = charAlpha[TEXT.length - 1] >= 1

      // Draw each character
      let x = startX
      TEXT.split('').forEach((char, i) => {
        const alpha = charAlpha[i]
        if (alpha <= 0) {
          x += ctx.measureText(char).width
          return
        }

        // Slight drop-in: characters slide down into position
        const offsetY = (1 - alpha) * 18

        const grad = ctx.createLinearGradient(0, cy - fontSize * 0.5, 0, cy + fontSize * 0.5)
        grad.addColorStop(0, `rgba(224,224,224,${alpha})`)
        grad.addColorStop(0.4, `rgba(255,255,255,${alpha})`)
        grad.addColorStop(0.7, `rgba(160,160,160,${alpha})`)
        grad.addColorStop(1, `rgba(224,224,224,${alpha})`)

        ctx.fillStyle = grad
        ctx.fillText(char, x, cy + offsetY)

        x += ctx.measureText(char).width
      })

      // Shimmer — only after all characters are visible
      if (allRevealed) {
        const sweepX = cx + Math.sin(time * 0.001) * (W * 0.5)
        ctx.save()
        ctx.globalCompositeOperation = 'source-atop'
        const beam = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0)
        beam.addColorStop(0, 'rgba(255,255,255,0)')
        beam.addColorStop(0.5, 'rgba(255,255,255,0.6)')
        beam.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = beam
        ctx.fillRect(0, 0, W, H)
        ctx.restore()
      }

      // Seconds hand — starts after last char begins appearing
      const handStart = (TEXT.length - 1) * CHAR_DELAY
      const handElapsed = Math.max(elapsed - handStart, 0)
      const handProgress = Math.min(handElapsed / 800, 1)
      const handAlpha = 1 - Math.pow(1 - handProgress, 3)

      const continuousAngle = (time * 0.001) % (Math.PI * 2) - Math.PI / 2
      const revealAngle = -Math.PI / 2 + handProgress * Math.PI * 2
      const angle = handProgress < 1 ? revealAngle : continuousAngle
      const r = Math.min(W, H) * 0.36

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

  // ── Scroll animations ────────────────────────────────────────────────
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
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className='hero-sec hero-canvas-sec' ref={sectionRef}>
      <video 
        className='hero-video-bg' 
        autoPlay 
        loop 
        muted 
        playsInline
        src="/valour/videos/hero-bg-video.mp4"
      />

      <div className='hero-vignette' />

      <canvas ref={canvasRef} className='hero-canvas' />

    </section>
  )
}
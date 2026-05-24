'use client'
import { useEffect, useRef } from 'react'

const PANELS = [
  {
    src: '/images/img-sec-1.webp',
    word: 'SUNSEEKER',
    sub: 'Golden Hour',
    num: '01',
    accent: '#c9a84c',
  },
  {
    src: '/images/img-sec-2.webp',
    word: 'MIDNIGHT',
    sub: 'Deep Blue',
    num: '02',
    accent: '#7aa6ff',
  },
  {
    src: '/images/img-sec-3.webp',
    word: 'NATURE',
    sub: 'Raw Earth',
    num: '03',
    accent: '#5dd89a',
  },
]

export default function ImgSecs() {
  const wrapRef = useRef(null)
  const rafRef  = useRef(null)

  useEffect(() => {
    const panels = Array.from(wrapRef.current?.querySelectorAll('.is-panel') ?? [])
    if (!panels.length) return

    // ── Parallax via rAF ─────────────────────────────────────────────
    const tick = () => {
      panels.forEach((panel) => {
        const img = panel.querySelector('.is-img')
        if (!img) return
        const rect = panel.getBoundingClientRect()
        const vh   = window.innerHeight
        // progress: 0 when panel bottom hits viewport bottom → 1 when top hits viewport top
        const prog = 1 - (rect.bottom / (vh + rect.height))
        const clamp = Math.min(1, Math.max(0, prog))
        // shift image -10% … +10% vertically
        const shift = (clamp - 0.5) * 20
        img.style.transform = `translateY(${shift}%) scale(1.22)`
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    // ── IntersectionObserver — one-shot reveal ───────────────────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target) // never re-trigger
          }
        })
      },
      { threshold: 0.18 }
    )
    panels.forEach((p) => io.observe(p))

    return () => {
      cancelAnimationFrame(rafRef.current)
      io.disconnect()
    }
  }, [])

  return (
    <>
      <style>{css}</style>
      <main className="is-wrap" ref={wrapRef}>
        {PANELS.map((p, i) => (
          <section
            key={i}
            className="is-panel"
            style={{ '--accent': p.accent }}
          >
            {/* ── IMAGE ── */}
            <div className="is-img-wrap">
              <img src={p.src} alt={p.word} className="is-img" draggable={false} />
              <div className="is-overlay" />
            </div>

            {/* ── SLATS — CSS only, one-shot ── */}
            <div className="is-slats" aria-hidden="true">
              {Array.from({ length: 10 }).map((_, si) => (
                <div
                  key={si}
                  className="is-slat"
                  style={{ '--i': si }}
                />
              ))}
            </div>

            {/* ── CORNER NUMBER ── */}
            <span className="is-num">{p.num}</span>

            {/* ── BOTTOM TEXT ── */}
            <div className="is-text">
              <p className="is-sub">{p.sub}</p>
              <h2 className="is-word">
                {p.word.split('').map((ch, ci) => (
                  <span key={ci} className="is-char" style={{ '--ci': ci }}>
                    {ch}
                  </span>
                ))}
              </h2>
              <div className="is-line" />
            </div>

            {/* ── PROGRESS BAR ── */}
            <div className="is-prog-wrap">
              <div className="is-prog-bar" />
            </div>
          </section>
        ))}
      </main>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Montserrat:wght@300;400&display=swap');

/* ── WRAP ── */
.is-wrap {
  background: #080808;
  font-family: 'Montserrat', sans-serif;
}

/* ── PANEL ── */
.is-panel {
  position: relative;
  height: 100vh;
  overflow: hidden;
  isolation: isolate;
}

/* ── IMAGE ── */
.is-img-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.is-img {
  position: absolute;
  inset: -11% 0;
  width: 100%;
  height: 122%;
  object-fit: cover;
  transform-origin: center center;
  will-change: transform;
  /* starts shifted slightly down before reveal */
  transform: translateY(6%) scale(1.22);
  filter: brightness(0.72) saturate(1.1);
  transition: filter 1.6s ease;
}
.is-panel.is-visible .is-img {
  filter: brightness(0.82) saturate(1.15);
}

/* ── OVERLAY ── */
.is-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top,  rgba(0,0,0,0.85) 0%,  rgba(0,0,0,0.2) 40%, transparent 70%),
    linear-gradient(to right, rgba(0,0,0,0.3) 0%, transparent 60%);
  z-index: 1;
}

/* ── SLATS ── */
.is-slats {
  position: absolute;
  inset: 0;
  display: flex;
  z-index: 2;
  pointer-events: none;
}

.is-slat {
  flex: 1;
  background: #080808;
  transform-origin: top center;
  /* Default: fully covering */
  clip-path: inset(0 0 0 0);
  transition:
    clip-path 0.9s cubic-bezier(0.77, 0, 0.175, 1)
    calc(var(--i) * 0.055s);
}

/* When panel enters view → slats retract upward (clip from bottom) — one-shot via .is-visible */
.is-panel.is-visible .is-slat {
  clip-path: inset(0 0 100% 0);
}

/* ── CORNER NUMBER ── */
.is-num {
  position: absolute;
  top: 7%;
  right: 5.5%;
  z-index: 10;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(80px, 10vw, 160px);
  font-weight: 700;
  color: rgba(255,255,255,0.06);
  line-height: 1;
  letter-spacing: -0.04em;
  /* reveal */
  opacity: 0;
  transform: translateY(-30px);
  transition: opacity 1.2s ease 0.7s, transform 1.2s ease 0.7s;
}
.is-panel.is-visible .is-num {
  opacity: 1;
  transform: translateY(0);
}

/* ── BOTTOM TEXT BLOCK ── */
.is-text {
  position: absolute;
  bottom: 9%;
  left: 6%;
  z-index: 10;
  perspective: 1000px;
}

.is-sub {
  margin: 0 0 6px;
  font-size: clamp(10px, 1.1vw, 13px);
  font-weight: 300;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.8s ease 0.5s, transform 0.8s ease 0.5s;
}
.is-panel.is-visible .is-sub {
  opacity: 1;
  transform: translateX(0);
}

.is-word {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(52px, 9.5vw, 128px);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: 0.05em;
  color: #fff;
  display: block;
  overflow: hidden;
}

.is-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(110%) rotateX(-60deg);
  transform-origin: bottom center;
  transition:
    opacity  0.7s ease calc(0.55s + var(--ci) * 0.032s),
    transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) calc(0.55s + var(--ci) * 0.032s);
}
.is-panel.is-visible .is-char {
  opacity: 1;
  transform: translateY(0) rotateX(0deg);
}

.is-line {
  margin-top: 18px;
  height: 1px;
  width: 0;
  background: var(--accent);
  opacity: 0.7;
  transition: width 1.1s cubic-bezier(0.16, 1, 0.3, 1) 1.1s;
}
.is-panel.is-visible .is-line {
  width: clamp(60px, 8vw, 120px);
}

/* ── PROGRESS BAR (left edge accent) ── */
.is-prog-wrap {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: rgba(255,255,255,0.06);
  z-index: 10;
}
.is-prog-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0%;
  background: var(--accent);
  transition: height 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}
.is-panel.is-visible .is-prog-bar {
  height: 100%;
}

/* ── GRAIN TEXTURE ── */
.is-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.18;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: 20;
}

/* ── MOBILE ── */
@media (max-width: 768px) {
  .is-text { left: 7%; bottom: 11%; }
  .is-num  { right: 6%; }
  .is-slat { transition-duration: 0.7s; }
}
`
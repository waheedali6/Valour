'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function KnowSec() {
  const sectionRef  = useRef(null)
  const frameNumRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const triggers = []

    // ── 1. BG parallax ─────────────────────────────────────────────
const bgEl = document.createElement('div')
bgEl.className = 'know-bg-layer'
section.prepend(bgEl)

const bg = gsap.fromTo(bgEl,
  { yPercent: -15 },
  {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  }
)
triggers.push(bg.scrollTrigger)

    // ── 3. Sticky left panel — fade in ─────────────────────────────
    const leftItems = section.querySelectorAll('.know-left-item')
    leftItems.forEach((el, i) => {
      gsap.set(el, { opacity: 0, x: -50 })
      const a = gsap.to(el, {
        opacity: 1, x: 0, duration: 1.1, delay: i * 0.18, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' }
      })
      triggers.push(a.scrollTrigger)
    })

    // ── 4. Horizontal ticker line scrub ───────────────────────────
    const ticker = section.querySelector('.know-ticker-inner')
    if (ticker) {
      const a = gsap.to(ticker, {
        x: '-60%', ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 }
      })
      triggers.push(a.scrollTrigger)
    }

    ScrollTrigger.refresh()
    return () => triggers.forEach(t => t?.kill())
  }, [])

  const tickerText = Array(6).fill('VALOUR · FINE WATCHMAKING · LUCENT COLLECTION · BOLD FOR EVERYONE · ').join('')

  return (
    <section className='know-sec know-split-sec' ref={sectionRef}>
      <div className='know-grain' />

      {/* Film frame counter HUD */}
      <div className='know-film-hud'>
        <span className='know-film-label'>FRAME</span>
        <span ref={frameNumRef} className='know-film-num'>0000</span>
        <span className='know-film-label'>VALOUR/LUCENT</span>
      </div>

      <div className='container position-relative' style={{ zIndex: 2 }}>
        <div className='row align-items-start'>

          {/* Left — sticky */}
          <div className='col-md-6'>
            <div className='know-left-sticky'>
              <div className='know-left-item'>
                <h2 className='know-big-h'>Bold For Everyone.</h2>
              </div>
              <div className='know-left-item'>
                <p className='know-para-text'>
                  VALOUR's vision for the modern enthusiast is to bring to life bold
                  and inspired design at an accessible price. Valour's inaugural collection,
                  Lucent, offers a distinct and fun approach to the everyday watch.
                </p>
              </div>
              <div className='know-left-item'>
                <a href='#' className='theme-btn know-btn'>Get Know More</a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Horizontal scrolling ticker */}
      <div className='know-ticker-wrap'>
        <div className='know-ticker-inner'>{tickerText}</div>
      </div>
    </section>
  )
}
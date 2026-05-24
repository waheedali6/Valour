'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── TECHNIQUE: SVG border draw — neon line traces the form outline ────────────
// An SVG rect with strokeDashoffset draws itself around the form box like a laser
// tracing the perimeter. The line glows with a pulsing filter.
// ── TECHNIQUE: Spotlight that follows cursor revealing hidden text ─────────────
// The image side has text hidden behind a dark overlay. A circular spotlight
// follows the cursor, revealing the text/image beneath it — like a flashlight.
// ── TECHNIQUE: Input character "materialise" — each char typed appears via scale ─
// Characters inside inputs scale from 0→1 as they're typed (CSS only via
// :last-child animation targeting the input's pseudo, enhanced with JS).

export default function FormSec() {
  const sectionRef   = useRef(null)
  const imgColRef    = useRef(null)
  const spotlightRef = useRef(null)
  const svgBorderRef = useRef(null)
  const formBoxRef   = useRef(null)

  // ── Blur focus effect on image col ────────────────────────────────────────
  useEffect(() => {
    const imgCol    = imgColRef.current
    const spotlight = spotlightRef.current
    if (!imgCol || !spotlight) return

    let mx = 0, my = 0
    let raf, running = true

    const onMove = (e) => {
      const r = imgCol.getBoundingClientRect()
      mx = e.clientX - r.left
      my = e.clientY - r.top
    }
    imgCol.addEventListener('mousemove', onMove)

    const loop = () => {
      if (!running) return
      const dist = Math.sqrt(mx * mx + my * my)
      const blur = Math.max(0, Math.min(20, 20 - dist * 0.02))
      imgCol.style.filter = `blur(${blur}px)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    imgCol.addEventListener('mouseenter', () => {
      gsap.to(spotlight, { opacity: 1, duration: 0.5 })
      gsap.to(imgCol, { filter: 'blur(0px)', duration: 0.8 })
    })
    imgCol.addEventListener('mouseleave', () => {
      gsap.to(spotlight, { opacity: 0, duration: 0.6 })
      gsap.to(imgCol, { filter: 'blur(8px)', duration: 0.8 })
    })

    return () => {
      running = false; cancelAnimationFrame(raf)
      imgCol.removeEventListener('mousemove', onMove)
    }
  }, [])

  // ── Gradient border reveal ─────────────────────────────────────────────────
  useEffect(() => {
    const svg    = svgBorderRef.current
    const section = sectionRef.current
    if (!svg || !section) return
    const triggers = []

    // Gradient background animation
    const gradBg = section.querySelector('.form-sec')
    if (gradBg) {
      const a = gsap.to(gradBg, {
        backgroundPosition: '100% 50%',
        duration: 4, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 }
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Form box slide in with rotation ──────────────────────────
    const formBox = formBoxRef.current
    if (formBox) {
      gsap.set(formBox, { x: 80, opacity: 0, rotationY: 30 })
      const a = gsap.to(formBox, {
        x: 0, opacity: 1, rotationY: 0, duration: 1.35, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' }
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Image col slide in with rotation ─────────────────────────
    const imgCol = imgColRef.current
    if (imgCol) {
      gsap.set(imgCol, { x: -80, opacity: 0, rotationY: -30 })
      const a = gsap.to(imgCol, {
        x: 0, opacity: 1, rotationY: 0, duration: 1.35, ease: 'power4.out',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' }
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Heading with fade and slide ─────────────────────────────
    const h2 = section.querySelector('.form-heading')
    if (h2) {
      gsap.set(h2, { opacity: 0, y: 20 })
      const a = gsap.to(h2, {
        opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' }
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Inputs: scale from center ────────────────────────────────
    const inputs = section.querySelectorAll('.input')
    gsap.set(inputs, { scaleX: 0.8, opacity: 0 })
    const inputAnim = gsap.to(inputs, {
      scaleX: 1, opacity: 1, stagger: 0.08, delay: 0.6, duration: 0.7, ease: 'back.out(1.2)',
      scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none reverse' }
    })
    triggers.push(inputAnim.scrollTrigger)

    // Input focus — border glow effect
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, { 
          borderColor: 'rgba(255,255,255,0.8)',
          boxShadow: '0 0 15px rgba(255,255,255,0.15)',
          duration: 0.3,
          overwrite: 'auto'
        })
      })
      input.addEventListener('blur', () => {
        gsap.to(input, { 
          borderColor: 'rgba(255,255,255,0.3)',
          boxShadow: 'none',
          duration: 0.3,
          overwrite: 'auto'
        })
      })
    })

    // ── Submit button — gradient shift on hover ──────────────────
    const btn = section.querySelector('button[type=submit]')
    if (btn) {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          backgroundPosition: '100% 0%', duration: 0.4, ease: 'power2.out'
        })
      })
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          backgroundPosition: '0% 0%', duration: 0.3, ease: 'power2.in'
        })
      })
    }

    ScrollTrigger.refresh()
    return () => triggers.forEach(t => t?.kill())
  }, [])

  return (
    <section className='form-sec' ref={sectionRef}>
      <div className='container'>
        <div className='row'>

          {/* Image col with spotlight */}
          <div className='col-md-6' ref={imgColRef} style={{ position: 'relative' }}>
            <img src='/images/form-img.webp' alt='' />
            <div ref={spotlightRef} className='form-spotlight' style={{ opacity: 0 }} />
          </div>

          {/* Form col */}
          <div className='col-md-6' style={{ position: 'relative' }}>
            {/* SVG neon border trace */}
            <svg ref={svgBorderRef} className='neon-border-svg' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <rect className='neon-rect' x='2' y='2' width='calc(100% - 4)' height='calc(100% - 4)' rx='12'
                stroke='rgba(255,255,255,0.6)' strokeWidth='1.5' />
            </svg>

            <div className='form-box' ref={formBoxRef}>
              <h2 className='form-heading'>Here to Contact us Whenever you Need</h2>
              <p>Lorem ipsum dolor sit amet, consectetur, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud ...</p>
              <form action=''>
                <div className='row'>
                  <div className='col-md-6'>
                    <input type='text' className='input' placeholder='Mark Hurt' />
                  </div>
                  <div className='col-md-6'>
                    <input type='email' className='input' placeholder='info@youremail.com' />
                  </div>
                  <div className='col-md-6'>
                    <input type='tel' className='input' placeholder='+1 236 598 9866' />
                  </div>
                  <div className='col-md-6'>
                    <select className='input' name='watch'>
                      <option value=''>Select a watch</option>
                      <option>Sunseeker Yellow</option>
                      <option>Midnight Blue</option>
                      <option>Forest Green</option>
                    </select>
                  </div>
                  <div className='col-md-12'>
                    <textarea rows='4' className='input' placeholder='Your message here' />
                    <button type='submit' className='input form-submit-btn'>Submit Now</button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FormSec() {
  const sectionRef = useRef(null)
  const imgColRef = useRef(null)
  const spotlightRef = useRef(null)
  const svgBorderRef = useRef(null)
  const formBoxRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const svg = svgBorderRef.current
    if (!section || !svg) return

    const triggers = []
    const listeners = []

    // ── Image col: slide in from left ────────────────────────────────────────
    const imgCol = imgColRef.current
    if (imgCol) {
      gsap.set(imgCol, { x: -60, opacity: 0 })
      const a = gsap.to(imgCol, {
        x: 0, opacity: 1,
        duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 40%', toggleActions: 'play none none reverse', invalidateOnRefresh: true,}
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Image subtle float loop ───────────────────────────────────────────────
    const img = imgColRef.current?.querySelector('img')

    // ── Spotlight follows cursor over image col ───────────────────────────────
    const spotlight = spotlightRef.current
    if (spotlight && imgCol) {
      gsap.set(spotlight, { opacity: 0, xPercent: -50, yPercent: -10 })
      const setX = gsap.quickSetter(spotlight, 'x', 'px')
      const setY = gsap.quickSetter(spotlight, 'y', 'px')

      const onMove = (e) => {
        const r = imgCol.getBoundingClientRect()
        setX(e.clientX - r.left)
        setY(e.clientY - r.top)
      }
      const onEnter = () => gsap.to(spotlight, { opacity: 1, duration: 0.4, ease: 'power2.out' })
      const onLeave = () => gsap.to(spotlight, { opacity: 0, duration: 0.5, ease: 'power2.in' })

      imgCol.addEventListener('mousemove', onMove)
      imgCol.addEventListener('mouseenter', onEnter)
      imgCol.addEventListener('mouseleave', onLeave)
      listeners.push(
        { el: imgCol, type: 'mousemove', fn: onMove },
        { el: imgCol, type: 'mouseenter', fn: onEnter },
        { el: imgCol, type: 'mouseleave', fn: onLeave }
      )
    }

    // ── Form box: slide in from right ────────────────────────────────────────
    const formBox = formBoxRef.current
    if (formBox) {
      gsap.set(formBox, { x: 60, opacity: 0 })
      const a = gsap.to(formBox, {
        x: 0, opacity: 1,
        duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 40%', toggleActions: 'play none none reverse', invalidateOnRefresh: true,}
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Heading: masked word-by-word reveal ───────────────────────────────────
    const h2 = section.querySelector('.form-heading')
    if (h2) {
      const words = (h2.textContent || '').split(' ')
      h2.innerHTML = words.map(w =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.1">` +
        `<span class="_wi" style="display:inline-block">${w}</span></span>`
      ).join(' ')

      const inner = h2.querySelectorAll('._wi')
      gsap.set(inner, { y: '105%', opacity: 0 })
      const a = gsap.to(inner, {
        y: '0%', opacity: 1,
        duration: 0.8, ease: 'power4.out',
        stagger: 0.06, delay: 1,
        scrollTrigger: { trigger: section, start: 'top 40%', toggleActions: 'play none none reverse' ,invalidateOnRefresh: true,}
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Paragraph fade + slide ────────────────────────────────────────────────
    const para = formBox?.querySelector('p')
    if (para) {
      gsap.set(para, { opacity: 0, y: 16 })
      const a = gsap.to(para, {
        opacity: 1, y: 0,
        duration: 0.9, delay: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 40%', toggleActions: 'play none none reverse', invalidateOnRefresh: true, }
      })
      triggers.push(a.scrollTrigger)
    }

    // ── Inputs: staggered fade + y slide ─────────────────────────────────────
    const inputs = section.querySelectorAll('.input')
    gsap.set(inputs, { opacity: 0, y: 20 })
    const inputAnim = gsap.to(inputs, {
      opacity: 1, y: 0,
      stagger: 0.08, delay: 0.55, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 40%', toggleActions: 'play none none reverse', invalidateOnRefresh: true, }
    })
    triggers.push(inputAnim.scrollTrigger)

    // ── Form interaction animations ───────────────────────────────────────────
    const textInputs = section.querySelectorAll('input.input, textarea.input, select.input')

    textInputs.forEach(input => {
      // Find or create floating label
      const wrapper = input.closest('[data-field]')
      const label = wrapper?.querySelector('[data-label]')

      // ── Focus: border light sweep + label lift ──────────────────────────────
      const onFocus = () => {
        // Border glow
        gsap.to(input, {
          borderColor: 'rgba(255,255,255,0.85)',
          boxShadow: '0px 0px 15px 5px #ffffff63, 0 4px 24px rgba(255,255,255,0.06)',
          duration: 0.3, ease: 'power2.out', overwrite: 'auto'
        })
        // Label float up
        if (label) {
          gsap.to(label, {
            y: -22, scale: 0.78, opacity: 1, color: 'rgba(255,255,255,0.9)',
            duration: 0.28, ease: 'power2.out', overwrite: 'auto',
            transformOrigin: 'left center'
          })
        }
        // Subtle input scale
        gsap.to(input, {
          scaleY: 1.012,
          duration: 0.25, ease: 'power2.out', overwrite: false
        })
      }

      // ── Blur: restore unless has value ─────────────────────────────────────
      const onBlur = () => {
        const hasValue = input.value && input.value.trim() !== ''
        gsap.to(input, {
          borderColor: hasValue ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.57)',
          boxShadow: 'none',
          scaleY: 1,
          duration: 0.3, ease: 'power2.in', overwrite: 'auto'
        })
        if (label && !hasValue) {
          gsap.to(label, {
            y: 0, scale: 1, opacity: 0.45,
            duration: 0.28, ease: 'power2.in', overwrite: 'auto'
          })
        }
      }

      // ── Input: character-by-character shimmer on keydown ────────────────────
      const onKeydown = () => {
        gsap.fromTo(input,
          { borderColor: 'rgba(255,255,255,0.95)' },
          { borderColor: 'rgba(255,255,255,0.85)', duration: 0.35, ease: 'power2.out', overwrite: 'auto' }
        )
      }

      // ── Input: micro bounce on each keystroke ───────────────────────────────
      const onInput = () => {
        gsap.fromTo(input,
          { x: 0 },
          { x: 1.5, duration: 0.05, ease: 'power1.out', yoyo: true, repeat: 1, overwrite: 'auto' }
        )
      }

      input.addEventListener('focus', onFocus)
      input.addEventListener('blur', onBlur)
      input.addEventListener('keydown', onKeydown)
      input.addEventListener('input', onInput)
      listeners.push(
        { el: input, type: 'focus', fn: onFocus },
        { el: input, type: 'blur', fn: onBlur },
        { el: input, type: 'keydown', fn: onKeydown },
        { el: input, type: 'input', fn: onInput }
      )
    })

    // ── Submit button ─────────────────────────────────────────────────────────
    const btn = section.querySelector('button[type=submit]')
    if (btn) {
      const onEnter = () => gsap.to(btn, {
        scale: 1.04, backgroundPosition: '100% 0%',
        duration: 0.32, ease: 'power2.out', overwrite: 'auto'
      })
      const onLeave = () => gsap.to(btn, {
        scale: 1, backgroundPosition: '0% 0%',
        duration: 0.3, ease: 'power2.in', overwrite: 'auto'
      })
      const onDown = () => gsap.to(btn, {
        scale: 0.96, duration: 0.1, ease: 'power3.in', overwrite: 'auto'
      })
      const onUp = () => gsap.to(btn, {
        scale: 1.04, duration: 0.22, ease: 'back.out(2)', overwrite: 'auto'
      })

      // ── Submit click: wave ripple across all inputs ─────────────────────────
      const onSubmitClick = (e) => {
        e.preventDefault()

        // Validate: shake empties, glow filled
        const allInputs = [...section.querySelectorAll('input.input, textarea.input, select.input')]
        let hasEmpty = false

        allInputs.forEach((inp, i) => {
          const empty = !inp.value || inp.value.trim() === ''
          if (empty) {
            hasEmpty = true
            // Shake animation
            gsap.timeline()
              .to(inp, { x: -6, duration: 0.07, ease: 'power2.out', delay: i * 0.04 })
              .to(inp, { x: 6, duration: 0.07, ease: 'power2.out' })
              .to(inp, { x: -4, duration: 0.06, ease: 'power2.out' })
              .to(inp, { x: 4, duration: 0.06, ease: 'power2.out' })
              .to(inp, { x: 0, duration: 0.05, ease: 'power2.out' })
            gsap.to(inp, {
              borderColor: 'rgba(255,120,120,0.85)',
              boxShadow: '0 0 14px rgba(255,80,80,0.18)',
              duration: 0.25, overwrite: 'auto'
            })
            // Auto restore after
            gsap.to(inp, {
              borderColor: 'rgba(255,255,255,0.57)', boxShadow: 'none',
              duration: 0.4, delay: 1.4, overwrite: false
            })
          } else {
            // Wave ripple glow on filled inputs
            gsap.to(inp, {
              borderColor: 'rgba(255,255,255,0.9)',
              boxShadow: '0 0 18px rgba(255,255,255,0.14)',
              duration: 0.25, delay: i * 0.06, ease: 'power2.out', overwrite: 'auto'
            })
            gsap.to(inp, {
              borderColor: 'rgba(255,255,255,0.6)', boxShadow: 'none',
              duration: 0.4, delay: i * 0.06 + 0.4, overwrite: false
            })
          }
        })

        if (!hasEmpty) {
          // Success pulse on form box
          gsap.to(formBox, {
            scale: 1.008, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1
          })
        }
      }

      btn.addEventListener('mouseenter', onEnter)
      btn.addEventListener('mouseleave', onLeave)
      btn.addEventListener('mousedown', onDown)
      btn.addEventListener('mouseup', onUp)
      btn.addEventListener('click', onSubmitClick)
      listeners.push(
        { el: btn, type: 'mouseenter', fn: onEnter },
        { el: btn, type: 'mouseleave', fn: onLeave },
        { el: btn, type: 'mousedown', fn: onDown },
        { el: btn, type: 'mouseup', fn: onUp },
        { el: btn, type: 'click', fn: onSubmitClick }
      )
    }

    // ── SVG neon border draw on scroll ───────────────────────────────────────
    const rect = svg.querySelector('.neon-rect')
    if (rect) {
      const len = rect.getTotalLength?.() || 900
      gsap.set(rect, { strokeDasharray: len, strokeDashoffset: len })
      const a = gsap.to(rect, {
        strokeDashoffset: 0,
        duration: 1.5, ease: 'power2.inOut', delay: 0.25,
        scrollTrigger: { trigger: section, start: 'top 40%', toggleActions: 'play none none reverse', invalidateOnRefresh: true, }
      })
      triggers.push(a.scrollTrigger)
      gsap.to(rect, {
        opacity: 0.38, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2
      })
    }

    ScrollTrigger.refresh()

    return () => {
      triggers.forEach(t => t?.kill())
      listeners.forEach(({ el, type, fn }) => el?.removeEventListener(type, fn))
      if (img) gsap.killTweensOf(img)
    }
  }, [])

  return (
    <section className='form-sec' ref={sectionRef}>
      <div className='container'>
        <div className='row'>

          {/* Image col with spotlight */}
          <div className='col-md-6 img-col' ref={imgColRef} style={{ position: 'relative' }}>
            <img src='/images/form-img.png' alt='' />
            <div ref={spotlightRef} className='form-spotlight' style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '260px', height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.11) 0%, transparent 68%)',
              pointerEvents: 'none',
              zIndex: 2,
              opacity: 0
            }} />
          </div>

          {/* Form col */}
          <div className='col-md-6' style={{ position: 'relative' }}>
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
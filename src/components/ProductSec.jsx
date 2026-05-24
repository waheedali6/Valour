'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { FiPlus } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

const ProductSec = () => {
  const sectionRef = useRef(null)
  const perspRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const persp   = perspRef.current
    if (!section || !persp) return

    const triggers = []
    const cards    = section.querySelectorAll('.pro-card')

    // ── 1. Initial hidden state ────────────────────────────────────
    gsap.set(cards, { y: 80, opacity: 0, scale: 0.94 })

    // ── 2. Staggered reveal on scroll ─────────────────────────────
    const reveal = gsap.to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      stagger: 0.14,
      duration: 1.1,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
        toggleActions: 'play none none reverse',
      },
    })
    triggers.push(reveal.scrollTrigger)

    // ── 3. Global section 3D tilt on mouse ────────────────────────
    const onMouseMove = (e) => {
      const r    = persp.getBoundingClientRect()
      const xPct = (e.clientX - r.left) / r.width  - 0.5
      const yPct = (e.clientY - r.top)  / r.height - 0.5
      gsap.to(persp, {
        rotationY: xPct * 10,
        rotationX: -yPct * 8,
        transformPerspective: 1200,
        duration: 0.8,
        ease: 'power2.out',
      })
    }
    const onMouseLeave = () => {
      gsap.to(persp, {
        rotationY: 0,
        rotationX: 0,
        duration: 1.2,
        ease: 'elastic.out(1, 0.5)',
      })
    }
    section.addEventListener('mousemove', onMouseMove)
    section.addEventListener('mouseleave', onMouseLeave)

    // ── 4. Card hover: image levitate + shine sweep ───────────────
    cards.forEach((card) => {
      const img   = card.querySelector('img')
      const shine = card.querySelector('.card-shine')
      const icon  = card.querySelector('svg')

      card.addEventListener('mouseenter', () => {
        gsap.to(img, { y: -16, scale: 1.08, duration: 0.5, ease: 'power2.out' })
        if (shine) {
          gsap.fromTo(
            shine,
            { x: '-120%', opacity: 0.6 },
            { x: '220%',  opacity: 0.2, duration: 0.7, ease: 'power2.in' }
          )
        }
        if (icon) gsap.to(icon, { rotate: 135, scale: 1.3, duration: 0.4, ease: 'back.out(2)' })
      })
      card.addEventListener('mouseleave', () => {
        gsap.to(img, { y: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
        if (icon) gsap.to(icon, { rotate: 0, scale: 1, duration: 0.4, ease: 'power2.out' })
      })
    })

    // ── 5. Heading letter-spacing reveal ──────────────────────────
    const heading = section.querySelector('h2')
    if (heading) {
      gsap.set(heading, { letterSpacing: '0.5em', opacity: 0 })
      const a = gsap.to(heading, {
        letterSpacing: '0.02em',
        opacity: 1,
        duration: 1.4,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(a.scrollTrigger)
    }

    ScrollTrigger.refresh()
    return () => {
      triggers.forEach((t) => t?.kill())
      section.removeEventListener('mousemove', onMouseMove)
      section.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <section className='product-sec' ref={sectionRef}>
      <div className="container">
        <h2>Provide You Best Watche Collection</h2>

        {/* perspective wrapper — wraps the row for 3D tilt */}
        <div ref={perspRef} style={{ transformStyle: 'preserve-3d' }}>
          <div className="row">
            <div className="col-md-4">
              <div className="pro-card">
                <div className="card-shine" />
                <img src="/images/watch-1.webp" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Sunseeker Yellow</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pro-card">
                <div className="card-shine" />
                <img src="/images/watch-2.webp" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Midnight Blue</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pro-card">
                <div className="card-shine" />
                <img src="/images/watch-3.webp" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Forest Green</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default ProductSec
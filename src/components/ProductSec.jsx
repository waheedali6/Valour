'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { FiPlus } from 'react-icons/fi'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from 'swiper/modules'


gsap.registerPlugin(ScrollTrigger)

const ProductSec = () => {
  const sectionRef = useRef(null)
  const perspRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const persp = perspRef.current
    if (!section || !persp) return

    const triggers = []
    const cards = section.querySelectorAll('.pro-card')

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
        invalidateOnRefresh: true,
      },
    })
    triggers.push(reveal.scrollTrigger)

    // ── 4. Card hover: image levitate + shine sweep ───────────────
    cards.forEach((card) => {
      const img = card.querySelector('img')
      const shine = card.querySelector('.card-shine')
      const icon = card.querySelector('svg')

      card.addEventListener('mouseenter', () => {
        gsap.to(img, { y: -16, scale: 1.08, duration: 0.5, ease: 'power2.out' })
        if (shine) {
          gsap.fromTo(
            shine,
            { x: '-120%', opacity: 0.6 },
            { x: '220%', opacity: 0.2, duration: 0.7, ease: 'power2.in' }
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
          invalidateOnRefresh: true,
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
          <Swiper
          modules={[Autoplay]}
            spaceBetween={40}
            slidesPerView={3}
            loop={true}
            autoplay={{
          delay:2000000,
          disableOnInteraction: true,
        }}
          >
            <SwiperSlide>
              <div className="pro-card yellow-shadow">
                <div className="card-shine" />
                <img src="/images/watch-1.png" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Sunseeker Yellow</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="pro-card blue-shadow">
                <div className="card-shine" />
                <img src="/images/watch-2.png" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Midnight Blue</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="pro-card green-shadow">
                <div className="card-shine" />
                <img src="/images/watch-3.png" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Forest Green</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="pro-card yellow-shadow">
                <div className="card-shine" />
                <img src="/images/watch-1.png" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Sunseeker Yellow</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="pro-card blue-shadow">
                <div className="card-shine" />
                <img src="/images/watch-2.png" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Midnight Blue</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="pro-card green-shadow">
                <div className="card-shine" />
                <img src="/images/watch-3.png" alt="watch" />
                <div className="details">
                  <div>
                    <h6>Lucent Collection</h6>
                    <h5>Forest Green</h5>
                  </div>
                  <FiPlus />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

      </div>
    </section>
  )
}

export default ProductSec
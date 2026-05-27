'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CustomEase from 'gsap/CustomEase'
// ✅ Removed: Lenis import — handled globally in layout.js

// ✅ Register plugins ONCE at module level
gsap.registerPlugin(ScrollTrigger, CustomEase)

// ✅ Create custom eases ONCE at module level, not in component
try {
  CustomEase.create('softReveal', '0.5, 0, 0, 1')
  CustomEase.create('smoothBlur', '0.25, 0.1, 0.25, 1')
} catch (e) {
  // Already exists, ignore
}

export default function CreativeVideoSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    // ✅ No Lenis here — it's managed in layout.js
    // ✅ CustomEase eases already created at module level

    const triggers = []

    const videoContainer = document.querySelector('.video-box')
    const videoOverlay = document.querySelector('.video-overlay')
    const overlayContent = document.querySelector('.video-content')
    const overlayCaption = document.querySelector('.video-caption')


    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top 100%',
        end: 'bottom 50%',
        scrub: 0,
        invalidateOnRefresh: true,
      },
    })
    triggers.push(tl.scrollTrigger)

    tl.to(videoContainer, {
      width: '100%',
      height: '100%',
      ease: 'none',
    })
      .to('.main-video', { scale: 1.05, ease: 'none' }, 0)



    return () => {
      // ✅ Only kill THIS component's triggers
      triggers.forEach((t) => t && t.kill())
    }
  }, [])

  return (
    <section className="creative-sec" ref={sectionRef}>

      <div className="scroll-container">
        <div className="video-wrapper">
          <div className="video-box">
            <video
              className="main-video"
              src="/videos/scroll-video.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>

    </section>
  )
}

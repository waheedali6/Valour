// 'use client'
// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'

// gsap.registerPlugin(ScrollTrigger)

// const PANELS = [
//   {
//     src: '/valour/images/img-sec-1.png',
//     word: 'SUNSEEKER',
//     sub: 'Golden Hour',
//     num: '01',
//     accent: '#c9a84c',
//   },
//   {
//     src: '/valour/images/img-sec-2.png',
//     word: 'MIDNIGHT',
//     sub: 'Deep Blue',
//     num: '02',
//     accent: '#7aa6ff',
//   },
//   {
//     src: '/valour/images/img-sec-3.png',
//     word: 'NATURE',
//     sub: 'Raw Earth',
//     num: '03',
//     accent: '#5dd89a',
//   },
// ]

// export default function ImgSecs() {
//   const wrapRef = useRef(null)

//   useEffect(() => {
//     let lenis
//     let lenisRaf

//     const init = async () => {
//       // ── Lenis smooth scroll ──────────────────────────────────────
//       const LenisModule = await import('@studio-freight/lenis')
//       const Lenis = LenisModule.default

//       lenis = new Lenis({
//         duration: 0.65,
//         easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
//         direction: 'vertical',
//         smooth: true,
//         mouseMultiplier: 1,
//         smoothTouch: false,
//         touchMultiplier: 2,
//         infinite: false,
//       })

//       lenis.on('scroll', ScrollTrigger.update)

//       // ── Velocity-based title skew ────────────────────────────────
//       const sections = wrapRef.current?.querySelectorAll('.is-panel') ?? []
//       const titles   = wrapRef.current?.querySelectorAll('.is-word')  ?? []

//       const obj    = { y: 0 }
//       const clamp  = gsap.utils.clamp(-600, 600)
//       const ySetter = gsap.quickSetter('.is-word', 'y', 'px')

//       gsap.set(titles, { transformOrigin: 'center center', force3D: true })

//       ScrollTrigger.create({
//         onUpdate: (self) => {
//           const y = clamp(self.getVelocity() / -100)
//           if (Math.abs(y) > Math.abs(obj.y)) {
//             obj.y = y
//             gsap.to(obj, {
//               y: 0,
//               duration: 1.2,
//               ease: 'back.out(1.7)',
//               overwrite: true,
//               onUpdate: () => ySetter(obj.y),
//             })
//           }
//         },
//       })

//       // ── Per-section parallax — scale / brightness / contrast ────
//       const getRatio = (el) =>
//         window.innerHeight / (window.innerHeight + el.offsetHeight)

//       sections.forEach((section, i) => {
//         const img = section.querySelector('.is-img')
//         if (!img) return

//         const state = { scale: 1, y: 0, contrast: 1, brightness: 1 }
//         const maxOffset = window.innerHeight * 0.3

//         gsap.fromTo(
//           state,
//           {
//             y:          () => i ? `${-maxOffset * getRatio(section)}px` : '0px',
//             scale:      () => i ? 2 : 1,
//             brightness: () => i ? 1 : 0.35,
//             contrast:   () => i ? 1 : 2,
//           },
//           {
//             y:          () => `${maxOffset * (1 - getRatio(section))}px`,
//             scale:      () => i ? 1 : 2,
//             brightness: () => i ? 0.35 : 1,
//             contrast:   () => i ? 2 : 1,
//             ease: 'none',
//             duration: 0.35,
//             scrollTrigger: {
//               trigger: section,
//               start:   () => i ? 'top bottom' : 'top top',
//               end:     'bottom center',
//               scrub:   true,
//               onUpdate: () => {
//                 gsap.to(img, {
//                   filter:  `contrast(${state.contrast}) brightness(${state.brightness})`,
//                   y:       state.y,
//                   scaleX:  state.scale,
//                   scaleY:  state.scale,
//                   duration: 0.15,
//                   ease:    'none',
//                 })
//               },
//               invalidateOnRefresh: true,
//             },
//           }
//         )
//       })

//       // ── One-shot text reveals ────────────────────────────────────
//       const io = new IntersectionObserver(
//         (entries) => {
//           entries.forEach((e) => {
//             if (e.isIntersecting) {
//               e.target.classList.add('is-visible')
//               io.unobserve(e.target)
//             }
//           })
//         },
//         { threshold: 0.12 }
//       )
//       sections.forEach((p) => io.observe(p))

//       // ── Lenis rAF loop ───────────────────────────────────────────
//       const animate = (time) => {
//         lenis.raf(time)
//         lenisRaf = requestAnimationFrame(animate)
//       }
//       lenisRaf = requestAnimationFrame(animate)
//     }

//     init()

//     return () => {
//       lenis?.destroy()
//       cancelAnimationFrame(lenisRaf)
//       ScrollTrigger.getAll().forEach((t) => t.kill())
//     }
//   }, [])

//   return (
//     <>
//       {/* <style>{css}</style> */}
//       <main className="is-wrap" ref={wrapRef}>
//         {PANELS.map((p, i) => (
//           <section key={i} className="is-panel" style={{ '--accent': p.accent }}>

//             <div className="is-img-wrap">
//               <img src={p.src} alt={p.word} className="is-img" draggable={false} />
//               <div className="is-overlay" />
//             </div>

//             <div className="is-rule-top">
//               <span className="is-rule-num">{p.num}</span>
//               <div className="is-rule-line" />
//               <span className="is-rule-label">VALOUR</span>
//             </div>

//             <div className="is-caption">
//               <p className="is-sub">{p.sub}</p>
//               <h2
//                 className="is-word title"
//                 data-text={p.word}
//                 style={{ position: 'relative' }}
//               >
//                 {p.word.split('').map((ch, ci) => (
//                   <span key={ci} className="is-char" style={{ '--ci': ci }}>
//                     {ch === ' ' ? '\u00A0' : ch}
//                   </span>
//                 ))}
//               </h2>
//               <div className="is-meta">
//                 <div className="is-accent-line" />
//                 <span className="is-meta-text">Collection 2024</span>
//               </div>
//             </div>

//             <div className="is-side-label">
//               <span>{p.sub.toUpperCase()}</span>
//             </div>

//           </section>
//         ))}
//       </main>
//     </>
//   )
// }












// 'use client'

// import { useEffect, useRef } from 'react'
// import gsap from 'gsap'
// import ScrollTrigger from 'gsap/ScrollTrigger'
// import { Back } from 'gsap'
// import Lenis from 'lenis'

// gsap.registerPlugin(ScrollTrigger)

// const sectionsData = [
//   {
//     image:
//       '/valour/valour/images/img-sec-1.jpg',
//   },
//   {
//     image:
//       '/valour/valour/images/img-sec-2.jpg',
//   },
//   {
//     image:
//       '/valour/valour/images/img-sec-3.jpg',
//   },
// ]

// export default function ScrollParallax() {
//   const containerRef = useRef(null)

//   useEffect(() => {
//     // ── Lenis ─────────────────────────────
//     const lenis = new Lenis({
//       duration: 0.65,
//       smoothWheel: true,
//       touchMultiplier: 2,
//     })

//     function raf(time) {
//       lenis.raf(time)
//       requestAnimationFrame(raf)
//     }

//     requestAnimationFrame(raf)

//     lenis.on('scroll', ScrollTrigger.update)

//     // gsap.ticker.add((time) => {
//     //   lenis.raf(time * 1000)
//     // })

//     // gsap.ticker.lagSmoothing(0)

//     // ── Velocity Title Animation ─────────
//     let object = {
//       y: 0,
//     }

//     const ySetter = gsap.quickSetter(
//       '.parallax-title',
//       'y',
//       'px'
//     )

//     const clamp = gsap.utils.clamp(-600, 600)

//     ScrollTrigger.create({
//       onUpdate: (self) => {
//         let y = clamp(self.getVelocity() / -100)

//         if (Math.abs(y) > Math.abs(object.y)) {
//           object.y = y

//           gsap.to(object, {
//             y: 0,
//             duration: 1.2,
//             ease: Back.easeOut,
//             overwrite: true,
//             onUpdate: () => ySetter(object.y),
//           })
//         }
//       },
//     })

//     gsap.set('.parallax-title', {
//       transformOrigin: 'center center',
//       force3D: true,
//     })

//     // ── Image Parallax ───────────────────
//     const getRatio = (el) =>
//       window.innerHeight /
//       (window.innerHeight + el.offsetHeight)

//     const sections =
//       containerRef.current.querySelectorAll(
//         '.parallax-section'
//       )

//     sections.forEach((section, i) => {
//       const img = section.querySelector('img')

//       let obj = {
//         scale: 1,
//         y: 0,
//         contrast: 1,
//         brightness: 1,
//       }

//       let maxOffset = window.innerHeight * 0.3

//       gsap.fromTo(
//         obj,
//         {
//           y: () =>
//             i
//               ? `${-maxOffset * getRatio(section)}px`
//               : '0px',

//           scale: () => (i ? 2 : 1),

//           brightness: () => (i ? 1 : 0.35),

//           contrast: () => (i ? 1 : 2),
//         },
//         {
//           y: () =>
//             `${maxOffset * (1 - getRatio(section))}px`,

//           ease: 'none',

//           duration: 0.35,

//           brightness: () => (i ? 0.35 : 1),

//           contrast: () => (i ? 2 : 1),

//           scale: () => (i ? 1 : 2),

//           scrollTrigger: {
//             trigger: section,

//             start: () =>
//               i ? 'top bottom' : 'top bottom',

//             end: 'bottom center',

//             scrub: true,

//             invalidateOnRefresh: true,

//             onUpdate: () => {
//               gsap.to(img, {
//                 filter: `contrast(${obj.contrast}) brightness(${obj.brightness})`,
//                 duration: 0.15,
//                 ease: 'none',
//                 y: obj.y,
//                 scaleX: obj.scale,
//                 scaleY: obj.scale,
//               })
//             },
//           },
//         }
//       )
//     })

//     return () => {
//       ScrollTrigger.getAll().forEach((t) =>
//         t.kill()
//       )

//       lenis.destroy()
//     }
//   }, [])

//   return (
//     <>
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         html,
//         body {
//           background: #000;
//           color: #fff;
//           font-family: 'Inter', sans-serif;
//           overflow-x: hidden;
//         }

//         .parallax-section {
//           height: 100vh;
//           width: 100%;
//           position: relative;
//           overflow: hidden;

//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;

//           text-align: center;
//         }

//         .parallax-image {
//           position: absolute;
//           inset: 0;

//           width: 100%;
//           height: 100%;

//           object-fit: cover;

//           transform: scale(1);

//           z-index: 0;
//         }

//         .parallax-overlay {
//           position: absolute;
//           inset: 0;

//           background: rgba(0, 0, 0, 0.2);

//           z-index: 1;
//         }

//         .parallax-content {
//           position: relative;
//           z-index: 2;
//         }

//         .parallax-title {
//           font-size: clamp(60px, 9vw, 180px);

//           line-height: 1;

//           font-weight: 900;

//           text-transform: uppercase;

//           position: relative;

//           mix-blend-mode: difference;
//         }

//         .parallax-title::after {
//           content: attr(data-text);

//           position: absolute;

//           inset: 0;

//           color: transparent;

//           -webkit-text-stroke: 2px #ff7b00;

//           z-index: -1;
//         }

//         .parallax-subtitle {
//           margin-top: 18px;

//           display: inline-block;

//           padding: 10px 28px;

//           background: #000;

//           color: yellow;

//           font-size: 18px;

//           font-weight: 300;

//           text-transform: uppercase;

//           letter-spacing: 2px;
//         }
//       `}</style>

//       <main ref={containerRef}>
//         {sectionsData.map((item, index) => (
//           <section
//             key={index}
//             className='parallax-section'
//           >
//             <img
//               src={item.image}
//               alt={item.title}
//               className='parallax-image'
//             />

//             <div className='parallax-overlay' />


//           </section>
//         ))}
//       </main>
//     </>
//   )
// }






















'use client'

import { useEffect, useRef } from 'react'

const sections = [
  {
    src: '/valour/videos/sec-video.mp4',
    type: 'video',
  },
  {
    src: '/valour/images/img-sec-1.png',
    type: 'image',
  },
]

export default function PremiumParallax() {
  const imageRefs = useRef([])

 useEffect(() => {
  const handleScroll = () => {
    imageRefs.current.forEach((image) => {
      if (!image) return

      const section = image.closest('.luxury-section')
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Better scroll progress
      const progress = rect.top / windowHeight

      // Parallax movement
      const move = progress * 100

      // Increased zoom effect
      let scale = 1.25 - Math.abs(progress) * 0.25

      // Keep limits controlled
      scale = Math.max(1, Math.min(scale, 1.25))

      image.style.transform = `translateY(${move}px) scale(${scale})`
    })
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  return () => window.removeEventListener('scroll', handleScroll)
}, [])

  return (
    <main className="luxury-main">
      {sections.map((s, i) => (
        <section key={i} className="luxury-section">

          <div className="luxury-image-wrap">
            {s.type === 'video' ? (
              <video
                ref={(el) => (imageRefs.current[i] = el)}
                className="luxury-image"
                src={s.src}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <img
                ref={(el) => (imageRefs.current[i] = el)}
                className="luxury-image"
                src={s.src}
                alt=""
              />
            )}
          </div>

        </section>
      ))}
    </main>
  )
}
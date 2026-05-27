'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { FaStar } from 'react-icons/fa6'

gsap.registerPlugin(ScrollTrigger)

const TestimonialSec = () => {
  const sectionRef = useRef(null)
  const centerImgRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const triggers = []
    const cleans = []

    // Center watch image — dramatic scale + rotation reveal
    const centerImg = centerImgRef.current
    if (centerImg) {
      gsap.set(centerImg, { scale: 0.6, opacity: 0, rotate: -15, y: 60 })
      const imgAnim = gsap.to(centerImg, {
        scale: 1,
        opacity: 1,
        rotate: 0,
        y: 0,
        duration: 1.8,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: section,
          start: '20% center',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(imgAnim.scrollTrigger)

      
    }

    // Heading on left side
    const heading = section.querySelector('.side-1 h2')
    if (heading) {
      gsap.set(heading, { x: -80, opacity: 0 })
      const headingAnim = gsap.to(heading, {
        x: 0,
        opacity: 1,
        duration: 1.3,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: '20% center',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(headingAnim.scrollTrigger)
    }

    // Main para on left
    const mainPara = section.querySelector('.main-para')
    if (mainPara) {
      gsap.set(mainPara, { y: 30, opacity: 0, filter: 'blur(5px)' })
      const paraAnim = gsap.to(mainPara, {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 1, delay: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: '20% center',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(paraAnim.scrollTrigger)
    }

    // Testimonial boxes — stagger from sides
    const boxes = section.querySelectorAll('.testi-box')
    boxes.forEach((box, i) => {
      const fromLeft = i % 2 === 0
      gsap.set(box, { x: fromLeft ? -60 : 60, opacity: 0, y: 20 })
      const boxAnim = gsap.to(box, {
        x: 0, y: 0, opacity: 1,
        duration: 1.7,
        delay: i * .6,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: section,
          start: '20% center',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(boxAnim.scrollTrigger)

      // Box hover lift
      box.addEventListener('mouseenter', () => {
        gsap.to(box, { y: -8, duration: 0.4, ease: 'power2.out' })
      })
      box.addEventListener('mouseleave', () => {
        gsap.to(box, { y: 0, duration: 0.5, ease: 'power2.inOut' })
      })
    })

    // Stars animate individually
    const stars = section.querySelectorAll('.star-box svg')
    stars.forEach((star, i) => {
      gsap.set(star, { scale: 0, rotate: -30, opacity: 0 })
      const starAnim = gsap.to(star, {
        scale: 1, rotate: 0, opacity: 1,
        duration: 0.4,
        delay: Math.floor(i / 4) * 0.15 + (i % 4) * 0.08,
        ease: 'back.out(2)',
        scrollTrigger: {
          trigger: section,
          start: '20% center',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(starAnim.scrollTrigger)
    })

    // User avatars
    const userImgs = section.querySelectorAll('.user-box img')
    userImgs.forEach((img) => {
      img.addEventListener('mouseenter', () => {
        gsap.to(img, { scale: 1.15, duration: 0.35, ease: 'back.out(2)' })
      })
      img.addEventListener('mouseleave', () => {
        gsap.to(img, { scale: 1, duration: 0.4, ease: 'power2.out' })
      })
    })

    // ── Heading: masked word-by-word reveal ──────────────────────────────────
    const mainHeading = section.querySelector('.side-1 h2')
    if (mainHeading) {
      const words = (mainHeading.textContent || '').split(' ')
      mainHeading.innerHTML = words.map(w =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;line-height:1.1">` +
        `<span class="_wi" style="display:inline-block">${w}</span></span>`
      ).join(' ')

      const inner = mainHeading.querySelectorAll('._wi')
      gsap.set(inner, { y: '105%', opacity: 0 })
      const wordAnim = gsap.to(inner, {
        y: '0%', opacity: 1,
        duration: 0.8, ease: 'power4.out',
        stagger: 0.06, delay: 1,
        scrollTrigger: { trigger: section, start: '20% center', toggleActions: 'play none none reverse' }
      })
      triggers.push(wordAnim.scrollTrigger)
    }

    // ── Testimonial descriptions: fade + slide ──────────────────────────────
    const testiDescs = section.querySelectorAll('.testi-desc')
    gsap.set(testiDescs, { opacity: 0, y: 12 })
    const descAnim = gsap.to(testiDescs, {
      opacity: 1, y: 0,
      stagger: 0.1, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: '20% center', toggleActions: 'play none none reverse' }
    })
    triggers.push(descAnim.scrollTrigger)

    // ── User names and designations: fade ────────────────────────────────────
    const names = section.querySelectorAll('.name')
    gsap.set(names, { opacity: 0, y: 8 })
    const nameAnim = gsap.to(names, {
      opacity: 1, y: 0,
      stagger: 0.12, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: '20% center', toggleActions: 'play none none reverse' }
    })
    triggers.push(nameAnim.scrollTrigger)

    const desigs = section.querySelectorAll('.desig')
    gsap.set(desigs, { opacity: 0, y: 6 })
    const desigAnim = gsap.to(desigs, {
      opacity: 1, y: 0,
      stagger: 0.12, duration: 0.6, delay: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: '20% center', toggleActions: 'play none none reverse' }
    })
    triggers.push(desigAnim.scrollTrigger)

    ScrollTrigger.refresh()
    

    return () => {
      triggers.forEach((t) => t && t.kill())
      cleans.forEach((fn) => fn())
    }
  }, [])

  return (
    <section className='testi-sec' ref={sectionRef}>
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <div className="side side-1">
              <div>
                <h2>Make Everything Change With Our</h2>
                <p className='main-para'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud ...</p>
              </div>
              <div className="testi-box testi-box1">
                <div className="star-box"><FaStar /><FaStar /><FaStar /><FaStar /></div>
                <p className="testi-desc">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accu- santium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.</p>
                <div className="testi-bottom">
                  <div className="user-box">
                    <img src="/images/testi-1.webp" alt="testi image" />
                    <div className="desc-box">
                      <h5 className="name">Egi Dasfara</h5>
                      <h6 className="desig">Client</h6>
                    </div>
                  </div>
                  <img src="/images/colons.webp" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <img ref={centerImgRef} src="/images/testi-img.webp" alt="" className='center-img' style={{ willChange: 'transform, opacity' }} />
          </div>

          <div className="col-md-5">
            <div className="side side-2">
              <div className="testi-box testi-box2">
                <div className="star-box"><FaStar /><FaStar /><FaStar /><FaStar /></div>
                <p className="testi-desc">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accu- santium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.</p>
                <div className="testi-bottom">
                  <div className="user-box">
                    <img src="/images/testi-2.webp" alt="testi image" />
                    <div className="desc-box">
                      <h5 className="name">Egi Dasfara</h5>
                      <h6 className="desig">Client</h6>
                    </div>
                  </div>
                  <img src="/images/colons.webp" alt="" />
                </div>
              </div>
              <div className="testi-box testi-box3">
                <div className="star-box"><FaStar /><FaStar /><FaStar /><FaStar /></div>
                <p className="testi-desc">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accu- santium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.</p>
                <div className="testi-bottom">
                  <div className="user-box">
                    <img src="/images/testi-3.webp" alt="testi image" />
                    <div className="desc-box">
                      <h5 className="name">Egi Dasfara</h5>
                      <h6 className="desig">Client</h6>
                    </div>
                  </div>
                  <img src="/images/colons.webp" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialSec

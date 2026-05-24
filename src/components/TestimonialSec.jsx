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
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(imgAnim.scrollTrigger)

      // Continuous subtle rotate loop
      const rotateAnim = gsap.to(centerImg, {
        rotate: 3,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
      cleans.push(() => rotateAnim.kill())
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
          trigger: heading,
          start: 'top 80%',
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
        duration: 1, delay: 0.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: mainPara,
          start: 'top 82%',
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
        duration: 1.2,
        delay: i * 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: box,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
      triggers.push(boxAnim.scrollTrigger)

      // Box hover lift
      box.addEventListener('mouseenter', () => {
        gsap.to(box, { y: -8, boxShadow: '0 20px 60px rgba(255,255,255,0.08)', duration: 0.4, ease: 'power2.out' })
      })
      box.addEventListener('mouseleave', () => {
        gsap.to(box, { y: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 0.5, ease: 'power2.inOut' })
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
          trigger: star,
          start: 'top 85%',
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

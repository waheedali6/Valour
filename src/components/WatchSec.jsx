'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

const WatchSec = () => {

    const sectionRef = useRef(null)

    useEffect(() => {

        const ctx = gsap.context(() => {

            // =========================
            // SPLIT TEXT
            // =========================

            const heading = new SplitType('.watch-text h2', { types: 'lines,words,chars' })
            const badge   = new SplitType('.watch-text span', { types: 'chars' })

            // line clip setup
            heading.lines?.forEach((line) => {
                line.style.overflow = 'hidden'
                line.style.display  = 'block'
            })

            // =========================
            // INITIAL STATES
            // =========================

            // image (unchanged)
            gsap.set('.watch-parallax', {
                y: 120,
                rotate: -10,
                scale: 1.2,
                opacity: 0,
                force3D: true,
            })

            gsap.set('.watch-bg-zoom', { scale: 1.15 })

            // badge chars
            gsap.set(badge.chars, {
                opacity: 0,
                y: 14,
                rotateX: -60,
            })

            // heading chars
            gsap.set(heading.chars, {
                y: '110%',
                opacity: 0,
                rotateZ: 4,
            })

            // paragraph
            gsap.set('.watch-text p', {
                opacity: 0,
                y: 30,
                filter: 'blur(6px)',
            })

            // =========================
            // IMAGE TIMELINE (scrub — unchanged)
            // =========================

            const imgTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    end: 'bottom center',
                    scrub: 1.2,
                    invalidateOnRefresh: true,
                }
            })

            imgTl
                .to('.watch-parallax', {
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    opacity: 1,
                    ease: 'power4.out',
                }, 0)
                .to('.watch-bg-zoom', {
                    scale: 1,
                    ease: 'none',
                }, 0)

            // =========================
            // TEXT TIMELINE (fires based on scroll)
            // =========================

            const textTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: '20% center',
                    toggleActions: 'play none none reverse',
                    invalidateOnRefresh: true,
                }
            })

            // BADGE chars cascade
            textTl.to(badge.chars, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.04,
                duration: 1.6,
                ease: 'power3.out',
            }, 0)

            // HEADING chars slide up
            textTl.to(heading.chars, {
                y: '0%',
                opacity: 1,
                rotateZ: 0,
                stagger: 0.025,
                duration: 1.8,
                ease: 'power4.out',
            }, 0.15)

            // PARAGRAPH blur dissolve
            textTl.to('.watch-text p', {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 1,
                ease: 'power3.out',
            }, 0.55)

            // =========================
            // PARALLAX SCROLLERS (unchanged)
            // =========================

            gsap.to('.watch-text', {
                yPercent: 0,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 50%',
                    end: 'bottom top',
                    scrub: 1.5,
                    invalidateOnRefresh: true,
                }
            })

            gsap.to('.watch-bg-zoom', {
                yPercent: 8,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                    invalidateOnRefresh: true,
                }
            })

        }, sectionRef)
        

        return () => ctx.revert()

    }, [])

    return (
        <section className='watch-sec' ref={sectionRef}>

            <div className="watch-bg-zoom"></div>
            <div className="watch-overlay"></div>

            <div className="container">
                <div className="row align-items-center">

                    {/* IMAGE SIDE — untouched */}
                    <div className="col-lg-6">
                        <div className="watch-img-wrap">
                            <div className="watch-glow"></div>
                            <div className="watch-parallax">
                                <div className="watch-float">
                                    <img
                                        src="/images/blue.png"
                                        alt="watch"
                                        className='img-fluid watch-img'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TEXT SIDE */}
                    <div className="col-lg-6 text-col">
                        <div className="watch-text">
                            <span>NEW GENERATION</span>
                            <h2>
                                Vibrant Colors Inspired
                                By Light And Nature
                            </h2>
                            <p>
                                Crafted with precision and inspired by
                                natural gradients, the new collection
                                delivers elegance through refined materials,
                                immersive color depth, and timeless engineering.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default WatchSec
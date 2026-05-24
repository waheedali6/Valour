'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WatchSec = () => {

    const sectionRef = useRef(null)

    useEffect(() => {

        const ctx = gsap.context(() => {

            // =========================
            // INITIAL STATES
            // =========================

            gsap.set('.watch-parallax', {
                y: 120,
                rotate: -10,
                scale: 1.2,
                opacity: 0,
                force3D: true,
            })

            gsap.set('.watch-text > *', {
                y: 80,
                opacity: 0,
            })

            gsap.set('.watch-bg-zoom', {
                scale: 1.15,
            })

            // =========================
            // MASTER TIMELINE
            // =========================

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    end: 'bottom center',
                    scrub: 1.2,
                }
            })

            // IMAGE ENTRY
            tl.to('.watch-parallax', {
                y: 0,
                rotate: 0,
                scale: 1,
                opacity: 1,
                ease: 'power4.out',
            }, 0)

            // TEXT ENTRY
            tl.to('.watch-text > *', {
                y: 0,
                opacity: 1,
                stagger: 0.12,
                ease: 'power4.out',
            }, 0.15)

            // BG ZOOM
            tl.to('.watch-bg-zoom', {
                scale: 1,
                ease: 'none',
            }, 0)

            // =========================
            // PARALLAX
            // =========================

            gsap.to('.watch-parallax', {
                yPercent: 10,
                rotateZ: 3,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                }
            })

            gsap.to('.watch-text', {
                yPercent: 0,
                ease: 'none',
                force3D: true,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
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
                }
            })

            // =========================
            // FLOATING
            // =========================

            gsap.to('.watch-float', {
                y: -22,
                rotate: 2,
                duration: 4,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                force3D: true,
            })

            // =========================
            // SIDE DRIFT
            // =========================

            gsap.to('.watch-img-wrap', {
                x: 18,
                duration: 5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                force3D: true,
            })

            // =========================
            // LIGHT SWEEP
            // =========================

            gsap.fromTo(
                '.watch-shine',
                {
                    yPercent: -10,
                    xPercent: -250,
                    opacity: 0,
                },
                {
                    xPercent: 250,
                    opacity: 1,
                    duration: 2.5,
                    ease: 'power2.inOut',
                    repeat: -1,
                    repeatDelay: 3,
                }
            )

            // =========================
            // GLOW PULSE
            // =========================

            gsap.to('.watch-glow', {
                scale: 1.2,
                opacity: 0.85,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                force3D: true,
            })

        }, sectionRef)

        return () => ctx.revert()

    }, [])

    return (
        <section className='watch-sec' ref={sectionRef}>

            {/* BACKGROUND */}
            <div className="watch-bg-zoom"></div>

            {/* OVERLAY */}
            <div className="watch-overlay"></div>

            <div className="container">

                <div className="row align-items-center">

                    {/* IMAGE SIDE */}
                    <div className="col-lg-6">

                        <div className="watch-img-wrap">

                            {/* GLOW */}
                            <div className="watch-glow"></div>

                            {/* PARALLAX LAYER */}
                            <div className="watch-parallax">

                                {/* FLOAT LAYER */}
                                <div className="watch-float">

                                    {/* SHINE */}
                                    <div className="watch-shine"></div>

                                    {/* IMAGE */}
                                    <img
                                        src="/images/blue.webp"
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

                            <span>
                                NEW GENERATION
                            </span>

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
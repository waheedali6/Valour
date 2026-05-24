'use client'

import React, { useEffect, useRef, useState } from 'react'
import { IoBagHandleOutline, IoSearchOutline } from 'react-icons/io5'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Header = () => {
  const headerRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return

    // Entry animation - improved timing
    gsap.set(header, { y: -80, opacity: 0 })
    gsap.to(header, { y: 0, opacity: 1, duration: 1.35, delay: 0.35, ease: 'power4.out' })

    // Nav links stagger - better spacing
    const navLinks = header.querySelectorAll('.nav-link, .side-box > *')
    gsap.set(navLinks, { y: -20, opacity: 0 })
    gsap.to(navLinks, {
      y: 0, opacity: 1,
      duration: 0.9, stagger: 0.095, delay: 0.7, ease: 'power3.out',
    })

    // Logo - improved easing
    const logo = header.querySelector('.navbar-brand')
    if (logo) {
      gsap.set(logo, { scale: 0.7, opacity: 0 })
      gsap.to(logo, { scale: 1, opacity: 1, duration: 1.1, delay: 0.6, ease: 'back.out(2)' })
    }

    // Scroll-based style update
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Hover underline animation for nav links - improved
    const anchors = header.querySelectorAll('.nav-link')
    anchors.forEach((a) => {
      a.addEventListener('mouseenter', () => {
        gsap.to(a, { letterSpacing: '0.09em', duration: 0.35, ease: 'power2.out' })
      })
      a.addEventListener('mouseleave', () => {
        gsap.to(a, { letterSpacing: '0em', duration: 0.35, ease: 'power2.out' })
      })
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      ref={headerRef}
      className={scrolled ? 'header-scrolled' : ''}
    >
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Our Shop</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Blog</a>
              </li>
            </ul>
          </div>
          <a className="navbar-brand" href="#">
            <img src="images/logo.webp" alt="" />
          </a>
          <div className="side-box">
            <a href="#" className='theme-btn'>English</a>
            <IoSearchOutline />
            <IoBagHandleOutline />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header

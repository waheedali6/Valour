'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollProvider() {
  useEffect(() => {
    document.body.style.cursor = 'none'

    // Refresh once immediately
    ScrollTrigger.refresh()

    // Refresh again after fonts/images settle
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 500)
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000)

    return () => {
      document.body.style.cursor = ''
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return null
}
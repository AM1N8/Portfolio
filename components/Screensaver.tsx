'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const IDLE_TIMEOUT  = 15_000
const FONT_SIZE     = 96
const FONT_FAMILY   = '"IBM Plex Mono", monospace'
const FONT_WEIGHT   = '700'

const BOUNCE_COLORS = [
  '#00ff00',
  '#b8bb26',
  '#cba6f7',
  '#7aa2f7',
  '#88c0d0',
  '#ff4444',
  '#fabd2f',
  '#fb4934',
]

export default function Screensaver() {
  const [active, setActive]     = useState(false)
  const [pos, setPos]           = useState({ x: 120, y: 120 })
  const [color, setColor]       = useState(BOUNCE_COLORS[0])

  const velRef       = useRef({ x: 1.8, y: 1.8 })
  const posRef       = useRef({ x: 120, y: 120 })
  const colorIdxRef  = useRef(0)
  const rafRef       = useRef<number>(0)
  const idleTimer    = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const textSize     = useRef({ w: 0, h: FONT_SIZE })
  const disabledRef  = useRef(true)

  // measure text width once
  useEffect(() => {
    const canvas  = document.createElement('canvas')
    const ctx     = canvas.getContext('2d')!
    ctx.font      = `${FONT_WEIGHT} ${FONT_SIZE}px ${FONT_FAMILY}`
    textSize.current.w = ctx.measureText('CDXV').width + 8
    textSize.current.h = FONT_SIZE + 8
  }, [])

  const resetIdle = useCallback(() => {
    if (disabledRef.current) return
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      const speed = window.innerWidth < 768 ? 1.2 : 1.8
      posRef.current = {
        x: 100 + Math.random() * (window.innerWidth  - 300),
        y: 100 + Math.random() * (window.innerHeight - 200),
      }
      velRef.current = {
        x: speed * (Math.random() > 0.5 ? 1 : -1),
        y: speed * (Math.random() > 0.5 ? 1 : -1),
      }
      setPos({ ...posRef.current })
      setActive(true)
    }, IDLE_TIMEOUT)
  }, [])

  const wake = useCallback(() => {
    if (!active) return
    cancelAnimationFrame(rafRef.current)
    setActive(false)
    resetIdle()
  }, [active, resetIdle])

  // idle event listeners + force-screensaver custom event
  useEffect(() => {
    const events = [
      'mousemove', 'mousedown', 'keydown',
      'touchstart', 'scroll', 'wheel', 'click',
    ]
    const onActivity = () => {
      if (active) {
        cancelAnimationFrame(rafRef.current)
        setActive(false)
      }
      if (!disabledRef.current) {
        clearTimeout(idleTimer.current)
        idleTimer.current = setTimeout(() => {
          const speed = window.innerWidth < 768 ? 1.2 : 1.8
          posRef.current = {
            x: 100 + Math.random() * (window.innerWidth  - 300),
            y: 100 + Math.random() * (window.innerHeight - 200),
          }
          velRef.current = {
            x: speed * (Math.random() > 0.5 ? 1 : -1),
            y: speed * (Math.random() > 0.5 ? 1 : -1),
          }
          setPos({ ...posRef.current })
          setActive(true)
        }, IDLE_TIMEOUT)
      }
    }

    const onForce = () => {
      const speed = window.innerWidth < 768 ? 1.2 : 1.8
      posRef.current = {
        x: 100 + Math.random() * (window.innerWidth  - 300),
        y: 100 + Math.random() * (window.innerHeight - 200),
      }
      velRef.current = {
        x: speed * (Math.random() > 0.5 ? 1 : -1),
        y: speed * (Math.random() > 0.5 ? 1 : -1),
      }
      setPos({ ...posRef.current })
      setActive(true)
    }

    const onDisable = () => {
      disabledRef.current = true
      clearTimeout(idleTimer.current)
      cancelAnimationFrame(rafRef.current)
      setActive(false)
    }

    const onEnable = () => {
      disabledRef.current = false
      onActivity()
    }

    events.forEach(e => window.addEventListener(e, onActivity, { passive: true }))
    window.addEventListener('force-screensaver', onForce)
    window.addEventListener('screensaver-off', onDisable)
    window.addEventListener('screensaver-on', onEnable)

    // start the first idle timer
    if (!disabledRef.current) {
      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        const speed = window.innerWidth < 768 ? 1.2 : 1.8
        posRef.current = {
          x: 100 + Math.random() * (window.innerWidth  - 300),
          y: 100 + Math.random() * (window.innerHeight - 200),
        }
        velRef.current = {
          x: speed * (Math.random() > 0.5 ? 1 : -1),
          y: speed * (Math.random() > 0.5 ? 1 : -1),
        }
        setPos({ ...posRef.current })
        setActive(true)
      }, IDLE_TIMEOUT)
    }

    return () => {
      events.forEach(e => window.removeEventListener(e, onActivity))
      window.removeEventListener('force-screensaver', onForce)
      window.removeEventListener('screensaver-off', onDisable)
      window.removeEventListener('screensaver-on', onEnable)
      clearTimeout(idleTimer.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [active])

  // animation loop
  useEffect(() => {
    if (!active) return

    const animate = () => {
      const p  = posRef.current
      const v  = velRef.current
      const tw = textSize.current.w
      const th = textSize.current.h
      const W  = window.innerWidth
      const H  = window.innerHeight

      let nextX = p.x + v.x
      let nextY = p.y + v.y
      let bounced = false

      if (nextX <= 0) {
        nextX = 0
        v.x   = Math.abs(v.x)
        bounced = true
      } else if (nextX + tw >= W) {
        nextX = W - tw
        v.x   = -Math.abs(v.x)
        bounced = true
      }

      if (nextY <= 0) {
        nextY = 0
        v.y   = Math.abs(v.y)
        bounced = true
      } else if (nextY + th >= H) {
        nextY = H - th
        v.y   = -Math.abs(v.y)
        bounced = true
      }

      posRef.current = { x: nextX, y: nextY }

      if (bounced) {
        let nextIdx: number
        do {
          nextIdx = Math.floor(Math.random() * BOUNCE_COLORS.length)
        } while (nextIdx === colorIdxRef.current)
        colorIdxRef.current = nextIdx
        setColor(BOUNCE_COLORS[nextIdx])
      }

      setPos({ x: nextX, y: nextY })
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  if (!active) return null

  return (
    <>
      {/* dim overlay */}
      <div
        style={{
          position:      'fixed',
          inset:         0,
          background:    '#121212',
          opacity:       0.82,
          zIndex:        300,
          pointerEvents: 'none',
        }}
      />

      {/* bouncing CDXV text */}
      <div
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        301,
          pointerEvents: 'none',
          overflow:      'hidden',
        }}
      >
        <span
          style={{
            position:      'absolute',
            left:          pos.x,
            top:           pos.y,
            fontFamily:    FONT_FAMILY,
            fontSize:      FONT_SIZE,
            fontWeight:    FONT_WEIGHT,
            color:         color,
            letterSpacing: '0.15em',
            userSelect:    'none',
            lineHeight:    1,
            willChange:    'transform, color',
            transition:    'color 80ms ease',
          }}
        >
          CDXV
        </span>
      </div>
    </>
  )
}

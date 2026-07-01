import { useMemo } from 'react'
import './GrassRustle.css'

const TUFT_COUNT = 50

function GrassRustle() {
  const tufts = useMemo(() => {
    return Array.from({ length: TUFT_COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 100,        // % across screen
      top: Math.random() * 100,         // % down screen
      size: 28 + Math.random() * 24,    // 28-52px
      delay: Math.random() * 8,         // seconds, staggers the shakes
      duration: 5 + Math.random() * 5,  // seconds, varies pace per tuft
    }))
  }, [])

  return (
    <div className="grass-rustle-layer">
      {tufts.map((t) => (
        <img
          key={t.id}
          src="/tiles/grass-tuft.svg"
          className="tuft"
          style={{
            left: `${t.left}%`,
            top: `${t.top}%`,
            width: `${t.size}px`,
            animationDelay: `${t.delay}s`,
            animationDuration: `${t.duration}s`,
          }}
          alt=""
        />
      ))}
    </div>
  )
}

export default GrassRustle
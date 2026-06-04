import { useEffect, useState } from 'react'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState(0)
  // 0 = black
  // 1 = shield + logo appear
  // 2 = orb materialises
  // 3 = text reveals
  // 4 = exit (curtain lifts)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 700),
      setTimeout(() => setPhase(3), 1300),
      setTimeout(() => setPhase(4), 2200),
      setTimeout(() => onDone(), 2900),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`${styles.screen} ${phase >= 4 ? styles.exit : ''}`}>
      {/* Curtain bar that lifts up */}
      <div className={`${styles.curtain} ${phase >= 4 ? styles.curtainUp : ''}`} />

      <div className={styles.center}>
        {/* Shield logo */}
        <div className={`${styles.shield} ${phase >= 1 ? styles.visible : ''}`}>
          <svg width="48" height="54" viewBox="0 0 48 56" fill="none">
            <path
              d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z"
              fill="#f5a623"
              className={styles.shieldPath}
            />
            <path
              d="M24 6L4.5 14v12c0 11.2 7.8 21.7 19.5 24.4C35.2 47.7 43 37.2 43 26V14L24 6z"
              fill="#141414"
              opacity="0.2"
            />
          </svg>
          {/* Glow ring around shield */}
          <div className={`${styles.shieldGlow} ${phase >= 2 ? styles.shieldGlowActive : ''}`} />
        </div>

        {/* WELL wordmark */}
        <div className={`${styles.wordmark} ${phase >= 1 ? styles.wordmarkVisible : ''}`}>
          {'WELL'.split('').map((ch, i) => (
            <span
              key={i}
              className={styles.letter}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Orb materialises */}
        <div className={`${styles.loadOrb} ${phase >= 2 ? styles.loadOrbVisible : ''}`}>
          <div className={styles.loadOrbInner} />
          <div className={styles.loadOrbHalo} />
        </div>

        {/* Tagline */}
        <p className={`${styles.tagline} ${phase >= 3 ? styles.taglineVisible : ''}`}>
          A quiet promise of safety.
        </p>

        {/* Loading bar */}
        <div className={styles.barTrack}>
          <div
            className={styles.bar}
            style={{
              width: phase === 0 ? '0%'
                : phase === 1 ? '30%'
                : phase === 2 ? '65%'
                : phase === 3 ? '90%'
                : '100%'
            }}
          />
        </div>
      </div>
    </div>
  )
}

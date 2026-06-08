import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './WaitlistView.module.css'

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL

/* ─────────────────────────────────────────
   EMBER PARTICLES (Self-contained)
   ───────────────────────────────────────── */
function Particles() {
  return (
    <div className={styles.particles} aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className={styles.ember}
          style={{
            '--delay': `${(i * 0.37) % 4}s`,
            '--x': `${25 + (i * 37) % 50}%`,
            '--drift': `${((i * 53) % 60) - 30}px`,
            '--size': `${2 + (i % 3)}px`,
            '--dur': `${3.5 + (i * 0.4) % 3}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   MOUSE-REACTIVE ORB (Self-contained)
   ───────────────────────────────────────── */
function Orb({ mousePos }) {
  const orbRef = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t
    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, mousePos.current.rx * 25, 0.055)
      currentRef.current.y = lerp(currentRef.current.y, mousePos.current.ry * 18, 0.055)
      if (orbRef.current) {
        orbRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${currentRef.current.x * 1.8}px, ${currentRef.current.y * 1.8}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [mousePos])

  return (
    <div className={styles.orbScene} aria-hidden="true">
      <div className={styles.orbBackdrop} />
      <div ref={glowRef} className={styles.orbHalo} />
      <div ref={orbRef} className={styles.orbWrap}>
        <div className={styles.orb} />
        <div className={styles.orbHighlight} />
        <div className={styles.orbSpecular} />
      </div>
      <div className={styles.ripple1} />
      <div className={styles.ripple2} />
      <div className={styles.ripple3} />
      <Particles />
    </div>
  )
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTON (Self-contained)
   ───────────────────────────────────────── */
function MagneticBtn({ children, className, ...props }) {
  const ref = useRef(null)
  const rafRef = useRef(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const radius = 130
    if (dist < radius) {
      const strength = (1 - dist / radius) * 0.42
      targetRef.current = { x: dx * strength, y: dy * strength }
    } else {
      targetRef.current = { x: 0, y: 0 }
    }
  }, [])

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t
    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.1)
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.1)
      if (ref.current) {
        ref.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    window.addEventListener('mousemove', onMove)
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('mousemove', onMove) }
  }, [onMove])

  return <button ref={ref} className={className} {...props}>{children}</button>
}

/* ─────────────────────────────────────────
   MAIN WAITLIST PAGE
   ───────────────────────────────────────── */
export default function WaitlistView({ onNavigate, mousePos, onOpenModal }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [count] = useState(4281)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Enter a valid email address.')
      setStatus('error')
      return
    }
    
    setStatus('loading')

    if (!APPS_SCRIPT_URL) {
      console.warn('[Waitlist] VITE_APPS_SCRIPT_URL environment variable is not defined. Simulating submission...')
      await new Promise(r => setTimeout(r, 1400))
      setStatus('success')
      return
    }

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ email }),
      })
      setStatus('success')
    } catch (error) {
      console.error('[Waitlist] Network error during submission:', error)
      setErrorMsg('Failed to submit. Please check your connection.')
      setStatus('error')
    }
  }

  return (
    <div className={styles.waitlistContainer}>
      
      {/* Back button */}
      <button className={styles.backBtn} onClick={() => onNavigate('home')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Home
      </button>

      {/* Orb background */}
      <div className={styles.orbWrapper}>
        <Orb mousePos={mousePos} />
      </div>

      <div className={styles.contentWrap}>
        
        {/* Logo */}
        <div className={styles.logo} onClick={() => onNavigate('home')}>
          <svg width="20" height="24" viewBox="0 0 48 56" fill="none">
            <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
          </svg>
          <span>WELL</span>
        </div>

        {/* Glassmorphic signup card */}
        <div className={styles.signupCard}>
          
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Early access signup
          </div>

          {status === 'success' ? (
            <div className={styles.successWrap} role="status" aria-live="polite">
              <div className={styles.successRing}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="#141414" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className={styles.successTextContainer}>
                <p className={styles.successTitle}>You're on the list.</p>
                <p className={styles.successSub}>We've registered your spot. We'll reach out when we release the next private beta build.</p>
              </div>
              <button className={styles.returnBtn} onClick={() => onNavigate('home')}>
                Return to Landing Page
              </button>
            </div>
          ) : (
            <>
              <h1 className={styles.cardTitle}>
                Live alone. <br />
                <span className={styles.titleAccent}>Never feel alone.</span>
              </h1>
              <p className={styles.cardDesc}>
                Well is currently in private testing. Sign up with your email to reserve your spot on the waitlist and secure early access when we launch.
              </p>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label htmlFor="email-input" className={styles.srOnly}>Email address</label>
                <div className={`${styles.inputWrap} ${status === 'error' ? styles.inputWrapErr : ''}`}>
                  <svg className={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    id="email-input"
                    type="email"
                    className={styles.input}
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                    disabled={status === 'loading'}
                    autoComplete="email"
                    aria-invalid={status === 'error'}
                  />
                </div>
                {status === 'error' && <p className={styles.errMsg} role="alert">{errorMsg}</p>}
                
                <MagneticBtn type="submit" id="join-waitlist-btn" className={styles.btn} disabled={status === 'loading'}>
                  {status === 'loading'
                    ? <span className={styles.spinner} />
                    : <>Secure My Spot <span className={styles.btnArrow}>→</span></>
                  }
                </MagneticBtn>
              </form>

              {/* Social Proof */}
              <div className={styles.orRule} aria-hidden="true">
                <span className={styles.orLine} />
                <span className={styles.orWord}>trusted by</span>
                <span className={styles.orLine} />
              </div>

              <div className={styles.socialProof}>
                Join <span className={styles.socialNum}>{count.toLocaleString()}</span> others on the waitlist
              </div>

              {/* Badges */}
              <div className={styles.trustRow}>
                {['iOS & Android Beta', 'Runs quietly in background', 'End-to-end encrypted alerts'].map((t, i) => (
                  <div key={i} className={styles.trustBadge}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </>
          )}

        </div>

      </div>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerBrand}>
          <p className={styles.copyright}>© {new Date().getFullYear()} Well. All rights reserved.</p>
          <p className={styles.companyInfo}>A product of Allhive (ALLhive Technology Limited)</p>
        </div>
        
        <div className={styles.footerContact}>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Address:</span>
            <span className={styles.contactValue}>Abel Abayomi, Langbasa, Harmony Estate, Ajah, Lagos</span>
          </div>
          <div className={styles.contactItem}>
            <span className={styles.contactLabel}>Phone:</span>
            <span className={styles.contactValue}>
              <a href="tel:08156170216" className={styles.phoneLink}>08156170216</a>
            </span>
          </div>
        </div>

        <div className={styles.footerLinks}>
          <button onClick={() => onOpenModal('privacy')} className={styles.footerBtn}>Privacy Policy</button>
          <button onClick={() => onOpenModal('terms')} className={styles.footerBtn}>Terms of Use</button>
        </div>
      </footer>

    </div>
  )
}

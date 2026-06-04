import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './App.module.css'
import Cursor from './Cursor'
import LoadingScreen from './LoadingScreen'

/* ─────────────────────────────────────────
   EMBER PARTICLES
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
            '--x': `${30 + (i * 37) % 40}%`,
            '--drift': `${((i * 53) % 60) - 30}px`,
            '--size': `${2 + (i % 3)}px`,
            '--dur': `${3 + (i * 0.4) % 3}s`,
          }}
        />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   MOUSE-REACTIVE ORB
───────────────────────────────────────── */
function Orb({ mousePos }) {
  const orbRef = useRef(null)
  const glowRef = useRef(null)
  const rafRef = useRef(null)
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t
    const animate = () => {
      currentRef.current.x = lerp(currentRef.current.x, mousePos.current.rx * 20, 0.055)
      currentRef.current.y = lerp(currentRef.current.y, mousePos.current.ry * 14, 0.055)
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
   MAGNETIC BUTTON
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
   FORM
───────────────────────────────────────── */
function Form() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [count] = useState(4281)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.includes('@') || !email.includes('.')) { setStatus('error'); return }
    setStatus('loading')
    await new Promise(r => setTimeout(r, 1400))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className={styles.successWrap} role="status" aria-live="polite">
        <div className={styles.successRing}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#141414" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className={styles.successTitle}>You're on the list.</p>
          <p className={styles.successSub}>We'll reach out when it's your turn.</p>
        </div>
      </div>
    )
  }

  return (
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
      {status === 'error' && <p className={styles.errMsg} role="alert">Enter a valid email address.</p>}
      <MagneticBtn type="submit" id="join-waitlist-btn" className={styles.btn} disabled={status === 'loading'}>
        {status === 'loading'
          ? <span className={styles.spinner} />
          : <>GET EARLY ACCESS <span className={styles.btnArrow}>→</span></>
        }
      </MagneticBtn>
    </form>
  )
}

/* ─────────────────────────────────────────
   SOCIAL PROOF AVATARS
───────────────────────────────────────── */
function SocialProof() {
  const [count] = useState(4281)
  return (
    <div className={styles.socialProof}>
      <p className={styles.socialText}>
        Join <span className={styles.socialNum}>{count.toLocaleString()}</span> others on the waitlist
      </p>
    </div>
  )
}

/* ─────────────────────────────────────────
   APP FEATURES (right panel info)
───────────────────────────────────────── */
const appFeatures = [
  { icon: '⏱️', label: 'You set the check-in interval' },
  { icon: '👤', label: 'Add a guardian you trust' },
  { icon: '🔔', label: "Miss one — they're notified instantly" },
  { icon: '🏠', label: 'Built for people living alone' },
]

/* ─────────────────────────────────────────
   HEADLINE with char-by-char reveal
───────────────────────────────────────── */
function RevealText({ text, accent, delay = 0, visible }) {
  return (
    <span className={styles.revealLine}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className={`${styles.revealChar} ${accent ? styles.revealAccent : ''} ${visible ? styles.revealCharVisible : ''}`}
          style={{ transitionDelay: `${delay + i * 28}ms` }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  )
}

/* ─────────────────────────────────────────
   LOGO
───────────────────────────────────────── */
function Logo() {
  return (
    <div className={styles.logo}>
      <svg width="16" height="20" viewBox="0 0 48 56" fill="none" aria-hidden="true">
        <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
        <path d="M24 6L4.5 14v12c0 11.2 7.8 21.7 19.5 24.4C35.2 47.7 43 37.2 43 26V14L24 6z" fill="#141414" opacity="0.2" />
      </svg>
      <span>WELL</span>
    </div>
  )
}

/* ─────────────────────────────────────────
   MODAL COMPONENT
───────────────────────────────────────── */
function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close modal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   APP ROOT
───────────────────────────────────────── */
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [pageVisible, setPageVisible] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // 'privacy' | 'terms' | null
  const mousePos = useRef({ rx: 0, ry: 0, x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mousePos.current = { x: e.clientX, y: e.clientY, rx: (e.clientX - cx) / cx, ry: (e.clientY - cy) / cy }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleLoadDone = useCallback(() => {
    setLoaded(true)
    setTimeout(() => setPageVisible(true), 80)
  }, [])

  return (
    <>
      <Cursor />
      {!loaded && <LoadingScreen onDone={handleLoadDone} />}

      <div className={`${styles.page} ${pageVisible ? styles.pageVisible : ''}`}>

        {/* ── NAV ── */}
        <header className={styles.header}>
          <Logo />
          <nav className={styles.navLinks} aria-label="Site navigation">
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#about" className={styles.navLink}>About</a>
          </nav>
          <div className={styles.liveTag}>
            <span className={styles.liveDot} />
            Early Access
          </div>
        </header>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <main className={styles.split}>

          {/* ════ LEFT PANEL — Brand + Orb + Info ════ */}
          <section className={styles.left} aria-label="App overview" id="features">
            {/* Orb */}
            <div className={styles.orbSection}>
              <Orb mousePos={mousePos} />
            </div>

            {/* Headline */}
            <h1 className={styles.headline}>
              <RevealText text="Someone always" delay={100} visible={pageVisible} />
              <RevealText text="knows you're okay." accent delay={320} visible={pageVisible} />
            </h1>

            <p className={`${styles.sub} ${pageVisible ? styles.subVisible : ''}`}>
              Set your check-in schedule. Add a trusted guardian.
              If you miss one — they're notified automatically.
            </p>

            {/* Feature pills */}
            <ul
              className={`${styles.featureList} ${pageVisible ? styles.featureListVisible : ''}`}
              aria-label="App features"
              id="about"
            >
              {appFeatures.map((f, i) => (
                <li
                  key={i}
                  className={styles.featurePill}
                  style={{ transitionDelay: `${700 + i * 90}ms` }}
                >
                  <span className={styles.pillIcon} aria-hidden="true">{f.icon}</span>
                  {f.label}
                </li>
              ))}
            </ul>
          </section>

          {/* ── Divider ── */}
          <div className={`${styles.divider} ${pageVisible ? styles.dividerVisible : ''}`} aria-hidden="true" />

          {/* ════ RIGHT PANEL — Form + Social Proof ════ */}
          <section className={`${styles.right} ${pageVisible ? styles.rightVisible : ''}`} aria-label="Join the waitlist">
            <div className={styles.rightInner}>

              {/* Right eyebrow */}
              <div className={styles.eyebrow}>
                <span className={styles.eyebrowDot} aria-hidden="true" />
                Now accepting sign-ups
              </div>

              <h2 className={styles.rightHeadline}>
                Live alone. Never <span className={styles.rhAccent}>feel alone.</span>
              </h2>

              <p className={styles.rightSub}>
                Well is a quiet safety net for people living alone. Your guardian only hears from us
                when you miss a check-in — everything else stays private.
                Be first to know when we launch.
              </p>

              <Form />

              {/* Divider rule */}
              <div className={styles.orRule} aria-hidden="true">
                <span className={styles.orLine} />
                <span className={styles.orWord}>trusted by</span>
                <span className={styles.orLine} />
              </div>

              <SocialProof />

              {/* Trust badges */}
              <div className={styles.trustRow}>
                {['iOS & Android', 'No false alarms', 'Runs quietly in background'].map((t, i) => (
                  <div key={i} className={styles.trustBadge}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                      stroke="#f5a623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {t}
                  </div>
                ))}
              </div>

            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} Well. No spam. Unsubscribe anytime.</p>
          <div className={styles.footerLinks}>
            <button onClick={() => setActiveModal('privacy')} className={styles.footerBtn}>Privacy</button>
            <button onClick={() => setActiveModal('terms')} className={styles.footerBtn}>Terms</button>
          </div>
        </footer>
      </div>

      {/* ── MODALS ── */}
      <Modal isOpen={activeModal === 'privacy'} onClose={() => setActiveModal(null)} title="Privacy Policy">
        <div className={styles.policyContent}>
          <h3>1. Information We Collect</h3>
          <p>To provide our check-in safety service, we collect minimal but necessary information:</p>
          <ul>
            <li><strong>Account Information:</strong> Your email address when you sign up for early access or create an account.</li>
            <li><strong>Guardian Contacts:</strong> The contact details (email or phone number) of the trusted guardian you select.</li>
            <li><strong>Check-in Logs:</strong> Timestamps of your successful check-ins and the status of your set intervals. We do not track your real-time location.</li>
          </ul>

          <h3>2. How We Use Your Data</h3>
          <p>We use your information solely to run the safety loop:</p>
          <ul>
            <li>Checking if you have checked in within your designated interval.</li>
            <li>Dispatching automated alerts to your designated guardian only if you miss an interval.</li>
            <li>We never sell, rent, or share your personal data with third parties for marketing purposes.</li>
          </ul>

          <h3>3. Data Retention & Privacy</h3>
          <p>Your privacy is our core priority. Check-in logs are kept only as long as necessary to run the safety service and are regularly purged. We implement industry-standard encryption to secure your contact details.</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'terms'} onClose={() => setActiveModal(null)} title="Terms of Use">
        <div className={styles.policyContent}>
          <h3>1. Nature of the Service</h3>
          <p>Well is designed to act as a personal check-in utility and automated notification network. It is a tool for peace of mind, but <strong>it is not a replacement for professional emergency services (such as 911, 112, or local police/medical response).</strong></p>

          <h3>2. User Responsibilities</h3>
          <p>As a user of Well, you agree to:</p>
          <ul>
            <li>Provide accurate contact information for yourself and your designated guardian.</li>
            <li>Obtain consent from your guardian before adding them to your safety network.</li>
            <li>Acknowledge that network connectivity, battery levels, and device settings may affect delivery of check-ins and alerts.</li>
          </ul>

          <h3>3. Limitation of Liability</h3>
          <p>Well is provided on an "as-is" and "as-available" basis. We do not guarantee uninterrupted service and cannot be held liable for delayed or failed notifications, missed check-ins, or any consequences resulting from communication failures.</p>
        </div>
      </Modal>
    </>
  )
}

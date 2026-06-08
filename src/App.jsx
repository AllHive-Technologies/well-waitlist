import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './App.module.css'
import Cursor from './Cursor'
import LoadingScreen from './LoadingScreen'
import HomeView from './components/HomeView'
import WaitlistView from './components/WaitlistView'

// Shared Modal component
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

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [pageVisible, setPageVisible] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // 'privacy' | 'terms' | null
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  
  const mousePos = useRef({ rx: 0, ry: 0, x: 0, y: 0 })

  // Synchronize path-based routing
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
      // Smooth scroll back to top on route change
      window.scrollTo(0, 0)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Navigation handler
  const handleNavigate = useCallback((view) => {
    const targetPath = view === 'waitlist' ? '/waitlist' : '/'
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
      setCurrentPath(targetPath)
    }
    window.scrollTo(0, 0)
  }, [])

  // Tracking mouse movement for active views (like Orb parallax)
  useEffect(() => {
    const onMove = (e) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      mousePos.current = { 
        x: e.clientX, 
        y: e.clientY, 
        rx: (e.clientX - cx) / cx, 
        ry: (e.clientY - cy) / cy 
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const handleLoadDone = useCallback(() => {
    setLoaded(true)
    setTimeout(() => setPageVisible(true), 80)
  }, [])

  const isWaitlist = currentPath.replace(/\/$/, '') === '/waitlist'

  return (
    <>
      <Cursor />
      {!loaded && <LoadingScreen onDone={handleLoadDone} />}

      <div className={`${styles.pageWrapper} ${pageVisible ? styles.pageVisible : ''}`}>
        {isWaitlist ? (
          <WaitlistView onNavigate={handleNavigate} mousePos={mousePos} onOpenModal={setActiveModal} />
        ) : (
          <HomeView onNavigate={handleNavigate} onOpenModal={setActiveModal} />
        )}
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

import { useEffect, useRef, useState } from 'react'
import styles from './HomeView.module.css'
import PhoneMockup from './PhoneMockup'

export default function HomeView({ onNavigate, onOpenModal }) {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRefs = useRef([])

  // Setup intersection observer for scrollport tracking on desktop
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-35% 0px -40% 0px', // trigger when element occupies center viewport
      threshold: 0.15,
    }

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const step = parseInt(entry.target.getAttribute('data-step'), 10)
          setActiveStep(step)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)

    // Observe scroll blocks
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const stepsData = [
    {
      title: "Your Silent Guardian",
      subtitle: "Silent, passive, and privacy-first.",
      text: "Well runs quietly in the background of your device. It does not track your live GPS coordinates, listen to your conversations, or log health data. It simply tracks a safety loop timer to make sure you are safe."
    },
    {
      title: "Set Your Check-in Schedule",
      subtitle: "Fits seamlessly into your routine.",
      text: "Decide when you want to confirm you're safe. Choose a daily check-in (e.g. 9:00 AM), twice a day, or custom intervals. You can easily adjust the schedule or pause it when you are traveling."
    },
    {
      title: "Designate a Trusted Guardian",
      subtitle: "No app installation required for them.",
      text: "Add a friend, family member, or trusted neighbor as your guardian. They do not need to download Well or register an account. We contact them directly via SMS if your safety loop is broken."
    },
    {
      title: "Choose Verification Methods",
      subtitle: "Multiple secure ways to confirm you are safe.",
      text: "Select how you prefer to verify check-ins and deactivate alerts. You can use FaceID or fingerprint biometrics, record a secure voice phrase, or enter a manual six-digit passkey PIN."
    },
    {
      title: "Emergency Alerts, When It Matters",
      subtitle: "Never leaves your safety to chance.",
      text: "If you miss a check-in, we send multiple high-priority push notifications and alerts to your device. If you remain unresponsive, Well automatically triggers an urgent SMS alert to your guardian."
    }
  ]

  // Handler for mobile step clicks
  const handleMobileStepSelect = (index) => {
    setActiveStep(index)
  }

  return (
    <div className={styles.homeContainer}>
      
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg width="18" height="22" viewBox="0 0 48 56" fill="none" className={styles.logoSvg}>
            <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
          </svg>
          <span>WELL</span>
        </div>
        <nav className={styles.navLinks}>
          <a href="#how-it-works" className={styles.navLink}>How it Works</a>
          <a href="#why-well" className={styles.navLink}>Why Well</a>
        </nav>
        <button className={styles.headerCta} onClick={() => onNavigate('waitlist')}>
          Join Waitlist
        </button>
      </header>

      {/* ── HERO SECTION ── */}
      <section className={styles.heroSection}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            REDEFINING INDEPENDENT LIVING
          </div>
          <h1 className={styles.heroTitle}>
            Someone always <br />
            <span className={styles.gradientText}>knows you're okay.</span>
          </h1>
          <p className={styles.heroSubtext}>
            Well is a quiet safety net for people who live alone. It monitors your daily check-ins 
            and alerts a trusted contact only if you go missing, keeping your life private and your safety secure.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn} onClick={() => onNavigate('waitlist')}>
              Get Early Access <span className={styles.arrow}>→</span>
            </button>
            <a href="#how-it-works" className={styles.secondaryBtn}>
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE SHOWCASE / SCROLLYTELLING (DESKTOP) ── */}
      <section id="how-it-works" className={styles.showcaseSection}>
        <div className={styles.showcaseTitleArea}>
          <div className={styles.sectionBadge}>WALKTHROUGH</div>
          <h2 className={styles.showcaseHeadline}>How Well Works</h2>
          <p className={styles.showcaseSubtext}>
            Take a look inside the application and see how we maintain a passive, secure connection.
          </p>
        </div>

        {/* Layout split: Left cards scroll, Right mockup stays sticky */}
        <div className={styles.scrollyLayout}>
          
          <div className={styles.scrollyLeft}>
            {stepsData.map((step, index) => (
              <div
                key={index}
                ref={(el) => (sectionRefs.current[index] = el)}
                data-step={index}
                className={`${styles.stepBlock} ${activeStep === index ? styles.stepBlockActive : ''}`}
              >
                <div className={styles.stepNumber}>0{index + 1}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <h4 className={styles.stepSubtitle}>{step.subtitle}</h4>
                <p className={styles.stepDescription}>{step.text}</p>
              </div>
            ))}
          </div>

          <div className={styles.scrollyRight}>
            <div className={styles.stickyDeviceWrapper}>
              <div className={styles.deviceGlow} style={{
                '--glow-color': activeStep === 4 ? 'rgba(255, 110, 90, 0.15)' : 'rgba(245, 166, 35, 0.15)'
              }} />
              <PhoneMockup activeStep={activeStep} />
            </div>
          </div>

        </div>

        {/* MOBILE LAYOUT ALTERNATIVE: Interactive tabs instead of sticky scroll */}
        <div className={styles.mobileShowcase}>
          <div className={styles.mobileDeviceArea}>
            <PhoneMockup activeStep={activeStep} />
          </div>
          <div className={styles.mobileTabs}>
            {stepsData.map((step, index) => (
              <button
                key={index}
                className={`${styles.mobileTabBtn} ${activeStep === index ? styles.mobileTabBtnActive : ''}`}
                onClick={() => handleMobileStepSelect(index)}
              >
                <span className={styles.mobileTabNum}>0{index + 1}</span>
                <span className={styles.mobileTabTitle}>{step.title}</span>
              </button>
            ))}
          </div>
          <div className={styles.mobileStepDetails}>
            <h4 className={styles.mobileStepSubtitle}>{stepsData[activeStep].subtitle}</h4>
            <p className={styles.mobileStepDescription}>{stepsData[activeStep].text}</p>
          </div>
        </div>

      </section>

      {/* ── VALUES SECTION ── */}
      <section id="why-well" className={styles.valuesSection}>
        <div className={styles.valuesGrid}>
          
          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🔒</div>
            <h3 className={styles.valueTitle}>Absolute Privacy</h3>
            <p className={styles.valueDesc}>
              No tracking, no sharing, and no spyware. Your guardian is only notified if you miss a check-in. 
              Everything else remains local to your device and completely private.
            </p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>🔕</div>
            <h3 className={styles.valueTitle}>Zero False Alarms</h3>
            <p className={styles.valueDesc}>
              We issue multiple gentle vibrations, audio triggers, and push notifications to your phone 
              long before checking in with your guardian. No unnecessary panics.
            </p>
          </div>

          <div className={styles.valueCard}>
            <div className={styles.valueIcon}>📱</div>
            <h3 className={styles.valueTitle}>No Guardian App Needed</h3>
            <p className={styles.valueDesc}>
              Your contact doesn't need to sign up, log in, or install anything. They receive clean SMS 
              alerts directly, containing immediate action options.
            </p>
          </div>

        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaGlow} />
          <h2 className={styles.ctaTitle}>Secure your piece of mind today.</h2>
          <p className={styles.ctaDesc}>
            Join the private waitlist for early beta builds on iOS & Android. 
            No spam, unsubscribe anytime.
          </p>
          <button className={styles.ctaBtn} onClick={() => onNavigate('waitlist')}>
            Reserve Early Access Spot
          </button>
          <div className={styles.socialProofText}>
            Join 4,281 others on the list.
          </div>
        </div>
      </section>

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

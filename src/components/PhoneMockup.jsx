import { useEffect, useState } from 'react'
import styles from './PhoneMockup.module.css'

export default function PhoneMockup({ activeStep = 0 }) {
  const [currentTime, setCurrentTime] = useState('12:34')
  
  // Update time according to screenshots if active, or actual clock
  useEffect(() => {
    if (activeStep >= 0 && activeStep <= 3) {
      const timeout = setTimeout(() => {
        setCurrentTime('12:34')
      }, 0)
      return () => clearTimeout(timeout)
    } else {
      const updateClock = () => {
        const now = new Date()
        let hours = now.getHours()
        const minutes = String(now.getMinutes()).padStart(2, '0')
        const ampm = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        hours = hours ? hours : 12
        setCurrentTime(`${hours}:${minutes} ${ampm}`)
      }
      updateClock()
      const timer = setInterval(updateClock, 30000)
      return () => clearInterval(timer)
    }
  }, [activeStep])

  // Sub Navigation Tabs Component for Settings View
  const renderSettingsTabs = (activeTab) => (
    <div className={styles.settingsTabsRow}>
      <button className={`${styles.settingsTab} ${activeTab === 'monitor' ? styles.settingsTabActive : ''}`}>Monitor</button>
      <button className={`${styles.settingsTab} ${activeTab === 'guardians' ? styles.settingsTabActive : ''}`}>Guardians</button>
      <button className={`${styles.settingsTab} ${activeTab === 'verify' ? styles.settingsTabActive : ''}`}>Verify</button>
      <button className={`${styles.settingsTab} ${activeTab === 'widget' ? styles.settingsTabActive : ''}`}>Widget</button>
    </div>
  )

  // Bottom Navigation Bar
  const renderBottomNav = (selectedTab) => (
    <div className={styles.bottomNav}>
      <div className={styles.bottomNavInner}>
        {/* Shield tab */}
        <div className={`${styles.bottomNavTab} ${selectedTab === 'shield' ? styles.bottomNavTabActive : ''}`}>
          <svg className={styles.bottomNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          {selectedTab === 'shield' && <span className={styles.navIndicator} />}
        </div>
        
        {/* History tab */}
        <div className={`${styles.bottomNavTab} ${selectedTab === 'history' ? styles.bottomNavTabActive : ''}`}>
          <svg className={styles.bottomNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* Gear tab */}
        <div className={`${styles.bottomNavTab} ${selectedTab === 'gear' ? styles.bottomNavTabActive : ''}`}>
          <svg className={styles.bottomNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          {selectedTab === 'gear' && <span className={styles.navIndicator} />}
        </div>
      </div>
    </div>
  )

  return (
    <div className={styles.phoneContainer}>
      {/* Side physical buttons */}
      <div className={`${styles.sideButton} ${styles.volumeUp}`} />
      <div className={`${styles.sideButton} ${styles.volumeDown}`} />
      <div className={`${styles.sideButton} ${styles.powerButton}`} />

      {/* Main Chassis */}
      <div className={styles.phoneChassis}>
        {/* Screen Bezel */}
        <div className={styles.phoneScreen}>
          
          {/* Glare effect */}
          <div className={styles.screenGlare} />

          {/* Dynamic Island */}
          <div className={styles.dynamicIsland}>
            <div className={styles.cameraDot} />
          </div>

          {/* Android Status Bar */}
          <div className={styles.statusBar}>
            <span className={styles.statusTime}>{currentTime}</span>
            <div className={styles.statusIcons}>
              {/* Wifi */}
              <svg width="12" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21l-12-12c4.4-4.4 10.6-5.8 16.2-4.2l-4.2 16.2z" opacity="0.3" />
                <path d="M12 3c-4.3 0-8.2 1.7-11.3 4.7l11.3 11.3 11.3-11.3c-3.1-3-7-4.7-11.3-4.7z" />
              </svg>
              {/* Battery */}
              <div className={styles.batteryIcon}>
                <div className={styles.batteryBody}>
                  <div className={styles.batteryLevel} style={{ width: activeStep === 4 ? '18%' : '90%' }} />
                </div>
                <div className={styles.batteryTip} />
              </div>
            </div>
          </div>

          {/* SCREEN CONTENT LAYERS */}
          <div className={styles.screenContainer}>
            
            {/* SCREEN 0: DASHBOARD (Screenshot 4) */}
            <div className={`${styles.screen} ${activeStep === 0 ? styles.screenActive : ''} ${styles.dotBg}`}>
              {/* App Header */}
              <div className={styles.dashboardHeader}>
                <div className={styles.logoGroup}>
                  <svg width="14" height="16" viewBox="0 0 48 56" fill="none">
                    <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
                  </svg>
                  <span className={styles.logoText}>WELL</span>
                </div>
                
                {/* User avatar details */}
                <div className={styles.userProfile}>
                  <div className={styles.userText}>
                    <div className={styles.profileName}>Awesomely geeky</div>
                    <div className={styles.profileEmail}>emyyoung2@gmail.com</div>
                  </div>
                  <div className={styles.profileAvatar}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={styles.scrollArea}>
                {/* Active monitoring status */}
                <div className={styles.activeStatusRow}>
                  <span className={styles.pulseDotAmber} />
                  <span className={styles.pulseStatusLabel}>LIVE MONITORING ACTIVE</span>
                </div>

                {/* Configurations text */}
                <div className={styles.configSummary}>
                  <p className={styles.configTitle}>Monitoring is configured for Awesomely geeky</p>
                  <p className={styles.configDetails}>12 Hours with 15 Mins grace period</p>
                </div>

                {/* Big dial countdown */}
                <div className={styles.dashboardCountdownArea}>
                  <div className={styles.dialOuter}>
                    <div className={styles.dialInner}>
                      <span className={styles.dialState}>ACTIVE</span>
                      <span className={styles.dialTimer}>07:43:30</span>
                      <div className={styles.dialUnits}>
                        <span>h</span>
                        <span>m</span>
                        <span>s</span>
                      </div>
                      <span className={styles.dialFooter}>UNTIL CHECK-IN</span>
                    </div>
                    <div className={styles.dialRingGlow} />
                  </div>
                </div>

                {/* Verify action button */}
                <button className={styles.verifyNowBtn} disabled>VERIFY NOW</button>

                {/* Details list */}
                <div className={styles.dashboardDetails}>
                  {/* Streak */}
                  <div className={styles.dashboardPill}>
                    <span className={styles.detailIcon}>🔥</span>
                    <span className={styles.detailText}>1 check-in in a row</span>
                  </div>

                  {/* Time info card */}
                  <div className={styles.dashboardCard}>
                    <div className={styles.cardHeaderRow}>
                      <span className={styles.cardIcon}>⏱️</span>
                      <div className={styles.cardHeadings}>
                        <div className={styles.cardLabel}>Time Until Check-In</div>
                        <div className={styles.cardValue}>7h 43m</div>
                      </div>
                    </div>
                  </div>

                  {/* Escalation flow card */}
                  <div className={styles.escalationCard}>
                    <div className={styles.escalationTitle}>Escalation Flow</div>
                    <div className={styles.escalationRow}>
                      <div className={styles.escalationIconWrapper}>
                        <span className={styles.escalationBadgeIcon}>🔔</span>
                      </div>
                      <div className={styles.escalationTexts}>
                        <div className={styles.escalationHeader}>Guardian alert is sent</div>
                        <div className={styles.escalationDesc}>After grace, alert guardians via WhatsApp, Email</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {renderBottomNav('shield')}
            </div>

            {/* SCREEN 1: MONITOR SETTINGS (Screenshot 3) */}
            <div className={`${styles.screen} ${activeStep === 1 ? styles.screenActive : ''} ${styles.dotBg}`}>
              {/* Settings Header */}
              <div className={styles.settingsHeader}>
                <div className={styles.logoGroup}>
                  <svg width="14" height="16" viewBox="0 0 48 56" fill="none">
                    <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
                  </svg>
                  <span className={styles.settingsTitle}>SETTINGS</span>
                </div>
                <div className={styles.prefTitle}>Preferences</div>
                <div className={styles.prefSub}>Manage monitoring, guardians and account</div>
              </div>

              {renderSettingsTabs('monitor')}

              <div className={styles.scrollArea}>
                <div className={styles.settingsContainer}>
                  {/* Check-in Frequency */}
                  <div className={styles.appSettingsBlock}>
                    <div className={styles.blockTitleRow}>
                      <span className={styles.blockTitleIcon}>⏱️</span>
                      <span className={styles.blockTitle}>CHECK-IN FREQUENCY</span>
                    </div>
                    
                    <div className={styles.frequencyGrid}>
                      <button className={`${styles.gridBtn} ${styles.gridBtnActive}`} disabled>12 Hours</button>
                      <button className={styles.gridBtn} disabled>Daily</button>
                      <button className={styles.gridBtn} disabled>Weekly</button>
                      <button className={styles.gridBtn} disabled>Monthly</button>
                    </div>

                    <div className={styles.startTimeSelector}>
                      <div className={styles.timeIconLabel}>
                        <span className={styles.selectorIcon}>🕒</span>
                        <span>Start time: 7:03 PM</span>
                      </div>
                      <span className={styles.chevronRight}>⟩</span>
                    </div>
                  </div>

                  {/* Grace Period */}
                  <div className={styles.appSettingsBlock}>
                    <div className={styles.blockTitleRow}>
                      <span className={styles.blockTitleIcon}>⏳</span>
                      <span className={styles.blockTitle}>GRACE PERIOD</span>
                    </div>
                    
                    <div className={styles.frequencyGrid}>
                      <button className={styles.gridBtn} disabled>None</button>
                      <button className={styles.gridBtn} disabled>5 Mins</button>
                      <button className={`${styles.gridBtn} ${styles.gridBtnActive}`} disabled>15 Mins</button>
                      <button className={styles.gridBtn} disabled>30 Mins</button>
                      <button className={styles.gridBtn} disabled>1 Hour</button>
                    </div>
                  </div>

                  <button className={styles.saveSettingsBtn} disabled>SAVE MONITORING SETTINGS</button>
                </div>
              </div>

              {renderBottomNav('gear')}
            </div>

            {/* SCREEN 2: GUARDIANS SETTINGS (Screenshot 2) */}
            <div className={`${styles.screen} ${activeStep === 2 ? styles.screenActive : ''} ${styles.dotBg}`}>
              {/* Settings Header */}
              <div className={styles.settingsHeader}>
                <div className={styles.logoGroup}>
                  <svg width="14" height="16" viewBox="0 0 48 56" fill="none">
                    <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
                  </svg>
                  <span className={styles.settingsTitle}>SETTINGS</span>
                </div>
                <div className={styles.prefTitle}>Preferences</div>
                <div className={styles.prefSub}>Manage monitoring, guardians and account</div>
              </div>

              {renderSettingsTabs('guardians')}

              <div className={styles.scrollArea}>
                <div className={styles.settingsContainer}>
                  {/* Guardians Block */}
                  <div className={styles.appSettingsBlock}>
                    <div className={styles.blockTitleRow}>
                      <span className={styles.blockTitleIcon}>👥</span>
                      <span className={styles.blockTitle}>GUARDIANS</span>
                    </div>

                    <div className={styles.guardianList}>
                      <div className={styles.guardianRow}>
                        <div className={styles.guardianBadge}>NA</div>
                        <div className={styles.guardianDetails}>
                          <div className={styles.guardName}>Noel adebayo</div>
                          <div className={styles.guardPhone}>8156170216</div>
                        </div>
                        <button className={styles.deleteGuardBtn} disabled>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {renderBottomNav('gear')}
            </div>

            {/* SCREEN 3: VERIFICATION METHOD (Screenshot 1) */}
            <div className={`${styles.screen} ${activeStep === 3 ? styles.screenActive : ''} ${styles.dotBg}`}>
              {/* Settings Header */}
              <div className={styles.settingsHeader}>
                <div className={styles.logoGroup}>
                  <svg width="14" height="16" viewBox="0 0 48 56" fill="none">
                    <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
                  </svg>
                  <span className={styles.settingsTitle}>SETTINGS</span>
                </div>
                <div className={styles.prefTitle}>Preferences</div>
                <div className={styles.prefSub}>Manage monitoring, guardians and account</div>
              </div>

              {renderSettingsTabs('verify')}

              <div className={styles.scrollArea}>
                <div className={styles.settingsContainer}>
                  {/* Verification Method Block */}
                  <div className={styles.appSettingsBlock}>
                    <div className={styles.blockTitleRow}>
                      <span className={styles.blockTitleIcon}>🔒</span>
                      <span className={styles.blockTitle}>VERIFICATION METHOD</span>
                    </div>
                    
                    <p className={styles.blockSubtext}>Choose how you confirm check-ins and deactivate alerts.</p>

                    <div className={styles.methodsList}>
                      {/* Biometrics */}
                      <div className={styles.methodRow}>
                        <div className={styles.methodIconWrapper}>
                          <span className={styles.methodRowIcon}>👤</span>
                        </div>
                        <div className={styles.methodTexts}>
                          <div className={styles.methodTitle}>Biometrics</div>
                          <div className={styles.methodSub}>FACEID & FINGERPRINT</div>
                        </div>
                        <div className={styles.radioOutline} />
                      </div>

                      {/* Voice Phrase */}
                      <div className={styles.methodRow}>
                        <div className={styles.methodIconWrapper}>
                          <span className={styles.methodRowIcon}>🌊</span>
                        </div>
                        <div className={styles.methodTexts}>
                          <div className={styles.methodTitle}>Voice Phrase</div>
                          <div className={styles.methodSub}>ENCRYPTED ACOUSTIC KEY</div>
                        </div>
                        <div className={styles.radioOutline} />
                      </div>

                      {/* Passkey PIN (Selected) */}
                      <div className={`${styles.methodRow} ${styles.methodRowSelected}`}>
                        <div className={styles.methodIconWrapper}>
                          <span className={styles.methodRowIcon}>🛡️</span>
                        </div>
                        <div className={styles.methodTexts}>
                          <div className={styles.methodTitle}>Passkey PIN</div>
                          <div className={styles.methodSub}>MANUAL 6-DIGIT SECURE</div>
                        </div>
                        <div className={styles.radioChecked}>
                          <span className={styles.radioCheckedDot} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className={styles.saveSettingsBtn} disabled>SAVE VERIFICATION METHOD</button>
                </div>
              </div>

              {renderBottomNav('gear')}
            </div>

            {/* SCREEN 4: EMERGENCY ALERT (Lockscreen Notification) */}
            <div className={`${styles.screen} ${activeStep === 4 ? styles.screenActive : ''} ${styles.alertLockScreen}`}>
              <div className={styles.lockscreenTop}>
                <div className={styles.lockIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className={styles.lockTime}>9:18 PM</div>
                <div className={styles.lockDate}>Friday, June 5</div>
              </div>

              {/* Apple iOS Notification Banner */}
              <div className={styles.notificationBanner}>
                <div className={styles.notifHeader}>
                  <div className={styles.notifApp}>
                    <svg width="12" height="12" viewBox="0 0 48 56" fill="none">
                      <path d="M24 0L0 10v16c0 14.7 10.2 28.5 24 32C37.8 54.5 48 40.7 48 26V10L24 0z" fill="#f5a623" />
                    </svg>
                    <span>WELL SAFETY NET</span>
                  </div>
                  <span className={styles.notifTime}>now</span>
                </div>
                <h4 className={styles.notifTitle}>🚨 MISSING CHECK-IN ALERT</h4>
                <p className={styles.notifBody}>
                  Noel adebayo missed their 9:00 PM check-in and failed to respond to alerts. Please check on them immediately.
                </p>
                <div className={styles.notifActions}>
                  <button className={styles.notifBtn} disabled>Call Noel</button>
                  <button className={styles.notifBtnAccent} disabled>Get Location</button>
                </div>
              </div>
            </div>

          </div>

          {/* iOS home indicator bar */}
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </div>
  )
}

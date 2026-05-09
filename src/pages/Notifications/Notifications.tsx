import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBreakpoint } from '@/hooks/useBreakpoint'

interface NotificationPreference {
  id: string
  label: string
  channels: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

const notificationPreferences: NotificationPreference[] = [
  {
    id: 'security',
    label: 'Security Alerts (Login, MFA, Token Changes)',
    channels: { email: true, sms: true, push: true },
  },
  {
    id: 'compliance',
    label: 'Compliance & Audit Events',
    channels: { email: true, sms: false, push: true },
  },
  {
    id: 'sharing',
    label: 'File Sharing Activity',
    channels: { email: true, sms: false, push: false },
  },
  {
    id: 'policy',
    label: 'Policy Changes & Updates',
    channels: { email: true, sms: false, push: false },
  },
  {
    id: 'incident',
    label: 'Incident & Threat Reports',
    channels: { email: true, sms: true, push: true },
  },
  {
    id: 'maintenance',
    label: 'Maintenance & System Status',
    channels: { email: false, sms: false, push: false },
  },
]

/**
 * Notifications Page — Notification preferences and channels
 *
 * Layout: Notification types with channel toggles (email, SMS, push)
 * - Critical alerts always enabled
 * - Per-channel granular control
 * - Visual status indicators
 */
export default function Notifications() {
  const { isMobile } = useBreakpoint()
  const [prefs, setPrefs] = useState<NotificationPreference[]>(notificationPreferences)

  const toggleChannel = (id: string, channel: 'email' | 'sms' | 'push') => {
    setPrefs((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              channels: { ...p.channels, [channel]: !p.channels[channel] },
            }
          : p
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold text-t0">Notifications</h1>
        <p className="text-sm text-t2">
          Choose how and when you want to be notified about important events
        </p>
      </motion.div>

      {/* Channel Headers */}
      <div className="bg-s2 border border-bd rounded-lg p-4 hidden md:block">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-6 text-xs font-mono text-t2 uppercase">Event Type</div>
          <div className="col-span-2 text-xs font-mono text-t2 uppercase text-center">Email</div>
          <div className="col-span-2 text-xs font-mono text-t2 uppercase text-center">SMS</div>
          <div className="col-span-2 text-xs font-mono text-t2 uppercase text-center">Push</div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div
        className={`
          space-y-3
          ${isMobile ? '' : ''}
        `}
      >
        {prefs.map((pref, idx) => (
          <motion.div
            key={pref.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className={`
              bg-s2 border border-bd rounded-lg p-4
              ${isMobile ? 'space-y-3' : 'grid grid-cols-12 gap-2 items-center'}
            `}
          >
            {/* Event Label */}
            <div className={isMobile ? '' : 'col-span-6'}>
              <p className="font-semibold text-t0 text-sm">{pref.label}</p>
            </div>

            {/* Channel Toggles */}
            <div
              className={`
                flex gap-4
                ${isMobile ? '' : 'col-span-6 justify-between'}
              `}
            >
              {(['email', 'sms', 'push'] as const).map((channel) => (
                <motion.div
                  key={channel}
                  className={`
                    flex items-center gap-2
                    ${isMobile ? 'flex-1' : 'flex-1 justify-center'}
                  `}
                >
                  {isMobile && (
                    <label className="text-xs text-t2 capitalize font-mono flex-shrink-0">
                      {channel}
                    </label>
                  )}
                  <motion.button
                    onClick={() =>
                      toggleChannel(pref.id, channel as 'email' | 'sms' | 'push')
                    }
                    className={`
                      flex-shrink-0 w-10 h-6 rounded-full transition-colors relative
                      ${pref.channels[channel] ? 'bg-cy' : 'bg-bd'}
                    `}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      className="absolute w-5 h-5 rounded-full bg-white"
                      initial={false}
                      animate={{
                        left: pref.channels[channel] ? '2px' : '-2px',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      style={{ top: '1px' }}
                    />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quiet Hours Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-s2 border border-bd rounded-lg p-6 space-y-4"
      >
        <h2 className="font-bold text-t0">Quiet Hours</h2>
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <div>
            <label className="text-xs text-t2 uppercase font-mono">Start Time</label>
            <input
              type="time"
              defaultValue="22:00"
              className="mt-2 w-full px-3 py-2 bg-s1 border border-bd rounded text-t0 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-t2 uppercase font-mono">End Time</label>
            <input
              type="time"
              defaultValue="08:00"
              className="mt-2 w-full px-3 py-2 bg-s1 border border-bd rounded text-t0 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-t2">
          💤 Only critical security alerts will be sent during quiet hours
        </p>
      </motion.div>

      {/* Notification History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="bg-s2 border border-bd rounded-lg p-6 space-y-3"
      >
        <h2 className="font-bold text-t0">Recent Notifications</h2>
        <div className="space-y-2 text-xs text-t2">
          <p>✓ Security Alert • Successful login from new device (2 hours ago)</p>
          <p>✓ Compliance Report • Audit log export completed (Yesterday)</p>
          <p>✓ File Activity • 3 new shares from team (Yesterday)</p>
        </div>
      </motion.div>
    </div>
  )
}

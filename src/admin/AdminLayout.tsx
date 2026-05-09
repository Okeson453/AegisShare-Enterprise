import { useEffect } from 'react'
import { AdminSidebar, AdminTopbar, AdminBreadcrumb } from './components/layout'
import { Overview } from './pages/Overview/Overview'
import { ServiceHealthPage } from './pages/ServiceHealth/ServiceHealth'
import { IncidentsPage } from './pages/Incidents/Incidents'
import { UserManagementPage } from './pages/UserManagement/UserManagement'
import { LicenseFeatures } from './pages/LicenseFeatures/LicenseFeatures'
import { BackupRecovery } from './pages/BackupRecovery/BackupRecovery'
import { RolesPermissions } from './pages/RolesPermissions/RolesPermissions'
import { DataSovereignty } from './pages/DataSovereignty/DataSovereignty'
import { AdminAuditLog } from './pages/AdminAuditLog/AdminAuditLog'
import { SystemConfig } from './pages/SystemConfig/SystemConfig'
import { useAdminUiStore } from './store'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

const pages: Record<string, React.ComponentType> = {
  overview: Overview,
  health: ServiceHealthPage,
  incidents: IncidentsPage,
  users: UserManagementPage,
  license: LicenseFeatures,
  backup: BackupRecovery,
  roles: RolesPermissions,
  sovereignty: DataSovereignty,
  audit: AdminAuditLog,
  config: SystemConfig,
}

export const AdminLayout = () => {
  const { activeNav, setActiveNav } = useAdminUiStore()
  const Page = pages[activeNav] || Overview

  useKeyboardShortcuts([
    {
      key: 'ctrl+shift+h',
      handler: () => setActiveNav('overview'),
      description: 'Go to admin home',
    },
    {
      key: 'ctrl+shift+f',
      handler: () => setActiveNav('overview'),
      description: 'Admin search',
    },
  ])

  return (
  <div className='flex h-screen w-full bg-slate-950 text-slate-200'>
    <AdminSidebar />
    <div className='flex-1 flex flex-col min-w-0'>
      <AdminTopbar />
      <AdminBreadcrumb />
      <main className='flex-1 overflow-y-auto p-6'>
        <Page />
      </main>
    </div>
  </div>
)
}

import { AdminAuditRow } from './AdminAuditRow'
import { DataTableWrapper } from '../DataTableIntegration'

interface AuditEntry {
  id: string
  admin: string
  action: string
  timestamp: string
  status: 'success' | 'failed'
}

interface Props {
  audits?: AuditEntry[]
  isLoading?: boolean
  error?: string | null
}

export const AdminAuditTable = ({ audits, isLoading = false, error = null }: Props) => {
  const defaultAudits: AuditEntry[] = [
    { id: 'aud-001', admin: 'alice@aegis.com', action: 'Modified service config', timestamp: '2026-04-06 14:32', status: 'success' },
    { id: 'aud-002', admin: 'bob@aegis.com', action: 'Created user account', timestamp: '2026-04-06 13:15', status: 'success' },
    { id: 'aud-003', admin: 'charlie@aegis.com', action: 'Updated security policy', timestamp: '2026-04-06 11:45', status: 'success' },
    { id: 'aud-004', admin: 'alice@aegis.com', action: 'Reset user MFA', timestamp: '2026-04-06 10:20', status: 'failed' },
  ]

  const data = audits ?? defaultAudits

  if (error) {
    return (
      <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
        <p className='font-bold'>Error loading audit log</p>
        <p className='text-sm mt-1'>{error}</p>
      </div>
    )
  }

  return (
    <DataTableWrapper
      isLoading={isLoading}
      data={data}
      skeletonType='audit'
      columns={<div>Admin | Action | Timestamp | Status</div>}
      renderRow={(audit: any) => (
        <AdminAuditRow
          key={audit.id}
          admin={audit.admin}
          action={audit.action}
          timestamp={audit.timestamp}
          status={audit.status}
        />
      )}
    />
  )
}

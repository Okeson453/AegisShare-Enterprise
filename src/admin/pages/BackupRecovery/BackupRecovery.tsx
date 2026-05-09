import { useBackup } from '@/admin/hooks'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'

export const BackupRecovery = () => {
  const { snapshots, rtoRpo } = useBackup()

  return (
    <AdminPageWrapper title='Backup & Recovery' subtitle='Manage system backups and recovery plans'>
      <div className='s12-stack-lg'>
        {rtoRpo && (
          <div className='s12-section s12-stack-md'>
            <h3 className='s12-text-sm s12-font-bold s12-text-emphasis s12-mb-4'>RTO / RPO Metrics</h3>
            <div className='bento'>
              <div className='bento-4 s12-stat-card'>
                <div className='s12-text-xs s12-text-muted s12-mb-1'>RTO</div>
                <div className='s12-text-xl s12-font-bold s12-text-emphasis'>{rtoRpo.recoveryTimeObjective}m</div>
              </div>
              <div className='bento-4 s12-stat-card'>
                <div className='s12-text-xs s12-text-muted s12-mb-1'>RPO</div>
                <div className='s12-text-xl s12-font-bold s12-text-emphasis'>{rtoRpo.recoveryPointObjective}m</div>
              </div>
              <div className={`bento-4 s12-stat-card ${rtoRpo.slaCompliance >= 95 ? 's12-success-state' : 's12-warning-state'}`}>
                <div className='s12-text-xs s12-text-muted s12-mb-1'>SLA Compliance</div>
                <div className='s12-text-xl s12-font-bold s12-text-emphasis'>
                  {rtoRpo.slaCompliance.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        <div className='s12-section s12-stack-md'>
          <h3 className='s12-text-sm s12-font-bold s12-text-emphasis s12-mb-4'>Snapshots</h3>
          <div className='s12-stack-sm'>
            {snapshots.map((snap) => (
              <div key={snap.id} className={`s12-row-md s12-items-center s12-justify-between s12-p-3 s12-rounded-lg ${snap.status === 'completed' ? 's12-success-state' : 's12-warning-state'}`}>
                <div>
                  <div className='s12-text-sm s12-text-emphasis'>{snap.name}</div>
                  <div className='s12-text-xs s12-text-muted'>{snap.sizeGB} GB • {new Date(snap.createdAt).toLocaleString()}</div>
                </div>
                <div className='s12-flex s12-items-center'>
                  <span className={`s12-text-xs s12-px-2 s12-py-1 s12-rounded ${snap.status === 'completed' ? 's12-badge-success' : 's12-badge-warning'}`}>
                    {snap.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  )
}

import { SnapshotList, RtoRpoStatus } from '../../components/backup'

export const SnapshotManagement = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-bold text-slate-100 mb-4'>Snapshots</h3>
        <SnapshotList />
      </div>
      <div>
        <h3 className='text-lg font-bold text-slate-100 mb-4'>SLA Summary</h3>
        <RtoRpoStatus />
      </div>
    </div>
  )
}

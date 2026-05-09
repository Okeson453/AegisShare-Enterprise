import { SnapshotRow } from './SnapshotRow'
import { DataTableWrapper } from '../DataTableIntegration'

interface Snapshot {
  id: string
  date: string
  size: string
  status: 'healthy' | 'degraded' | 'failed'
}

interface Props {
  snapshots?: Snapshot[]
  isLoading?: boolean
  error?: string | null
}

export const SnapshotList = ({ snapshots, isLoading = false, error = null }: Props) => {
  const defaultSnapshots: Snapshot[] = [
    { id: 'snap-001', date: '2026-04-06', size: '125 GB', status: 'healthy' },
    { id: 'snap-002', date: '2026-04-05', size: '124 GB', status: 'healthy' },
    { id: 'snap-003', date: '2026-04-04', size: '123 GB', status: 'healthy' },
    { id: 'snap-004', date: '2026-04-03', size: '122 GB', status: 'degraded' },
  ]

  const data = snapshots ?? defaultSnapshots

  if (error) {
    return (
      <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
        <p className='font-bold'>Error loading snapshots</p>
        <p className='text-sm mt-1'>{error}</p>
      </div>
    )
  }

  return (
    <DataTableWrapper<Snapshot>
      isLoading={isLoading}
      data={data}
      skeletonType='file'
      columns={<div />}
      renderRow={(snapshot: any) => (
        <div>
        <SnapshotRow
            key={snapshot.id}
            id={snapshot.id}
            date={snapshot.date}
            size={snapshot.size}
            status={snapshot.status}
          />
        </div>
      )}
    />
  )
}

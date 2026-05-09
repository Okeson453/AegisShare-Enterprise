import type { AdminUser } from '@/admin/types'
import { DataTableWrapper } from '../DataTableIntegration'

interface Props {
  users?: AdminUser[]
  isLoading?: boolean
  error?: string | null
}

export const AdminUserList = ({ users = [], isLoading = false, error = null }: Props) => {
  if (error) {
    return (
      <div className='p-4 rounded border border-red-500/30 bg-red-500/10 text-red-300'>
        <p className='font-bold'>Error loading users</p>
        <p className='text-sm mt-1'>{error}</p>
      </div>
    )
  }

  return (
    <DataTableWrapper
      isLoading={isLoading}
      data={users}
      skeletonType='user'
      columns={<div />}
      renderRow={(user: any) => (
        <div key={user.id} className='px-4 py-3 rounded border border-slate-700/50 bg-slate-900/30 flex justify-between items-center'>
          <div>
            <p className='font-bold text-slate-200'>{user.email}</p>
            <p className='text-xs text-slate-500 mt-1'>{user.role}</p>
          </div>
          <div className='flex gap-2'>
            <span className='px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300'>{user.clearanceLevel}</span>
            <span className={`px-2 py-1 text-xs rounded ${user.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {user.active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      )}
    />
  )
}

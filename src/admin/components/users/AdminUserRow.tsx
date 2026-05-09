import type { AdminUser } from '@/admin/types'
import { cn } from '../../../lib/utils'

interface Props {
    user: AdminUser
    onSelect?: (id: string) => void
}

export const AdminUserRow = ({ user, onSelect }: Props) => {
    const clearanceColors: Record<string, string> = {
        L1: 'bg-blue-900/20 text-blue-300',
        L2: 'bg-cyan-900/20 text-cyan-300',
        L3: 'bg-yellow-900/20 text-yellow-300',
        L4: 'bg-orange-900/20 text-orange-300',
        L5: 'bg-red-900/20 text-red-300',
    }

    return (
        <button
            onClick={() => onSelect?.(user.id)}
            className='w-full p-3 border border-slate-700/50 rounded hover:bg-slate-900/50 transition-colors text-left'
        >
            <div className='flex items-center justify-between gap-3'>
                <div className='flex-1 min-w-0'>
                    <div className='font-semibold text-sm text-slate-200 truncate'>{user.name}</div>
                    <div className='text-xs text-slate-500 truncate'>{user.email}</div>
                </div>

                <div className='flex items-center gap-2'>
                    <span className={cn('text-xs px-2 py-1 rounded font-bold', clearanceColors[user.clearanceLevel])}>
                        {user.clearanceLevel}
                    </span>
                    <span className={cn(
                        'text-xs px-2 py-1 rounded',
                        user.active ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'
                    )}>
                        {user.active ? 'Active' : 'Inactive'}
                    </span>
                    {user.mfaEnabled && <span className='text-xs text-blue-400'>🔐</span>}
                </div>
            </div>
        </button>
    )
}

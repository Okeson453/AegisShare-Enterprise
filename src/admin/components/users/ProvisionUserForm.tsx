import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const ProvisionUserForm = () => {
    const [email, setEmail] = useState('')
    const [clearance, setClearance] = useState('L1')
    const { executeAction } = useAdminActions()

    const handleProvision = async () => {
        await executeAction(
            async () => {
                // TODO: Call API to provision user
                return { success: true, message: `User ${email} provisioned as ${clearance}` }
            },
            {
                loadingMessage: 'Provisioning user...',
                successMessage: `User ${email} provisioned successfully`,
                errorMessage: 'Failed to provision user'
            }
        )
        setEmail('')
        setClearance('L1')
    }

    return (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30 space-y-4'>
            <h3 className='font-bold text-slate-200'>Provision New Admin User</h3>

            <input
                type='email'
                placeholder='user@company.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded text-slate-300 placeholder-slate-500 focus:outline-none focus:border-amber-500/50'
            />

            <select
                value={clearance}
                onChange={e => setClearance(e.target.value)}
                className='w-full px-3 py-2 bg-slate-800 border border-slate-700/50 rounded text-slate-300 focus:outline-none focus:border-amber-500/50'
                aria-label='Clearance level selection'
            >
                <option value='L1'>L1 - Analyst</option>
                <option value='L2'>L2 - Officer</option>
                <option value='L3'>L3 - Admin</option>
                <option value='L4'>L4 - Lead</option>
                <option value='L5'>L5 - Super</option>
            </select>

            <button
                onClick={handleProvision}
                disabled={!email}
                className='w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded font-bold border border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
            >
                Provision User
            </button>
        </div>
    )
}

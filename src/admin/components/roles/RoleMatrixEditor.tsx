import { useState } from 'react'
import { useAdminActions } from '@/admin/hooks/useAdminActions'

export const RoleMatrixEditor = () => {
    const [permissions, setPermissions] = useState<Record<string, boolean[]>>({
        'View Health': [true, true, true, true, true],
        'Create Incidents': [false, true, true, true, true],
        'Manage Users': [false, false, true, true, true],
        'Configure System': [false, false, false, true, true],
        'Danger Zone': [false, false, false, false, true]
    })
    const { executeAction } = useAdminActions()

    const handleSaveMatrix = async () => {
        await executeAction(
            async () => ({ success: true }),
            {
                loadingMessage: 'Saving role matrix...',
                successMessage: 'Role permissions updated',
                errorMessage: 'Failed to update roles'
            }
        )
    }

    return (
        <div className='space-y-4'>
            <div className='overflow-x-auto rounded border border-slate-700/50'>
                <table className='w-full text-sm bg-slate-900/30'>
                    <thead className='bg-slate-900/50 border-b border-slate-700/50'>
                        <tr>
                            <th className='px-4 py-2 text-left font-bold text-slate-300'>Permission</th>
                            <th className='px-4 py-2 text-center font-bold text-slate-300'>L1</th>
                            <th className='px-4 py-2 text-center font-bold text-slate-300'>L2</th>
                            <th className='px-4 py-2 text-center font-bold text-slate-300'>L3</th>
                            <th className='px-4 py-2 text-center font-bold text-slate-300'>L4</th>
                            <th className='px-4 py-2 text-center font-bold text-slate-300'>L5</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(permissions).map(([perm, perms]) => (
                            <tr key={perm} className='border-b border-slate-700/30 hover:bg-slate-800/20'>
                                <td className='px-4 py-2 text-slate-300'>{perm}</td>
                                {perms.map((val, idx) => (
                                    <td key={idx} className='px-4 py-2 text-center'>
                                        <input 
                                            type='checkbox' 
                                            checked={val}
                                            onChange={(e) => {
                                                const newPerms = [...perms]
                                                newPerms[idx] = e.target.checked
                                                setPermissions({ ...permissions, [perm]: newPerms })
                                            }}
                                            className='w-4 h-4'
                                            aria-label={`${perm} for clearance level ${idx + 1}`}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleSaveMatrix}
                className='w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded font-bold border border-blue-500/30'
            >
                Save Role Matrix
            </button>
        </div>
    )
}

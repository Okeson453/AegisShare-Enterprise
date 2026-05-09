import { useMemo } from 'react'
import { cn } from '../../../lib/utils'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'

const CLEARANCE_LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5'] as const
const PERMISSIONS = [
    'View System Health',
    'Manage Services',
    'Create Incidents',
    'Resolve Incidents',
    'View Admin Users',
    'Provision Users',
    'Deprovision Users',
    'Reset MFA',
    'View Audit Log',
    'Export Data',
    'Manage Licenses',
    'Toggle Features',
    'Create Backups',
    'Restore Backups',
    'Access Danger Zone',
    'Modify System Config',
]

const PERMISSIONS_MATRIX: Record<string, boolean[]> = {
    L1: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    L2: [true, false, true, false, false, false, false, false, false, false, false, false, false, false, false, false],
    L3: [true, true, true, true, true, false, false, false, true, false, false, false, false, false, false, false],
    L4: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, false, true],
    L5: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true],
}

interface PermissionCheckProps {
    hasPermission: boolean
}

const PermissionCheck = ({ hasPermission }: PermissionCheckProps) => (
    <div className={cn(
        's12-flex s12-items-center s12-justify-center s12-h-full s12-rounded-md s12-border',
        hasPermission
            ? 's12-success-state s12-text-emphasis'
            : 's12-border s12-text-muted'
    )}>
        {hasPermission ? '✓' : '—'}
    </div>
)

export const RolesPermissions = () => {
    const roleDescriptions: Record<string, string> = {
        L1: 'Compliance Analyst - View-only access to system health and basic reporting',
        L2: 'Security Officer - Can create incidents and view audit logs',
        L3: 'System Administrator - Full operational access except danger zone',
        L4: 'Infrastructure Lead - Operational + licensing and backup management',
        L5: 'Super Administrator - Unrestricted access including danger zone',
    }

    const expandedMatrix = useMemo(() => {
        return CLEARANCE_LEVELS.map(level => ({
            level,
            description: roleDescriptions[level],
            permissions: PERMISSIONS.map((perm, idx) => ({
                name: perm,
                granted: PERMISSIONS_MATRIX[level][idx],
            })),
        }))
    }, [])

    return (
        <AdminPageWrapper title='Roles & Permissions' subtitle='Manage role-based access control and permission hierarchy'>
            <div className='s12-stack-lg'>
                {/* Clearance Level Cards */}
                <div className='bento'>
                    {expandedMatrix.map(({ level, description }) => (
                        <div
                            key={level}
                            className='bento-2 s12-stat-card'
                        >
                            <div className='s12-row-md s12-justify-between s12-items-start s12-mb-2'>
                                <span className='s12-font-bold s12-text-lg'>{level}</span>
                                <span className='s12-text-xs s12-text-subtle'>Clearance</span>
                            </div>
                            <p className='s12-text-sm s12-text-muted'>{description}</p>
                        </div>
                    ))}
                </div>

                {/* Permissions Matrix */}
                <div className='s12-stack-md'>
                    <h2 className='s12-text-2xl s12-font-bold s12-text-emphasis'>Permissions Matrix</h2>

                    <div className='s12-overflow-x-auto s12-rounded-lg s12-border s12-section'>
                        <table className='s12-w-full s12-text-sm'>
                            <thead>
                                <tr className='s12-border-b s12-border-accent'>
                                    <th className='s12-px-4 s12-py-3 s12-text-left s12-font-bold s12-text-muted'>Permission</th>
                                    {CLEARANCE_LEVELS.map(level => (
                                        <th key={level} className='s12-px-3 s12-py-3 s12-text-center s12-font-bold s12-text-muted'>
                                            {level}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {PERMISSIONS.map((permission, idx) => (
                                    <tr
                                        key={permission}
                                        className='s12-border-b s12-border-accent'
                                    >
                                        <td className='s12-px-4 s12-py-3 s12-text-muted'>{permission}</td>
                                        {CLEARANCE_LEVELS.map(level => (
                                            <td key={`${level}-${idx}`} className='s12-px-3 s12-py-3 s12-text-center'>
                                                <PermissionCheck
                                                    hasPermission={PERMISSIONS_MATRIX[level][idx]}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Access Control Best Practices */}
                <div className='s12-section s12-stack-md'>
                    <h3 className='s12-font-bold s12-text-emphasis'>Access Control Best Practices</h3>
                    <ul className='s12-stack-sm s12-text-sm s12-text-muted'>
                        <li className='s12-flex s12-gap-md'>
                            <span className='s12-text-warning s12-mt-1 s12-flex-shrink-0'>→</span>
                            <span>Assign the minimum clearance level necessary for job function</span>
                        </li>
                        <li className='s12-flex s12-gap-md'>
                            <span className='s12-text-warning s12-mt-1 s12-flex-shrink-0'>→</span>
                            <span>Review L4 and L5 assignments monthly for necessity</span>
                        </li>
                        <li className='s12-flex s12-gap-md'>
                            <span className='s12-text-warning s12-mt-1 s12-flex-shrink-0'>→</span>
                            <span>All admin actions above L3 are logged and auditable</span>
                        </li>
                        <li className='s12-flex s12-gap-md'>
                            <span className='s12-text-warning s12-mt-1 s12-flex-shrink-0'>→</span>
                            <span>Danger zone actions (L5) require 2FA and manager approval</span>
                        </li>
                        <li className='s12-flex s12-gap-md'>
                            <span className='s12-text-warning s12-mt-1 s12-flex-shrink-0'>→</span>
                            <span>Clearance levels are immutable - create new users to change access</span>
                        </li>
                    </ul>
                </div>
            </div>
        </AdminPageWrapper>
    )
}
        </AdminPageWrapper >
    )
}

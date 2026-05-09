import { useAdminUiStore } from '@/admin/store'

const navLabels: Record<string, string> = {
    overview: 'System Overview',
    health: 'Service Health',
    incidents: 'Incident Management',
    users: 'User Management',
    roles: 'Roles & Permissions',
    sovereignty: 'Data Sovereignty',
    license: 'License Management',
    backup: 'Backup & Recovery',
    audit: 'Admin Audit Log',
    config: 'System Configuration',
}

export const AdminBreadcrumb = () => {
    const { activeNav } = useAdminUiStore()

    return (
        <div className='text-xs text-slate-500 px-4 py-2 bg-slate-900/50 border-b border-slate-700/30 flex items-center gap-2'>
            <span>Admin</span>
            <span>/</span>
            <span className='text-slate-300'>{navLabels[activeNav] || 'Dashboard'}</span>
        </div>
    )
}

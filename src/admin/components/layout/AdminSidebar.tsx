import { useAdminUiStore } from '@/admin/store'
import { cn } from '../../../lib/utils'

const navItems = [
    { id: 'overview', label: 'Overview', icon: '🎯' },
    { id: 'health', label: 'Service Health', icon: '🏥' },
    { id: 'incidents', label: 'Incidents', icon: '🚨' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'roles', label: 'Roles & Perms', icon: '🔐' },
    { id: 'sovereignty', label: 'Data Sovereignty', icon: '🌍' },
    { id: 'license', label: 'License', icon: '📋' },
    { id: 'backup', label: 'Backup & Recovery', icon: '💾' },
    { id: 'audit', label: 'Audit Log', icon: '📝' },
    { id: 'config', label: 'System Config', icon: '⚙️' },
]

export const AdminSidebar = () => {
    const { activeNav, setActiveNav, sidebarCollapsed } = useAdminUiStore()

    return (
        <div className={cn(
            'bg-slate-950 border-r border-slate-700/50 flex flex-col overflow-hidden transition-all',
            sidebarCollapsed ? 'w-16' : 'w-56'
        )}>
            <div className='p-4 border-b border-slate-700/50 flex items-center justify-between'>
                {!sidebarCollapsed && <div className='font-bold text-sm text-amber-400'>ADMIN</div>}
            </div>

            <nav className='flex-1 overflow-y-auto space-y-1 p-2'>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                        className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium transition-all',
                            activeNav === item.id
                                ? 'bg-amber-600/20 text-amber-400 border-l-2 border-amber-500'
                                : 'text-slate-400 hover:bg-slate-900/50'
                        )}
                        title={item.label}
                    >
                        <span className='text-base'>{item.icon}</span>
                        {!sidebarCollapsed && <span>{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className='p-3 border-t border-slate-700/50 text-xs text-slate-500'>
                {!sidebarCollapsed && <div>v4.2.1</div>}
            </div>
        </div>
    )
}

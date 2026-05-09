import { useEffect } from 'react'
import { useAdminUiStore } from '@/admin/store'

export const AdminTopbar = () => {
  const { toggleSidebar, sidebarCollapsed } = useAdminUiStore()

  // Register common admin shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+N: New user
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        // TODO: Emit event or navigate to new user form
        console.log('New user shortcut')
      }
      // Ctrl+Shift+I: New incident
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault()
        // TODO: Emit event or navigate to new incident form
        console.log('New incident shortcut')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className='h-12 bg-slate-950/95 backdrop-blur border-b border-slate-700/50 flex items-center px-4 justify-between sticky top-0 z-30'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => toggleSidebar()}
          className='p-1 hover:bg-slate-800 rounded transition-colors'
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          ☰
        </button>
        <div className='text-sm font-semibold text-slate-200'>Admin Console</div>
      </div>

      <div className='flex items-center gap-2'>
        <span className='text-xs text-green-400'>● SYSTEM OK</span>
      </div>
    </div>
  )
}

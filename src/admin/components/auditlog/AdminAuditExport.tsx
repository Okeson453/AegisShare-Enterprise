import { useState } from 'react'

export const AdminAuditExport = () => {
    const [format, setFormat] = useState<'csv' | 'json' | 'pdf'>('csv')
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = () => {
        setIsExporting(true)
        setTimeout(() => {
            setIsExporting(false)
            // Mock download trigger
            console.log(`Exporting audit log as ${format}`)
        }, 1000)
    }

    return (
        <div className='bg-slate-900/30 border border-slate-700/50 rounded-lg p-4'>
            <div className='flex items-center gap-3'>
                <div className='flex-1'>
                    <label className='block text-sm text-slate-300 mb-2'>Export Format</label>
                    <select
                        value={format}
                        onChange={(e) => setFormat(e.target.value as 'csv' | 'json' | 'pdf')}
                        className='w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm'
                        aria-label='Export format selection'
                    >
                        <option value='csv'>CSV</option>
                        <option value='json'>JSON</option>
                        <option value='pdf'>PDF</option>
                    </select>
                </div>

                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className='bg-amber-600 hover:bg-amber-700 disabled:bg-slate-700 text-slate-950 font-bold py-2 px-6 rounded transition-colors mt-7'
                    aria-label='Export audit logs'
                >
                    {isExporting ? 'Exporting...' : 'Export'}
                </button>
            </div>
        </div>
    )
}

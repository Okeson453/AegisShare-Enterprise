import { SecurityConfigPanel, DangerZonePanel } from '../../components/config'

export const SecuritySettings = () => {
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-bold text-slate-100 mb-4'>Security Configuration</h3>
                <SecurityConfigPanel />
            </div>
            <div>
                <DangerZonePanel />
            </div>
        </div>
    )
}

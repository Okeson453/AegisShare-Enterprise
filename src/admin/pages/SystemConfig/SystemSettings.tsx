import { AutomationConfigPanel, ComplianceConfigPanel, IntegrationConfigPanel } from '../../components/config'

export const SystemSettings = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-bold text-slate-100 mb-4'>Automation Settings</h3>
        <AutomationConfigPanel />
      </div>
      <div>
        <h3 className='text-lg font-bold text-slate-100 mb-4'>Compliance Settings</h3>
        <ComplianceConfigPanel />
      </div>
      <div>
        <h3 className='text-lg font-bold text-slate-100 mb-4'>Integrations</h3>
        <IntegrationConfigPanel />
      </div>
    </div>
  )
}

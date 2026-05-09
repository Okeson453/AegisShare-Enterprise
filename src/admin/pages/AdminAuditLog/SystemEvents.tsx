import { SystemEventLog } from '../../components/auditlog'

export const SystemEvents = () => {
  return (
    <div>
      <h3 className='text-lg font-bold text-slate-100 mb-4'>System Event Log</h3>
      <SystemEventLog />
    </div>
  )
}

import type { Incident } from '@/admin/types'

interface Props {
  incident: Incident
}

export const IncidentTimeline = ({ incident }: Props) => {
  return (
    <div className='space-y-4'>
      <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30'>
        <div className='flex gap-4'>
          <div className='w-2 h-2 rounded-full bg-amber-500 mt-2' />
          <div>
            <p className='font-bold text-slate-200'>Incident Created</p>
            <p className='text-sm text-slate-400'>{new Date(incident.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {incident.acknowledgedAt && (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30'>
          <div className='flex gap-4'>
            <div className='w-2 h-2 rounded-full bg-yellow-500 mt-2' />
            <div>
              <p className='font-bold text-slate-200'>Acknowledged</p>
              <p className='text-sm text-slate-400'>{new Date(incident.acknowledgedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {incident.resolvedAt && (
        <div className='p-4 rounded border border-slate-700/50 bg-slate-900/30'>
          <div className='flex gap-4'>
            <div className='w-2 h-2 rounded-full bg-green-500 mt-2' />
            <div>
              <p className='font-bold text-slate-200'>Resolved</p>
              <p className='text-sm text-slate-400'>{new Date(incident.resolvedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

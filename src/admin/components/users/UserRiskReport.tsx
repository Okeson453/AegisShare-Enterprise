export const UserRiskReport = () => {
  const risks = [
    { level: 'High', count: 2, description: 'Users with unused MFA or no recent login' },
    { level: 'Medium', count: 5, description: 'Users with only L1 clearance but widespread access' },
    { level: 'Low', count: 12, description: 'Users with inactive or deprecated roles' },
  ]

  return (
    <div className='space-y-3'>
      {risks.map(risk => (
        <div key={risk.level} className='p-4 rounded border border-slate-700/50 bg-slate-900/30'>
          <div className='flex justify-between items-start mb-2'>
            <p className='font-bold text-slate-200'>{risk.level} Risk</p>
            <span className='px-3 py-1 text-lg font-bold bg-slate-800 text-slate-300 rounded'>
              {risk.count}
            </span>
          </div>
          <p className='text-sm text-slate-400'>{risk.description}</p>
        </div>
      ))}
    </div>
  )
}

import { AdminUserList } from '../../components/users'

export const AdminUsers = () => {
  return (
    <div>
      <h3 className='text-lg font-bold text-slate-100 mb-4'>Admin Users</h3>
      <AdminUserList
        users={[
          { id: 'user-001', email: 'alice@aegis.com', name: 'Alice Admin', role: 'admin', clearanceLevel: 'L5', active: true, mfaEnabled: true, ipWhitelist: ['192.168.1.0/24'], restrictions: [], auditedAt: '2026-04-06T14:00:00Z' },
          { id: 'user-002', email: 'bob@aegis.com', name: 'Bob Security', role: 'security', clearanceLevel: 'L4', active: true, mfaEnabled: true, ipWhitelist: [], restrictions: [], auditedAt: '2026-04-06T13:00:00Z' },
          { id: 'user-003', email: 'charlie@aegis.com', name: 'Charlie Compliance', role: 'compliance', clearanceLevel: 'L3', active: true, mfaEnabled: false, ipWhitelist: [], restrictions: [], auditedAt: '2026-04-05T12:00:00Z' },
          { id: 'user-004', email: 'diana@aegis.com', name: 'Diana DevOps', role: 'devops', clearanceLevel: 'L2', active: false, mfaEnabled: false, ipWhitelist: [], restrictions: [], auditedAt: '2026-04-04T10:00:00Z' },
        ]}
      />
    </div>
  )
}

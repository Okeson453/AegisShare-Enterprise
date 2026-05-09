import { useAdminUsers } from '@/admin/hooks'
import { AdminUserRow } from '@/admin/components/users/AdminUserRow'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'
import { useState } from 'react'

export const UserManagementPage = () => {
    const { users } = useAdminUsers()
    const [searchTerm, setSearchTerm] = useState('')

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminPageWrapper title='User Management' subtitle='Provision and manage system users'>
            <div className='s12-stack-md'>
                <div className='s12-row-md s12-gap-md'>
                    <input
                        type='text'
                        placeholder='Search users...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='s12-input s12-flex-1'
                    />
                    <button className='s12-btn s12-btn-primary'>
                        + Provision
                    </button>
                </div>

                <div className='s12-stack-sm'>
                    {filtered.map((user) => (
                        <AdminUserRow key={user.id} user={user} />
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className='s12-section s12-text-center s12-text-muted'>
                        No users found
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    )
}

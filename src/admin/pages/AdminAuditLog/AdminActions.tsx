import { AdminAuditTable, AdminAuditExport } from '../../components/auditlog'

export const AdminActions = () => {
    return (
        <div className='space-y-4'>
            <AdminAuditExport />
            <h3 className='text-lg font-bold text-slate-100'>Admin Action Log</h3>
            <AdminAuditTable />
        </div>
    )
}

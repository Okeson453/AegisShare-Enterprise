import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'

interface Region {
    id: string
    name: string
    tier: 'premium' | 'standard'
    dataClassifications: string[]
    compliance: string[]
    status: 'active' | 'inactive'
}

interface ErasureRequest {
    id: string
    requestedBy: string
    reason: string
    dataScope: string
    status: 'pending' | 'approved' | 'rejected' | 'completed'
    createdAt: string
    completedAt?: string
}

interface TransferLog {
    id: string
    fromRegion: string
    toRegion: string
    dataClassification: string
    status: 'pending' | 'completed' | 'failed'
    initiatedBy: string
    initiatedAt: string
}

// Mock data
const MOCK_REGIONS: Region[] = [
    {
        id: 'us-east',
        name: 'US East Coast',
        tier: 'premium',
        dataClassifications: ['public', 'internal'],
        compliance: ['HIPAA', 'SOC2 Type II'],
        status: 'active',
    },
    {
        id: 'eu-west',
        name: 'EU West (Ireland)',
        tier: 'premium',
        dataClassifications: ['public', 'internal', 'pii'],
        compliance: ['GDPR', 'SOC2 Type II'],
        status: 'active',
    },
    {
        id: 'ap-south',
        name: 'Asia Pacific (Singapore)',
        tier: 'standard',
        dataClassifications: ['public'],
        compliance: ['PDPA'],
        status: 'active',
    },
]

const MOCK_ERASURE_REQUESTS: ErasureRequest[] = [
    {
        id: 'erase-001',
        requestedBy: 'user@company.com',
        reason: 'User right to be forgotten (GDPR)',
        dataScope: 'User ID: 12345 from all regions',
        status: 'pending',
        createdAt: '2026-04-06T10:30:00Z',
    },
    {
        id: 'erase-002',
        requestedBy: 'compliance@company.com',
        reason: 'Data retention policy - 7 year archive',
        dataScope: 'All logs from 2019-2020',
        status: 'approved',
        createdAt: '2026-04-05T14:00:00Z',
    },
]

const MOCK_TRANSFER_LOG: TransferLog[] = [
    {
        id: 'xfer-001',
        fromRegion: 'us-east',
        toRegion: 'eu-west',
        dataClassification: 'internal',
        status: 'completed',
        initiatedBy: 'admin@company.com',
        initiatedAt: '2026-04-06T09:00:00Z',
    },
    {
        id: 'xfer-002',
        fromRegion: 'eu-west',
        toRegion: 'ap-south',
        dataClassification: 'public',
        status: 'pending',
        initiatedBy: 'ops@company.com',
        initiatedAt: '2026-04-06T11:30:00Z',
    },
]

const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
        active: 's12-success-state',
        inactive: 's12-error-state',
        pending: 's12-warning-state',
        approved: 's12-info-state',
        rejected: 's12-error-state',
        completed: 's12-success-state',
        failed: 's12-error-state',
    }
    return colors[status] || 's12-badge-muted'
}

export const DataSovereignty = () => {
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
    const [erasureFilter, setErasureFilter] = useState<'all' | 'pending' | 'approved' | 'completed'>('all')

    const filteredRequests = erasureFilter === 'all'
        ? MOCK_ERASURE_REQUESTS
        : MOCK_ERASURE_REQUESTS.filter(r => r.status === erasureFilter)

    return (
        <AdminPageWrapper title='Data Sovereignty' subtitle='Manage regional data residency and erasure requests'>
            <div className='s12-stack-lg'>

            {/* Regions Grid */}
            <div className='s12-stack-md'>
                <h2 className='s12-text-xl s12-font-bold s12-text-emphasis'>Data Regions</h2>
                <div className='bento'>
                    {MOCK_REGIONS.map(region => (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                            className={cn(
                                'bento-4 s12-section s12-cursor-pointer s12-text-left s12-transition-all s12-flex s12-flex-col s12-gap-3',
                                selectedRegion === region.id
                                    ? 's12-border-warning'
                                    : 's12-opacity-80 hover:s12-opacity-100'
                            )}
                        >
                            <div className='s12-flex s12-items-start s12-justify-between'>
                                <div>
                                    <h3 className='s12-font-bold s12-text-emphasis'>{region.name}</h3>
                                    <p className='s12-text-xs s12-text-muted s12-mt-1'>Region ID: {region.id}</p>
                                </div>
                                <div className={cn('s12-px-2 s12-py-1 s12-rounded s12-border s12-text-xs s12-font-bold', getStatusColor(region.status))}>
                                    {region.status.toUpperCase()}
                                </div>
                            </div>

                            {selectedRegion === region.id && (
                                <div className='s12-stack-sm s12-mt-4 s12-pt-4 s12-border-t s12-border-accent'>
                                    <div>
                                        <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-2'>TIER</p>
                                        <p className='s12-text-sm s12-text-emphasis s12-capitalize'>{region.tier}</p>
                                    </div>
                                    <div>
                                        <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-2'>DATA CLASSIFICATIONS</p>
                                        <div className='s12-flex s12-flex-wrap s12-gap-2'>
                                            {region.dataClassifications.map(dc => (
                                                <span key={dc} className='s12-px-2 s12-py-1 s12-badge-default s12-text-xs'>
                                                    {dc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-2'>COMPLIANCE</p>
                                        <div className='s12-flex s12-flex-wrap s12-gap-2'>
                                            {region.compliance.map(comp => (
                                                <span key={comp} className='s12-px-2 s12-py-1 s12-badge-success s12-text-xs'>
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Erasure Requests */}
            <div className='s12-stack-md'>
                <div className='s12-flex s12-items-center s12-justify-between'>
                    <h2 className='s12-text-xl s12-font-bold s12-text-emphasis'>Data Erasure Requests</h2>
                    <select
                        aria-label='Filter erasure requests by status'
                        value={erasureFilter}
                        onChange={e => setErasureFilter(e.target.value as typeof erasureFilter)}
                        className='s12-input s12-px-3 s12-py-1 s12-text-sm'
                    >
                        <option value='all'>All Requests</option>
                        <option value='pending'>Pending</option>
                        <option value='approved'>Approved</option>
                        <option value='completed'>Completed</option>
                    </select>
                </div>

                <div className='s12-stack-sm'>
                    {filteredRequests.length === 0 ? (
                        <div className='s12-text-center s12-py-8 s12-text-muted'>
                            No erasure requests found
                        </div>
                    ) : (
                        filteredRequests.map(request => (
                            <div
                                key={request.id}
                                className='s12-section s12-stack-md s12-transition-colors'
                            >
                                <div className='s12-flex s12-items-start s12-justify-between'>
                                    <div>
                                        <p className='s12-font-bold s12-text-emphasis'>{request.reason}</p>
                                        <p className='s12-text-xs s12-text-muted s12-mt-1'>Request ID: {request.id}</p>
                                    </div>
                                    <div className={cn('s12-px-2 s12-py-1 s12-rounded s12-border s12-text-xs s12-font-bold', getStatusColor(request.status))}>
                                        {request.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className='bento bento-2'>
                                    <div>
                                        <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-1'>DATA SCOPE</p>
                                        <p className='s12-text-emphasis'>{request.dataScope}</p>
                                    </div>
                                    <div>
                                        <p className='s12-text-xs s12-font-bold s12-text-muted s12-mb-1'>REQUESTED BY</p>
                                        <p className='s12-text-emphasis'>{request.requestedBy}</p>
                                    </div>
                                </div>

                                <div className='s12-flex s12-items-center s12-justify-between s12-mt-3 s12-pt-3 s12-border-t s12-border-accent'>
                                    <p className='s12-text-xs s12-text-muted'>
                                        Created: {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                    {request.status === 'pending' && (
                                        <div className='s12-flex s12-gap-2'>
                                            <button className='s12-btn s12-btn-success s12-px-3 s12-py-1 s12-text-xs s12-font-bold'>
                                                Approve
                                            </button>
                                            <button className='s12-btn s12-btn-danger s12-px-3 s12-py-1 s12-text-xs s12-font-bold'>
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Data Transfer Log */}
            <div className='s12-stack-md'>
                <h2 className='s12-text-xl s12-font-bold s12-text-emphasis'>Data Transfer Log</h2>

                <div className='s12-overflow-x-auto s12-rounded-lg s12-border s12-border-accent'>
                    <table className='s12-w-full s12-text-sm'>
                        <thead>
                            <tr className='s12-border-b s12-border-accent s12-bg-slate-900/50'>
                                <th className='s12-px-4 s12-py-3 s12-text-left s12-font-bold s12-text-emphasis'>From</th>
                                <th className='s12-px-4 s12-py-3 s12-text-left s12-font-bold s12-text-emphasis'>To</th>
                                <th className='s12-px-4 s12-py-3 s12-text-left s12-font-bold s12-text-emphasis'>Data Class</th>
                                <th className='s12-px-4 s12-py-3 s12-text-left s12-font-bold s12-text-emphasis'>Status</th>
                                <th className='s12-px-4 s12-py-3 s12-text-left s12-font-bold s12-text-emphasis'>Initiated By</th>
                                <th className='s12-px-4 s12-py-3 s12-text-left s12-font-bold s12-text-emphasis'>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TRANSFER_LOG.map(log => (
                                <tr key={log.id} className='s12-border-b s12-border-accent s12-hover:bg-slate-800/30'>
                                    <td className='s12-px-4 s12-py-3 s12-text-emphasis'>{log.fromRegion}</td>
                                    <td className='s12-px-4 s12-py-3 s12-text-emphasis'>{log.toRegion}</td>
                                    <td className='s12-px-4 s12-py-3 s12-text-emphasis s12-capitalize'>{log.dataClassification}</td>
                                    <td className='s12-px-4 s12-py-3'>
                                        <span className={cn('s12-px-2 s12-py-1 s12-rounded s12-border s12-text-xs s12-font-bold', getStatusColor(log.status))}>
                                            {log.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className='s12-px-4 s12-py-3 s12-text-emphasis'>{log.initiatedBy}</td>
                                    <td className='s12-px-4 s12-py-3 s12-text-muted s12-text-xs'>
                                        {new Date(log.initiatedAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        </AdminPageWrapper>
    )
}

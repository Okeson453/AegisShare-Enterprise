import { useAdminOverview } from '@/admin/hooks'
import { ServiceCard } from '@/admin/components/services/ServiceCard'
import { getStatusColor } from '@/admin/utils'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'
import type { ServiceHealth } from '@/admin/types'

export const Overview = () => {
    const { systemHealth } = useAdminOverview()

    if (!systemHealth) {
        return <div className='s12-text-base s12-text-center s12-text-muted s12-p-6'>Loading system health...</div>
    }

    const healthColor = getStatusColor(systemHealth.overallStatus)

    return (
        <AdminPageWrapper title='System Overview' subtitle='Monitor system health and metrics'>
            <div className='s12-stack-lg'>
                <div className='bento'>
                    <div className='bento-2 s12-stat-card'>
                        <div className='s12-stat-label'>Overall Status</div>
                        <div className={`s12-stat-value ${healthColor.text}`}>{systemHealth.overallStatus.toUpperCase()}</div>
                    </div>
                    <div className='bento-2 s12-stat-card'>
                        <div className='s12-stat-label'>CPU Usage</div>
                        <div className='s12-stat-value'>{systemHealth.cpuUsage.toFixed(1)}%</div>
                    </div>
                    <div className='bento-2 s12-stat-card'>
                        <div className='s12-stat-label'>Memory Usage</div>
                        <div className='s12-stat-value'>{systemHealth.memoryUsage.toFixed(1)}%</div>
                    </div>
                    <div className='bento-2 s12-stat-card'>
                        <div className='s12-stat-label'>Disk Usage</div>
                        <div className='s12-stat-value'>{systemHealth.diskUsage.toFixed(1)}%</div>
                    </div>
                    <div className='bento-2 s12-stat-card'>
                        <div className='s12-stat-label'>Active Connections</div>
                        <div className='s12-stat-value'>{systemHealth.activeConnections}</div>
                    </div>
                </div>

                <div className='s12-section'>
                    <h3 className='s12-text-sm s12-font-bold s12-text-emphasis s12-mb-4'>Service Status</h3>
                    <div className='bento'>
                        {systemHealth.services.map((service) => (
                            <div key={service.id} className='bento-2'>
                                <ServiceCard service={service} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className='s12-text-xs s12-text-subtle'>
                    Last updated: {new Date(systemHealth.timestamp).toLocaleTimeString()}
                </div>
            </div>
        </AdminPageWrapper>
    )
}

import { useServiceHealth } from '@/admin/hooks'
import { ServiceCard } from '@/admin/components/services/ServiceCard'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'
import { useEffect } from 'react'
import type { ServiceHealth } from '@/admin/types'

export const ServiceHealthPage = () => {
    const { services, setPolling } = useServiceHealth()

    useEffect(() => {
        setPolling(true)
        return () => setPolling(false)
    }, [setPolling])

    return (
        <AdminPageWrapper title='Service Health' subtitle='Monitor service status and performance'>
            <div className='s12-stack-md'>
                <div className='s12-row-md s12-justify-between'>
                    <h2 className='s12-text-lg s12-font-bold s12-text-emphasis'>Service Health Monitor</h2>
                    <span className='s12-text-xs s12-text-muted'>Polling every 10s</span>
                </div>

                <div className='bento'>
                    {services.map((service) => (
                        <div key={service.id} className='bento-2'>
                            <ServiceCard service={service} />
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className='s12-section s12-text-center s12-text-muted'>
                        No services available
                    </div>
                )}
            </div>
        </AdminPageWrapper>
    )
}

import { ServiceHealthGrid, ResourceUsageChart, DependencyStatus } from '../../components/services'

export const SystemDashboard = () => {
    return (
        <div className='space-y-6'>
            <div>
                <h3 className='text-lg font-bold text-slate-100 mb-4'>System Health</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <ResourceUsageChart />
                    <DependencyStatus />
                </div>
            </div>

            <div>
                <h3 className='text-lg font-bold text-slate-100 mb-4'>Services</h3>
                <ServiceHealthGrid services={[
                    { id: 'svc-001', name: 'API Server', status: 'healthy', version: '4.2.1', lastRestartAt: '2026-03-15T08:00:00Z', replicas: { running: 3, total: 3 }, metrics: { latencyP50Ms: 45, latencyP99Ms: 120, cpuPercent: 25, memoryMb: 512, uptimePercent: 99.95, requestsPerMin: 75000 }, uptime: 0.9995, latency: 45, errorRate: 0.0001, throughput: 1250, lastChecked: '2026-04-06T14:32:00Z' },
                    { id: 'svc-002', name: 'Auth Service', status: 'healthy', version: '2.1.0', lastRestartAt: '2026-03-20T10:00:00Z', replicas: { running: 2, total: 2 }, metrics: { latencyP50Ms: 32, latencyP99Ms: 85, cpuPercent: 15, memoryMb: 256, uptimePercent: 99.98, requestsPerMin: 50000 }, uptime: 0.9998, latency: 32, errorRate: 0.00005, throughput: 850, lastChecked: '2026-04-06T14:32:00Z' },
                    { id: 'svc-003', name: 'Database', status: 'degraded', version: '14.2', lastRestartAt: '2026-02-01T03:00:00Z', replicas: { running: 1, total: 1 }, metrics: { latencyP50Ms: 120, latencyP99Ms: 500, cpuPercent: 75, memoryMb: 2048, uptimePercent: 99.5, requestsPerMin: 30000 }, uptime: 0.995, latency: 120, errorRate: 0.05, throughput: 650, lastChecked: '2026-04-06T14:32:00Z' },
                ]} />
            </div>
        </div>
    )
}

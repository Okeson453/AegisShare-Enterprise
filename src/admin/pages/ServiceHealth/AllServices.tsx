import { ServiceMetricsTable } from '../../components/services'

export const AllServices = () => {
    const services = [
        { id: 'svc-001', name: 'API Server', status: 'healthy' as const, version: '4.2.1', lastRestartAt: '2026-03-15T08:00:00Z', replicas: { running: 3, total: 3 }, metrics: { latencyP50Ms: 45, latencyP99Ms: 120, cpuPercent: 25, memoryMb: 512, uptimePercent: 99.95, requestsPerMin: 75000 }, uptime: 0.9995, latency: 45, errorRate: 0.0001, throughput: 1250, lastChecked: '2026-04-06T14:32:00Z' },
        { id: 'svc-002', name: 'Auth Service', status: 'healthy' as const, version: '2.1.0', lastRestartAt: '2026-03-20T10:00:00Z', replicas: { running: 2, total: 2 }, metrics: { latencyP50Ms: 32, latencyP99Ms: 85, cpuPercent: 15, memoryMb: 256, uptimePercent: 99.98, requestsPerMin: 50000 }, uptime: 0.9998, latency: 32, errorRate: 0.00005, throughput: 850, lastChecked: '2026-04-06T14:32:00Z' },
        { id: 'svc-003', name: 'Payment Service', status: 'healthy' as const, version: '1.5.0', lastRestartAt: '2026-03-10T12:00:00Z', replicas: { running: 2, total: 2 }, metrics: { latencyP50Ms: 78, latencyP99Ms: 200, cpuPercent: 30, memoryMb: 768, uptimePercent: 99.92, requestsPerMin: 16000 }, uptime: 0.9992, latency: 78, errorRate: 0.02, throughput: 320, lastChecked: '2026-04-06T14:32:00Z' },
        { id: 'svc-004', name: 'Database', status: 'degraded' as const, version: '14.2', lastRestartAt: '2026-02-01T03:00:00Z', replicas: { running: 1, total: 1 }, metrics: { latencyP50Ms: 120, latencyP99Ms: 500, cpuPercent: 75, memoryMb: 2048, uptimePercent: 99.5, requestsPerMin: 30000 }, uptime: 0.995, latency: 120, errorRate: 0.05, throughput: 650, lastChecked: '2026-04-06T14:32:00Z' },
        { id: 'svc-005', name: 'Cache Layer', status: 'healthy' as const, version: '6.2', lastRestartAt: '2026-03-25T16:00:00Z', replicas: { running: 3, total: 3 }, metrics: { latencyP50Ms: 5, latencyP99Ms: 15, cpuPercent: 10, memoryMb: 256, uptimePercent: 99.99, requestsPerMin: 250000 }, uptime: 0.9999, latency: 5, errorRate: 0, throughput: 5000, lastChecked: '2026-04-06T14:32:00Z' },
    ]

    return (
        <div>
            <h3 className='text-lg font-bold text-slate-100 mb-4'>All Services</h3>
            <ServiceMetricsTable services={services} />
        </div>
    )
}

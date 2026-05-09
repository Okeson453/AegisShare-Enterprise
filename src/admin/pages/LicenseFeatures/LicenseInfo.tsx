import { LicenseOverview, SeatUsageMeter, UsageAnalyticsChart } from '../../components/license'

export const LicenseInfo = () => {
    return (
        <div className='space-y-6'>
            <LicenseOverview />
            <SeatUsageMeter />
            <UsageAnalyticsChart />
        </div>
    )
}

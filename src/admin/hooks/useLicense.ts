import { useEffect, useState } from 'react'
import { licenseService } from '@/admin/services'
import type { License, FeatureFlag, UsageAnalytics } from '@/admin/types'

export const useLicense = () => {
    const [license, setLicense] = useState<License | null>(null)
    const [features, setFeatures] = useState<FeatureFlag[]>([])
    const [analytics, setAnalytics] = useState<UsageAnalytics[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                const [lic, feat, anal] = await Promise.all([
                    licenseService.getLicense(),
                    licenseService.listFeatureFlags(),
                    licenseService.getUsageAnalytics(30),
                ])
                setLicense(lic)
                setFeatures(feat)
                setAnalytics(anal)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch license data')
            } finally {
                setLoading(false)
            }
        }

        fetch()
    }, [])

    const toggleFeature = async (id: string, enabled: boolean) => {
        try {
            await licenseService.toggleFeatureFlag(id, enabled)
            const updated = await licenseService.listFeatureFlags()
            setFeatures(updated)
        } catch (err) {
            throw err
        }
    }

    return { license, features, analytics, loading, error, toggleFeature }
}

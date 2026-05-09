import { FeatureFlagItem } from './FeatureFlagItem'

export const FeatureFlagGrid = () => {
    const features = [
        { name: 'Advanced Audit', enabled: true },
        { name: 'Custom Roles', enabled: true },
        { name: 'Data Sovereignty', enabled: true },
        { name: 'Backup & Recovery', enabled: true },
        { name: 'Multi-Region', enabled: true },
        { name: 'API Access', enabled: true },
        { name: 'SSO Integration', enabled: true },
        { name: 'MFA Enforcement', enabled: true },
        { name: 'Compliance Reports', enabled: true },
        { name: 'Custom Branding', enabled: false },
        { name: 'On-Premise Deploy', enabled: false },
        { name: 'Custom Integration', enabled: false },
    ]

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {features.map((feature, idx) => (
                <FeatureFlagItem key={idx} name={feature.name} enabled={feature.enabled} />
            ))}
        </div>
    )
}

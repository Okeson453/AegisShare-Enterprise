import { useLicense } from '@/admin/hooks'
import { AdminPageWrapper } from '@/admin/AdminPageWrapper'

export const LicenseFeatures = () => {
    const { license, features } = useLicense()

    return (
        <AdminPageWrapper title='License & Features' subtitle='Manage license information and feature flags'>
            <div className='s12-stack-lg'>
                {license && (
                    <div className='s12-section s12-stack-md'>
                        <h3 className='s12-text-sm s12-font-bold s12-text-emphasis s12-mb-4'>License Information</h3>
                        <div className='bento'>
                            <div className='bento-3 s12-stat-card'>
                                <div className='s12-text-xs s12-text-muted s12-mb-1'>Tier</div>
                                <div className='s12-text-xl s12-font-bold s12-text-emphasis s12-uppercase'>{license.tier}</div>
                            </div>
                            <div className='bento-3 s12-stat-card'>
                                <div className='s12-text-xs s12-text-muted s12-mb-1'>Seats</div>
                                <div className='s12-text-xl s12-font-bold s12-text-emphasis'>{license.quotaSeats}</div>
                            </div>
                            <div className='bento-3 s12-stat-card'>
                                <div className='s12-text-xs s12-text-muted s12-mb-1'>Expires</div>
                                <div className='s12-text-sm s12-font-bold s12-text-emphasis'>{new Date(license.expiryDate).toLocaleDateString()}</div>
                            </div>
                            <div className='bento-3 s12-stat-card'>
                                <div className='s12-text-xs s12-text-muted s12-mb-1'>Auto Renew</div>
                                <div className='s12-text-xl s12-font-bold s12-text-emphasis'>{license.autoRenew ? 'Yes' : 'No'}</div>
                            </div>
                        </div>
                    </div>
                )}

                <div className='s12-section s12-stack-md'>
                    <h3 className='s12-text-sm s12-font-bold s12-text-emphasis s12-mb-4'>Feature Flags</h3>
                    <div className='s12-stack-sm'>
                        {features.map((flag) => (
                            <div key={flag.id} className='s12-row-md s12-items-center s12-justify-between s12-p-3 s12-border s12-border-accent s12-rounded-lg s12-backdrop-blur'>
                                <div>
                                    <div className='s12-text-sm s12-text-emphasis'>{flag.name}</div>
                                    <div className='s12-text-xs s12-text-muted'>{flag.description}</div>
                                </div>
                                <label className='s12-flex s12-items-center s12-gap-2 s12-cursor-pointer'>
                                    <input type='checkbox' checked={flag.isEnabled} readOnly className='s12-w-4 s12-h-4' />
                                    <span className='s12-text-xs s12-text-muted'>{flag.isEnabled ? 'Enabled' : 'Disabled'}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminPageWrapper>
    )
}

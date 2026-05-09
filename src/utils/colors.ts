export function getSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
        critical: '#F43F5E',
        high: '#F59E0B',
        medium: '#22D3EE',
        low: '#10B981',
        info: '#A78BFA',
    }
    return colors[severity.toLowerCase()] || '#8BA4C2'
}

export function getRiskColor(level: string): string {
    const colors: Record<string, string> = {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#F43F5E',
        critical: '#DC2626',
    }
    return colors[level.toLowerCase()] || '#8BA4C2'
}

export function getEventTypeColor(type: string): string {
    const colors: Record<string, string> = {
        FILE_UPLOAD: '#22D3EE',
        FILE_DELETE: '#F43F5E',
        FILE_SHARE: '#10B981',
        KEY_ROTATION: '#A78BFA',
        POLICY_UPDATE: '#F59E0B',
        USER_LOGIN: '#10B981',
        USER_LOGOUT: '#F59E0B',
        ACCESS_DENIED: '#F43F5E',
    }
    return colors[type] || '#8BA4C2'
}

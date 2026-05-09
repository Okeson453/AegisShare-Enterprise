
import KeyManagement from '@/components/pages/KeyManagement'
import '../../styles/key-management.css'

interface KeyNode {
    id: string
    name: string
    type: 'root' | 'kek' | 'dek'
    status: 'healthy' | 'expiring' | 'compromised'
    expiresAt: string
    algorithm: string
    keyLength: number
    usage: string
    operationsCount: number
    usagePercent?: number
    wrappedBy?: string
}

interface HSMNode {
    id: string
    name: string
    region: string
    status: 'active' | 'standby' | 'degraded'
    load: number
    latency: number
    temperature: number
    health: number
}

interface RotationEvent {
    id: string
    keyId: string
    keyName: string
    scheduledDate: string
    daysUntil: number
    priority: 'critical' | 'high' | 'medium' | 'low'
    completionPercent: number
}

// Mock data for keys
const mockKeys: KeyNode[] = [
    {
        id: 'root-01',
        name: 'Master Root Key',
        type: 'root',
        status: 'healthy',
        expiresAt: '2026-12-20',
        algorithm: 'RSA-4096',
        keyLength: 4096,
        usage: 'Root Authority',
        operationsCount: 847000,
        usagePercent: 12,
        wrappedBy: undefined,
    },
    {
        id: 'kek-prod-01',
        name: 'Production KEK',
        type: 'kek',
        status: 'healthy',
        expiresAt: '2025-06-15',
        algorithm: 'RSA-2048',
        keyLength: 2048,
        usage: 'Production DEK Wrapping',
        operationsCount: 523000,
        usagePercent: 34,
        wrappedBy: 'root-01',
    },
    {
        id: 'kek-staging-01',
        name: 'Staging KEK',
        type: 'kek',
        status: 'healthy',
        expiresAt: '2025-08-20',
        algorithm: 'RSA-2048',
        keyLength: 2048,
        usage: 'Staging DEK Wrapping',
        operationsCount: 89000,
        usagePercent: 8,
        wrappedBy: 'root-01',
    },
    {
        id: 'dek-vault-01',
        name: 'Vault Encryption DEK',
        type: 'dek',
        status: 'healthy',
        expiresAt: '2024-10-20',
        algorithm: 'AES-256',
        keyLength: 256,
        usage: 'File Encryption',
        operationsCount: 1200000,
        usagePercent: 78,
        wrappedBy: 'kek-prod-01',
    },
    {
        id: 'dek-share-01',
        name: 'Sharing DEK',
        type: 'dek',
        status: 'expiring',
        expiresAt: '2024-04-15',
        algorithm: 'AES-256',
        keyLength: 256,
        usage: 'Share Token Encryption',
        operationsCount: 450000,
        usagePercent: 92,
        wrappedBy: 'kek-prod-01',
    },
    {
        id: 'dek-audit-01',
        name: 'Audit Trail DEK',
        type: 'dek',
        status: 'healthy',
        expiresAt: '2025-02-10',
        algorithm: 'AES-256',
        keyLength: 256,
        usage: 'Log Encryption',
        operationsCount: 2100000,
        usagePercent: 45,
        wrappedBy: 'kek-prod-01',
    },
]

// Mock data for HSMs
const mockHSMs: HSMNode[] = [
    {
        id: 'hsm-prod-01',
        name: 'HSM-PROD-01',
        region: 'us-east-1',
        status: 'active',
        load: 45,
        latency: 2.3,
        temperature: 38,
        health: 98,
    },
    {
        id: 'hsm-prod-02',
        name: 'HSM-PROD-02',
        region: 'us-east-1',
        status: 'active',
        load: 48,
        latency: 2.5,
        temperature: 41,
        health: 97,
    },
    {
        id: 'hsm-dr-01',
        name: 'HSM-DR-01',
        region: 'eu-west-1',
        status: 'standby',
        load: 12,
        latency: 125.8,
        temperature: 35,
        health: 96,
    },
]

// Mock data for rotations
const mockRotations: RotationEvent[] = [
    {
        id: 'rot-1',
        keyId: 'dek-share-01',
        keyName: 'Sharing DEK',
        scheduledDate: '2024-02-05',
        daysUntil: -5,
        priority: 'critical',
        completionPercent: 100,
    },
    {
        id: 'rot-2',
        keyId: 'dek-vault-01',
        keyName: 'Vault Encryption DEK',
        scheduledDate: '2024-02-10',
        daysUntil: 0,
        priority: 'high',
        completionPercent: 65,
    },
    {
        id: 'rot-3',
        keyId: 'dek-audit-01',
        keyName: 'Audit Trail DEK',
        scheduledDate: '2024-02-15',
        daysUntil: 5,
        priority: 'high',
        completionPercent: 0,
    },
    {
        id: 'rot-4',
        keyId: 'kek-prod-01',
        keyName: 'Production KEK',
        scheduledDate: '2024-03-01',
        daysUntil: 21,
        priority: 'medium',
        completionPercent: 0,
    },
    {
        id: 'rot-5',
        keyId: 'kek-staging-01',
        keyName: 'Staging KEK',
        scheduledDate: '2024-03-15',
        daysUntil: 35,
        priority: 'low',
        completionPercent: 0,
    },
]

export default function KeyManagementPage() {
    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Cryptographic Operations Center</h1>
                <p className="page-subtitle">
                    Hierarchical key management, HSM topology visualization, and rotation scheduling
                </p>
            </div>

            <KeyManagement />
        </div>
    )
}

import React, { useState, useMemo } from 'react'
import AuditLedger from '@/components/pages/AuditLedger'
import '../../styles/audit-ledger.css'

interface MerkleNode {
    id: string
    hash: string
    status: 'verified' | 'pending' | 'rejected'
    timestamp: string
    children?: string[]
}

interface AuditEntry {
    id: string
    action: string
    actor: string
    resource: string
    status: 'success' | 'pending' | 'warning' | 'failed'
    timestamp: string
    type: 'access' | 'system'
    details?: string
}

const generateHash = (input: string): string => {
    let hash = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'.slice(0, 16)
    return hash
}

// Merkle chain mock data
const mockMerkleChain: MerkleNode[] = [
    {
        id: 'node-0',
        hash: '00000000000000000000000000000000',
        status: 'verified',
        timestamp: '2024-01-20T08:00:00Z',
    },
    {
        id: 'node-1',
        hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        status: 'verified',
        timestamp: '2024-01-20T08:15:00Z',
    },
    {
        id: 'node-2',
        hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6a1',
        status: 'verified',
        timestamp: '2024-01-20T08:30:00Z',
    },
    {
        id: 'node-3',
        hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6a1b2',
        status: 'pending',
        timestamp: '2024-01-20T08:45:00Z',
    },
    {
        id: 'node-4',
        hash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6a1b2c3',
        status: 'pending',
        timestamp: '2024-01-20T09:00:00Z',
    },
    {
        id: 'node-5',
        hash: 'e5f6g7h8i9j0k1l2m3n4o5p6a1b2c3d4',
        status: 'rejected',
        timestamp: '2024-01-20T09:15:00Z',
    },
]

// Audit entries mock data
const mockAuditEntries: AuditEntry[] = [
    {
        id: 'entry-1',
        action: 'Document Upload',
        actor: 'admin@company.com',
        resource: 'financial_report_2024.pdf',
        status: 'success',
        timestamp: '2024-01-20T08:00:00Z',
        type: 'access',
        details: JSON.stringify({ size: 2400000, mimeType: 'application/pdf' }),
    },
    {
        id: 'entry-2',
        action: 'Access Granted',
        actor: 'admin@company.com',
        resource: 'financial_report_2024.pdf',
        status: 'success',
        timestamp: '2024-01-20T08:15:00Z',
        type: 'access',
        details: JSON.stringify({ recipients: 3, duration: '30d' }),
    },
    {
        id: 'entry-3',
        action: 'Key Rotation',
        actor: 'system',
        resource: 'dek-vault-01',
        status: 'success',
        timestamp: '2024-01-20T08:30:00Z',
        type: 'system',
        details: JSON.stringify({ algorithm: 'AES-256', oldKeyId: 'key-123' }),
    },
    {
        id: 'entry-4',
        action: 'Compliance Scan',
        actor: 'compliance-service',
        resource: 'soc2-controls',
        status: 'warning',
        timestamp: '2024-01-20T08:45:00Z',
        type: 'system',
        details: JSON.stringify({ findings: 2, critical: 0 }),
    },
    {
        id: 'entry-5',
        action: 'Policy Violation',
        actor: 'analyst@company.com',
        resource: 'restricted_data.xlsx',
        status: 'failed',
        timestamp: '2024-01-20T09:00:00Z',
        type: 'access',
        details: JSON.stringify({ reason: 'Session time limit exceeded', policy: 'SESSION_TIMEOUT' }),
    },
    {
        id: 'entry-6',
        action: 'Audit Export',
        actor: 'security@company.com',
        resource: 'audit_trail_q1.tar.gz',
        status: 'success',
        timestamp: '2024-01-20T09:15:00Z',
        type: 'system',
        details: JSON.stringify({ format: 'CEF', records: 15420 }),
    },
    {
        id: 'entry-7',
        action: 'Field Access',
        actor: 'analyst@company.com',
        resource: 'customer_database',
        status: 'success',
        timestamp: '2024-01-20T09:30:00Z',
        type: 'access',
        details: JSON.stringify({ columns: 12, rows: 45000 }),
    },
    {
        id: 'entry-8',
        action: 'Vault Lock',
        actor: 'security@company.com',
        resource: 'sensitive_vault',
        status: 'success',
        timestamp: '2024-01-20T09:45:00Z',
        type: 'system',
        details: JSON.stringify({ reason: 'Scheduled maintenance', duration: '2h' }),
    },
]

export default function AuditChainPage() {
    const handleExport = (format: string) => {
        console.log(`Exporting as ${format}`)
        // TODO: Implement actual export logic
        const timestamp = new Date().toISOString().split('T')[0]
        const filename = `audit-chain-${timestamp}.${format === 'json' ? 'json' : format === 'cef' ? 'log' : 'txt'}`

        // Create a simple download trigger
        const element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(
            format === 'json'
                ? JSON.stringify({ merkleChain: mockMerkleChain, entries: mockAuditEntries }, null, 2)
                : `Audit Trail Export - ${filename}\nGenerated: ${new Date().toISOString()}\n\n${mockAuditEntries.map(e => `${e.timestamp} | ${e.action} | ${e.actor} | ${e.resource}`).join('\n')}`
        ))
        element.setAttribute('download', filename)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Immutable Records & Audit Trail</h1>
                <p className="page-subtitle">
                    Merkle chain verification, tamper detection, and SIEM export for complete audit compliance
                </p>
            </div>

            <AuditLedger
                merkleChain={mockMerkleChain}
                auditEntries={mockAuditEntries}
                onExport={handleExport}
            />
        </div>
    )
}

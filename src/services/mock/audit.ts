import type { AuditEvent } from '@/types';

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
    {
        id: 'evt_001', seq: 1001, type: 'FILE_UPLOAD', eventType: 'info', actorId: 'user_001', actorName: 'Jane Doe', actor: 'jane_doe@aegis.io', user: 'jane_doe@aegis.io', sourceIp: '192.168.1.100', actorIp: '192.168.1.100', ip: '192.168.1.100', actorGeo: 'Dublin, IE', geo: 'Dublin, IE', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', resourceId: 'file_001', resourceType: 'file', resource: 'Q1-Financial-Report.pdf', action: 'upload', outcome: 'SUCCESS', result: 'SUCCESS', hash: '8a3f9e2b7c...', prevHash: '7f2c1e9a4d...', chainHash: '5b9e2a3f1c...', merkleRoot: 'root_2026', timestamp: '2026-03-15T09:30:00Z', verified: true, risk: 'low', metadata: { size: 2400000 },
    },
    {
        id: 'evt_002', seq: 1002, type: 'FILE_SHARE', eventType: 'info', actorId: 'user_001', actorName: 'Jane Doe', actor: 'jane_doe@aegis.io', user: 'jane_doe@aegis.io', sourceIp: '192.168.1.100', actorIp: '192.168.1.100', ip: '192.168.1.100', actorGeo: 'Dublin, IE', geo: 'Dublin, IE', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', resourceId: 'file_001', resourceType: 'file', resource: 'Q1-Financial-Report.pdf', action: 'share', outcome: 'SUCCESS', result: 'SUCCESS', hash: '9b4f2d1e8c...', prevHash: '8a3f9e2b7c...', chainHash: '6c0f3b4e2d...', merkleRoot: 'root_2026', timestamp: '2026-03-16T10:00:00Z', verified: true, risk: 'low', metadata: { recipientId: 'user_002' },
    },
    {
        id: 'evt_003', seq: 1003, type: 'FILE_SHARE', eventType: 'info', actorId: 'user_002', actorName: 'John Smith', actor: 'john_smith@aegis.io', user: 'john_smith@aegis.io', sourceIp: '203.45.67.89', actorIp: '203.45.67.89', ip: '203.45.67.89', actorGeo: 'London, GB', geo: 'London, GB', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', resourceId: 'file_001', resourceType: 'file', resource: 'Q1-Financial-Report.pdf', action: 'access', outcome: 'SUCCESS', result: 'SUCCESS', hash: '2c5e3a1f9d...', prevHash: '9b4f2d1e8c...', chainHash: '7d1e4c5f3a...', merkleRoot: 'root_2026', timestamp: '2026-03-17T14:22:00Z', verified: true, risk: 'low', metadata: { dekId: 'dek_001' },
    },
    {
        id: 'evt_004', seq: 1004, type: 'POLICY_UPDATE', eventType: 'high', actorId: 'system', actorName: 'System', actor: 'system', user: 'system', sourceIp: '127.0.0.1', actorIp: '127.0.0.1', ip: '127.0.0.1', actorGeo: 'System', geo: 'System', userAgent: 'AegisShare/v4.2', resourceId: 'file_001', resourceType: 'file', resource: 'Q1-Financial-Report.pdf', action: 'policy_eval', outcome: 'SUCCESS', result: 'SUCCESS', hash: '3d6f4b2e0a...', prevHash: '2c5e3a1f9d...', chainHash: '8e2f5d6e4b...', merkleRoot: 'root_2026', timestamp: '2026-03-17T14:25:00Z', verified: true, risk: 'medium', metadata: { policyId: 'pol_fin', decision: 'ALLOW' },
    },
    {
        id: 'evt_005', seq: 1005, type: 'ACCESS_DENIED', eventType: 'critical', actorId: 'user_001', actorName: 'Jane Doe', actor: 'jane_doe@aegis.io', user: 'jane_doe@aegis.io', sourceIp: '192.168.1.100', actorIp: '192.168.1.100', ip: '192.168.1.100', actorGeo: 'Dublin, IE', geo: 'Dublin, IE', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', resourceId: 'user_002', resourceType: 'user', resource: 'user_access', action: 'revoke', outcome: 'SUCCESS', result: 'SUCCESS', hash: '4e7g5c3f1b...', prevHash: '3d6f4b2e0a...', chainHash: '9f3g6e7f5c...', merkleRoot: 'root_2026', timestamp: '2026-03-18T11:15:00Z', verified: true, risk: 'high', metadata: { reason: 'User left team' },
    },
    {
        id: 'evt_006', seq: 1006, type: 'USER_LOGIN', eventType: 'info', actorId: 'user_003', actorName: 'Dr. Williams', actor: 'dr_williams@aegis.io', user: 'dr_williams@aegis.io', sourceIp: '156.78.90.123', actorIp: '156.78.90.123', ip: '156.78.90.123', actorGeo: 'Boston, US', geo: 'Boston, US', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', resourceId: 'user_003', resourceType: 'user', resource: 'user_session', action: 'login', outcome: 'SUCCESS', result: 'SUCCESS', hash: '5f8h6d4g2c...', prevHash: '4e7g5c3f1b...', chainHash: 'ag4h7f8g6d...', merkleRoot: 'root_2026', timestamp: '2026-03-20T12:30:00Z', verified: true, risk: 'low', metadata: { mfaVerified: true },
    },
    {
        id: 'evt_007', seq: 1007, type: 'KEY_ROTATION', eventType: 'high', actorId: 'system', actorName: 'System', actor: 'system', user: 'system', sourceIp: '127.0.0.1', actorIp: '127.0.0.1', ip: '127.0.0.1', actorGeo: 'System', geo: 'System', userAgent: 'AegisShare/v4.2', resourceId: 'dek_001', resourceType: 'key', resource: 'dek_rotation', action: 'rotate', outcome: 'SUCCESS', result: 'SUCCESS', hash: '6g9i7e5h3d...', prevHash: '5f8h6d4g2c...', chainHash: 'bh5i8g9h7e...', merkleRoot: 'root_2026', timestamp: '2026-03-20T13:00:00Z', verified: true, risk: 'medium', metadata: { keyType: 'DEK', reason: 'scheduled' },
    },
    {
        id: 'evt_008', seq: 1008, type: 'FILE_DELETE', eventType: 'critical', actorId: 'system', actorName: 'Threat Detection', actor: 'system', user: 'system', sourceIp: '203.45.67.200', actorIp: '203.45.67.200', ip: '203.45.67.200', actorGeo: 'Unknown', geo: 'Unknown', userAgent: 'AegisShare/v4.2', resourceId: 'net_alert_001', resourceType: 'network', resource: 'threat_alert', action: 'alert', outcome: 'FAILURE', result: 'FAILURE', hash: '7h0j8f6i4e...', prevHash: '6g9i7e5h3d...', chainHash: 'ci6j9h0i8f...', merkleRoot: 'root_2026', timestamp: '2026-03-20T14:15:00Z', verified: true, risk: 'high', metadata: { threatType: 'brute_force', attempts: 45 },
    },
];

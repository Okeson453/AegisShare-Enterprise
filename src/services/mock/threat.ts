import type { ThreatAlert, AnomalyScore, IpReputation } from '@/types';

export const MOCK_THREATS: ThreatAlert[] = [
    {
        id: 'threat_001', severity: 'CRITICAL', type: 'brute_force', message: 'Brute Force Attack Detected - Multiple failed login attempts from suspicious IP', sourceIp: '203.45.67.200', timestamp: '2026-03-20T14:15:00Z', resolved: false,
    },
    {
        id: 'threat_002', severity: 'HIGH', type: 'anomalous_access', message: 'Unusual File Access Pattern - User accessing 50+ files in 3 minutes', sourceIp: '192.168.1.50', timestamp: '2026-03-20T13:45:00Z', resolved: false,
    },
    {
        id: 'threat_003', severity: 'MEDIUM', type: 'auth_bypass', message: 'Authorization Policy Bypass Attempt - Request violated ABAC constraints', sourceIp: '156.78.90.200', timestamp: '2026-03-20T12:00:00Z', resolved: true,
    },
    {
        id: 'threat_004', severity: 'MEDIUM', type: 'exfiltration', message: 'Data Exfiltration Signature - Large download outside normal business hours', sourceIp: '203.45.78.90', timestamp: '2026-03-20T02:30:00Z', resolved: false,
    },
    {
        id: 'threat_005', severity: 'LOW', type: 'cert_anomaly', message: 'SSL Certificate Anomaly - Minor certificate validation warning', sourceIp: '10.0.0.5', timestamp: '2026-03-19T18:20:00Z', resolved: true,
    },
    {
        id: 'threat_006', severity: 'CRITICAL', type: 'ransomware', message: 'Ransomware Signature Match - Binary pattern matched known ransomware family', sourceIp: '89.123.45.67', timestamp: '2026-03-20T15:10:00Z', resolved: false,
    },
];

export const MOCK_ANOMALIES: AnomalyScore[] = [
    { metric: 'login_attempts', score: 22, threshold: 70, timestamp: '2026-03-20T00:00:00Z', isAnomalous: false },
    { metric: 'login_attempts', score: 25, threshold: 70, timestamp: '2026-03-20T01:00:00Z', isAnomalous: false },
    { metric: 'file_access_rate', score: 65, threshold: 70, timestamp: '2026-03-20T02:00:00Z', isAnomalous: false },
    { metric: 'login_attempts', score: 48, threshold: 70, timestamp: '2026-03-20T03:00:00Z', isAnomalous: false },
    { metric: 'login_attempts', score: 32, threshold: 70, timestamp: '2026-03-20T04:00:00Z', isAnomalous: false },
    { metric: 'login_attempts', score: 19, threshold: 70, timestamp: '2026-03-20T05:00:00Z', isAnomalous: false },
    { metric: 'login_attempts', score: 28, threshold: 70, timestamp: '2026-03-20T06:00:00Z', isAnomalous: false },
    { metric: 'login_attempts', score: 41, threshold: 70, timestamp: '2026-03-20T07:00:00Z', isAnomalous: false },
    { metric: 'file_access_rate', score: 55, threshold: 70, timestamp: '2026-03-20T08:00:00Z', isAnomalous: false },
    { metric: 'file_access_rate', score: 68, threshold: 70, timestamp: '2026-03-20T09:00:00Z', isAnomalous: false },
    { metric: 'file_access_rate', score: 72, threshold: 70, timestamp: '2026-03-20T10:00:00Z', isAnomalous: true },
    { metric: 'file_access_rate', score: 85, threshold: 70, timestamp: '2026-03-20T11:00:00Z', isAnomalous: true },
    { metric: 'file_access_rate', score: 62, threshold: 70, timestamp: '2026-03-20T12:00:00Z', isAnomalous: false },
    { metric: 'login_attempts', score: 44, threshold: 70, timestamp: '2026-03-20T13:00:00Z', isAnomalous: false },
    { metric: 'file_access_rate', score: 58, threshold: 70, timestamp: '2026-03-20T14:00:00Z', isAnomalous: false },
];

export const MOCK_IP_REPUTATION: IpReputation[] = [
    {
        ip: '203.45.67.200',
        reputation: 'BLOCKED',
        asnNumber: 'AS12345',
        country: 'Moscow, RU',
        lastSeen: '2026-03-20T14:15:00Z',
        threatLevel: 'CRITICAL',
        threatHistory: ['Brute force attack (2026-03-20)', 'Malware distribution (2026-03-18)', 'DDoS attempt (2026-03-15)'],
    },
    {
        ip: '192.168.1.50',
        reputation: 'MONITORED',
        asnNumber: 'AS54321',
        country: 'Dublin, IE',
        lastSeen: '2026-03-20T13:45:00Z',
        threatLevel: 'HIGH',
        threatHistory: ['Unusual file access (2026-03-20)', 'Anomalous timing (2026-03-19)'],
    },
    {
        ip: '156.78.90.123',
        reputation: 'TRUSTED',
        asnNumber: 'AS98765',
        country: 'Boston, US',
        lastSeen: '2026-03-20T12:30:00Z',
        threatLevel: 'INFO',
        threatHistory: ['Normal access pattern (ongoing)'],
    },
    {
        ip: '89.123.45.67',
        reputation: 'BLOCKED',
        asnNumber: 'AS11111',
        country: 'Kiev, UA',
        lastSeen: '2026-03-20T15:10:00Z',
        threatLevel: 'CRITICAL',
        threatHistory: ['Ransomware distribution (2026-03-20)', 'Malware command&control (2026-03-18)'],
    },
];


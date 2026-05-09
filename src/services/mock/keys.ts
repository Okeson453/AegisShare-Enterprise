import type { RootKey, Kek, Dek, HsmCluster, RotationEntry } from '@/types';

export const MOCK_ROOT_KEYS: RootKey[] = [
    { id: 'rk_001', status: 'ACTIVE', createdAt: '2025-06-01T00:00:00Z', metadata: { region: 'eu-west-1', hsmSlot: 'slot_01' } },
    { id: 'rk_002', status: 'ACTIVE', createdAt: '2025-08-15T10:00:00Z', metadata: { region: 'us-east-1', hsmSlot: 'slot_02' } },
];

export const MOCK_KEKS: Kek[] = [
    { id: 'kek_001', rkId: 'rk_001', status: 'ACTIVE', createdAt: '2025-09-01T08:00:00Z', metadata: { groupId: 'grp_finance', wrappedBy: 'rk_001' } },
    { id: 'kek_002', rkId: 'rk_001', status: 'ACTIVE', createdAt: '2025-10-05T12:00:00Z', metadata: { groupId: 'grp_healthcare', wrappedBy: 'rk_001' } },
    { id: 'kek_003', rkId: 'rk_002', status: 'PENDING_ROTATION', createdAt: '2025-11-10T15:00:00Z', metadata: { groupId: 'grp_engineering', wrappedBy: 'rk_002' } },
    { id: 'kek_004', rkId: 'rk_002', status: 'ACTIVE', createdAt: '2025-12-01T09:00:00Z', metadata: { groupId: 'grp_compliance', wrappedBy: 'rk_002' } },
];

export const MOCK_DEKS: Dek[] = [
    { id: 'dek_001', kekId: 'kek_001', fileId: 'file_001', status: 'ACTIVE', createdAt: '2026-03-15T09:30:00Z' },
    { id: 'dek_002', kekId: 'kek_001', fileId: 'file_005', status: 'ACTIVE', createdAt: '2026-02-28T13:20:00Z' },
    { id: 'dek_003', kekId: 'kek_002', fileId: 'file_002', status: 'ACTIVE', createdAt: '2026-03-14T14:15:00Z' },
    { id: 'dek_004', kekId: 'kek_002', fileId: 'file_003', status: 'ACTIVE', createdAt: '2026-03-19T11:00:00Z' },
    { id: 'dek_005', kekId: 'kek_003', fileId: 'file_004', status: 'ACTIVE', createdAt: '2026-03-10T08:45:00Z' },
    { id: 'dek_006', kekId: 'kek_003', fileId: 'file_010', status: 'INACTIVE', createdAt: '2025-03-10T08:45:00Z' },
    { id: 'dek_007', kekId: 'kek_003', fileId: 'file_011', status: 'ACTIVE', createdAt: '2026-01-20T10:00:00Z' },
    { id: 'dek_008', kekId: 'kek_004', fileId: 'file_012', status: 'ACTIVE', createdAt: '2026-03-01T14:30:00Z' },
];

export const MOCK_HSM_CLUSTERS: HsmCluster[] = [
    { id: 'hsm_cluster_001', name: 'hsm_cluster_001', region: 'eu-west-1', primary: { id: 'hsm_001', status: 'ONLINE', serialNumber: 'SN001', firmwareVersion: 'v3.2.1' }, status: 'OPERATIONAL', keyCount: 2048, capacity: 4096, type: 'Luna HSM 7' },
    { id: 'hsm_cluster_002', name: 'hsm_cluster_002', region: 'us-east-1', primary: { id: 'hsm_002', status: 'ONLINE', serialNumber: 'SN002', firmwareVersion: 'v3.2.1' }, status: 'OPERATIONAL', keyCount: 1856, capacity: 4096, type: 'Luna HSM 7' },
];

export const MOCK_ROTATION_SCHEDULE: RotationEntry[] = [
    { keyId: 'kek_003', keyType: 'KEK', scheduledDate: '2026-04-10T00:00:00Z', status: 'PENDING' },
    { keyId: 'dek_006', keyType: 'DEK', scheduledDate: '2026-04-01T00:00:00Z', status: 'PENDING' },
];

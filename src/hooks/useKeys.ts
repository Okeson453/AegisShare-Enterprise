import { useState, useCallback, useEffect } from 'react';
import { useKeysStore } from '@/store';
import { keysService } from '@/services/keys';
import { MOCK_ROOT_KEYS, MOCK_KEKS, MOCK_DEKS, MOCK_HSM_CLUSTERS, MOCK_ROTATION_SCHEDULE } from '@/services/mock/keys';

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true';

export function useKeys() {
  const { rootKeys, keks, deks, hsmClusters, rotationSchedule, setKeyHierarchy, setHsmClusters, setRotationSchedule } = useKeysStore();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        if (MOCK_MODE) {
          await new Promise(r => setTimeout(r, 320));
          setKeyHierarchy(MOCK_ROOT_KEYS, MOCK_KEKS, MOCK_DEKS);
          setHsmClusters(MOCK_HSM_CLUSTERS);
          setRotationSchedule(MOCK_ROTATION_SCHEDULE);
        } else {
          const hierarchy = await keysService.getKeyHierarchy();
          setKeyHierarchy(hierarchy.rootKeys, hierarchy.keks, hierarchy.deks);
          const hsm = await keysService.getHsmStatus();
          setHsmClusters(hsm);
          const rotation = await keysService.getRotationSchedule();
          setRotationSchedule(rotation);
        }
      } catch (e: any) {
        setError(e.message);
        setKeyHierarchy(MOCK_ROOT_KEYS, MOCK_KEKS, MOCK_DEKS);
        setHsmClusters(MOCK_HSM_CLUSTERS);
        setRotationSchedule(MOCK_ROTATION_SCHEDULE);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [setKeyHierarchy, setHsmClusters, setRotationSchedule]);

  const triggerRotation = useCallback(async (keyId: string) => {
    try {
      if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 200));
      } else {
        await keysService.rotateKey(keyId);
      }
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  return { rootKeys, keks, deks, hsmClusters, rotationSchedule, loading, error, triggerRotation };
}

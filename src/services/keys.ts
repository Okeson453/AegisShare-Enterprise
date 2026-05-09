import api from './api'

export const keysService = {
    getKeyHierarchy: async () => {
        const { data } = await api.get('/keys/hierarchy')
        return data
    },

    rotateKey: async (keyId: string) => {
        const { data } = await api.post(`/keys/${keyId}/rotate`)
        return data
    },

    getHsmStatus: async () => {
        const { data } = await api.get('/keys/hsm/status')
        return data
    },

    getRotationSchedule: async () => {
        const { data } = await api.get('/keys/rotation/schedule')
        return data
    },
}

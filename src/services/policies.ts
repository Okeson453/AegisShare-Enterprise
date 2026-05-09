import api from './api'

export const policyService = {
    listPolicies: async () => {
        const { data } = await api.get('/policies')
        return data
    },

    createPolicy: async (policy: object) => {
        const { data } = await api.post('/policies', policy)
        return data
    },

    evaluatePolicy: async (request: object) => {
        const { data } = await api.post('/policies/evaluate', request)
        return data
    },

    simulatePdp: async (input: object) => {
        const { data } = await api.post('/policies/pdp/simulate', input)
        return data
    },
}

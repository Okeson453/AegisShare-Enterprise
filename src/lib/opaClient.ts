import api from '@/services/api'

export const opaClient = {
    evaluate: async (input: object) => {
        const { data } = await api.post('/policy/opa/evaluate', input)
        return data
    },

    compile: async (regoCode: string) => {
        const { data } = await api.post('/policy/opa/compile', { code: regoCode })
        return data
    },

    getModules: async () => {
        const { data } = await api.get('/policy/opa/modules')
        return data
    },
}

export default opaClient

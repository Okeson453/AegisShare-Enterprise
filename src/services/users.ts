import api from './api'

export const usersService = {
    listUsers: async () => {
        const { data } = await api.get('/users')
        return data
    },

    getUser: async (userId: string) => {
        const { data } = await api.get(`/users/${userId}`)
        return data
    },

    updateAttributes: async (userId: string, attributes: object) => {
        const { data } = await api.put(`/users/${userId}/attributes`, attributes)
        return data
    },

    provisionUser: async (userInfo: object) => {
        const { data } = await api.post('/users/provision', userInfo)
        return data
    },
}

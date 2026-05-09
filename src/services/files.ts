import api from './api'

export const filesService = {
    listFiles: async () => {
        const { data } = await api.get('/files')
        return data
    },

    getFile: async (id: string) => {
        const { data } = await api.get(`/files/${id}`)
        return data
    },

    uploadFile: async (formData: FormData) => {
        const { data } = await api.post('/files/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        return data
    },

    deleteFile: async (id: string) => {
        await api.delete(`/files/${id}`)
    },

    revokeAccess: async (fileId: string, userId: string) => {
        await api.post(`/files/${fileId}/revoke/${userId}`)
    },
}

import { useState, useCallback, useEffect } from 'react'
import { useFilesStore } from '@/store/filesStore'
import { filesService } from '@/services/files'
import { MOCK_FILES } from '@/services/mock/files'
import type { FileRecord } from '@/types'

const MOCK_MODE = import.meta.env.VITE_MOCK_API === 'true'

export const useFiles = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { files, selectedFile, uploadProgress, setSelectedFile, addFile, setFiles } = useFilesStore()

    // Fetch files on mount
    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            try {
                if (MOCK_MODE) {
                    await new Promise(r => setTimeout(r, 300))
                    setFiles(MOCK_FILES)
                } else {
                    const data = await filesService.listFiles()
                    setFiles(data)
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch files')
                setFiles(MOCK_FILES)
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [setFiles])

    const upload = useCallback(async (file: File) => {
        setLoading(true)
        try {
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 800))
                const sizeInMB = (file.size / 1024 / 1024).toFixed(2)
                const newFile: FileRecord = {
                    id: `FILE-${Date.now()}`,
                    name: file.name,
                    sizeBytes: file.size,
                    size: `${sizeInMB} MB`,
                    type: file.type.includes('pdf') ? 'PDF' : file.type.includes('zip') ? 'ZIP' : 'DOC',
                    dekId: `dek_${Date.now()}`,
                    policyId: 'pol_default',
                    region: 'eu-west-1',
                    hash: `0x${Math.random().toString(16).substr(2)}`,
                    integrityHash: `0x${Math.random().toString(16).substr(2)}`,
                    uploadedBy: 'current_user@aegis.io',
                    uploadedAt: new Date().toISOString(),
                    expiresAt: null,
                    expiry: 'Never',
                    tags: ['E2EE'],
                    shares: [],
                    accessList: [],
                    totalViews: 0,
                    downloads: 0,
                    shareCount: 0,
                }
                addFile(newFile)
            } else {
                const formData = new FormData()
                formData.append('file', file)
                const uploaded = await filesService.uploadFile(formData)
                addFile(uploaded)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed')
        } finally {
            setLoading(false)
        }
    }, [addFile])

    const revoke = useCallback(async (fileId: string, userId: string) => {
        try {
            if (!MOCK_MODE) {
                await filesService.revokeAccess(fileId, userId)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to revoke access')
        }
    }, [])

    const deleteFile = useCallback(async (fileId: string) => {
        try {
            if (MOCK_MODE) {
                await new Promise(r => setTimeout(r, 200))
            } else {
                await filesService.deleteFile(fileId)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete file')
        }
    }, [])

    return {
        files,
        selectedFile,
        uploadProgress,
        loading,
        error,
        upload,
        setSelectedFile,
        revoke,
        deleteFile,
    }
}

import { useState, useRef } from 'react'

interface FileUploadDropZoneConfig {
    maxSize?: number // in bytes
    acceptedTypes?: string[]
    onDrop: (files: File[]) => void
    onError?: (error: string) => void
}

export const useFileUploadDrop = ({
    maxSize = 10 * 1024 * 1024, // 10MB default
    acceptedTypes = [],
    onDrop,
    onError,
}: FileUploadDropZoneConfig) => {
    const [isDragOver, setIsDragOver] = useState(false)
    const dragCounterRef = useRef(0)

    const validateFiles = (files: File[]): File[] => {
        return files.filter((file) => {
            if (file.size > maxSize) {
                onError?.(
                    `File "${file.name}" exceeds maximum size of ${Math.round(maxSize / 1024 / 1024)}MB`
                )
                return false
            }

            if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
                onError?.(`File type "${file.type}" is not accepted`)
                return false
            }

            return true
        })
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        dragCounterRef.current++
        if (dragCounterRef.current === 1) {
            setIsDragOver(true)
        }
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        dragCounterRef.current--
        if (dragCounterRef.current === 0) {
            setIsDragOver(false)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        dragCounterRef.current = 0
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        const validFiles = validateFiles(files)

        if (validFiles.length > 0) {
            onDrop(validFiles)
        }
    }

    return {
        isDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
    }
}

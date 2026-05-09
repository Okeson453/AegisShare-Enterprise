import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useFileUploadDrop } from '@/hooks/useFileUploadDrop'

interface DropZoneProps {
    onDrop: (files: File[]) => void
    onError?: (error: string) => void
    maxSize?: number
    acceptedTypes?: string[]
    children?: ReactNode
    placeholder?: string
}

export const DropZone = ({
    onDrop,
    onError,
    maxSize,
    acceptedTypes,
    children,
    placeholder = 'Drag files here or click to upload',
}: DropZoneProps) => {
    const { isDragOver, handleDragEnter, handleDragLeave, handleDragOver, handleDrop } =
        useFileUploadDrop({
            maxSize,
            acceptedTypes,
            onDrop,
            onError,
        })

    return (
        <motion.div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            animate={{ backgroundColor: isDragOver ? 'rgba(34, 211, 238, 0.05)' : 'transparent' }}
            transition={{ duration: 0.2 }}
            style={{
                padding: '32px 20px',
                border: `2px dashed ${isDragOver ? 'var(--cy)' : 'var(--bd)'}`,
                borderRadius: '8px',
                textAlign: 'center',
                transition: 'border-color 0.2s ease',
                cursor: 'pointer',
            }}
        >
            <div
                style={{
                    fontSize: '32px',
                    marginBottom: '12px',
                    opacity: isDragOver ? 1 : 0.6,
                    transition: 'opacity 0.2s ease',
                }}
            >
                📤
            </div>

            <p
                style={{
                    margin: '0 0 8px 0',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: isDragOver ? 'var(--cy)' : 'var(--t0)',
                    transition: 'color 0.2s ease',
                }}
            >
                {placeholder}
            </p>

            {children && <div style={{ marginTop: '12px' }}>{children}</div>}
        </motion.div>
    )
}

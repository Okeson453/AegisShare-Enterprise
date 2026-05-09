import React from 'react'
import { Card, Button } from '@/components/ui'
import type { FileRecord } from '@/types'

interface ExpiringFilesProps {
    files?: FileRecord[]
    onSelectFile: (fileId: string) => void
}

const ExpiringFiles: React.FC<ExpiringFilesProps> = ({ files = [], onSelectFile }) => {
    const expiringFiles = files.filter(f => {
        if (!f.expiresAt) return false
        const daysLeft = (new Date(f.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        return daysLeft > 0 && daysLeft < 30
    })

    const getDaysLeft = (expiresAt: string): number => {
        return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    }

    const getRiskColor = (daysLeft: number): string => {
        if (daysLeft <= 1) return 'text-rd'
        if (daysLeft <= 7) return 'text-or'
        return 'text-ye'
    }

    if (expiringFiles.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <p className="text-sm text-t2">No expiring files</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Expiring Soon (Next 30 Days)</h3>
            <div className="space-y-3">
                {expiringFiles.map((file) => {
                    const daysLeft = getDaysLeft(file.expiresAt!)
                    return (
                        <div
                            key={file.id}
                            onClick={() => onSelectFile(file.id)}
                            className="flex items-center justify-between p-4 border border-bd rounded hover:bg-s1 cursor-pointer transition-colors"
                        >
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-t0 mb-1">{file.name}</h4>
                                <p className="text-xs text-t3">
                                    Expires{' '}
                                    <span className={`font-semibold ${getRiskColor(daysLeft)}`}>
                                        {daysLeft === 0
                                            ? 'today'
                                            : daysLeft === 1
                                              ? 'tomorrow'
                                              : `in ${daysLeft} days`}
                                    </span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-xs text-t2">{file.size}</p>
                                    <p className={`text-xs font-semibold ${getRiskColor(daysLeft)}`}>
                                        {new Date(file.expiresAt!).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div
                                    className={`w-1.5 h-10 rounded-full ${
                                        daysLeft <= 1 ? 'bg-rd' : daysLeft <= 7 ? 'bg-or' : 'bg-ye'
                                    }`}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onSelectFile(file.id)
                                    }}
                                >
                                    Extend →
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default ExpiringFiles

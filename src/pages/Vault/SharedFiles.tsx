import React from 'react'
import { Card, Button } from '@/components/ui'
import type { FileRecord } from '@/types'

interface SharedFilesProps {
    files?: FileRecord[]
    onSelectFile: (fileId: string) => void
}

const SharedFiles: React.FC<SharedFilesProps> = ({ files = [], onSelectFile }) => {
    const sharedFiles = files.filter(f => f.tags?.includes('SHARED') && f.shares && f.shares.length > 0)

    if (sharedFiles.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <p className="text-sm text-t2">No files shared yet</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">Shared Files</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-bd bg-s2">
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Name</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Recipients</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Link</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Expires</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Views</th>
                            <th className="text-right py-3 px-3 text-t2 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sharedFiles.map((file) => (
                            <tr
                                key={file.id}
                                onClick={() => onSelectFile(file.id)}
                                className="border-b border-bd hover:bg-s1 cursor-pointer transition-colors"
                            >
                                <td className="py-3 px-3 font-medium text-t0">{file.name}</td>
                                <td className="py-3 px-3 text-t2">{file.shares?.length || 0} recipient(s)</td>
                                <td className="py-3 px-3 font-mono text-cy text-xs">
                                    {file.shares?.[0]?.url.slice(0, 20)}...
                                </td>
                                <td className="py-3 px-3 text-t2">
                                    {file.shares?.[0]?.expiresAt
                                        ? new Date(file.shares[0].expiresAt).toLocaleDateString()
                                        : 'Never'}
                                </td>
                                <td className="py-3 px-3 text-t2">
                                    {file.shares?.[0]?.viewCount || 0} / {file.shares?.[0]?.maxViews || '∞'}
                                </td>
                                <td className="py-3 px-3 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onSelectFile(file.id)
                                        }}
                                    >
                                        Manage →
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
}

export default SharedFiles

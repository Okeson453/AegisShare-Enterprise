import React from 'react'
import { Card, Button } from '@/components/ui'
import type { FileRecord } from '@/types'

interface AllFilesProps {
    files?: FileRecord[]
    onSelectFile: (fileId: string) => void
}

const AllFiles: React.FC<AllFilesProps> = ({ files = [], onSelectFile }) => {
    if (files.length === 0) {
        return (
            <Card>
                <div className="text-center py-8">
                    <p className="text-sm text-t2">No files yet. Upload your first file to get started.</p>
                </div>
            </Card>
        )
    }

    return (
        <Card>
            <h3 className="text-sm font-semibold text-t0 mb-4">All Files</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-bd bg-s2">
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Name</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Size</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Type</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">DEK</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Uploaded</th>
                            <th className="text-left py-3 px-3 text-t2 font-semibold">Views</th>
                            <th className="text-right py-3 px-3 text-t2 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr
                                key={file.id}
                                onClick={() => onSelectFile(file.id)}
                                className="border-b border-bd hover:bg-s1 cursor-pointer transition-colors"
                            >
                                <td className="py-3 px-3 font-medium text-t0">{file.name}</td>
                                <td className="py-3 px-3 text-t2">{file.size}</td>
                                <td className="py-3 px-3 text-t2">{file.type}</td>
                                <td className="py-3 px-3 font-mono text-cy text-xs">{file.dekId.slice(0, 8)}...</td>
                                <td className="py-3 px-3 text-t2">
                                    {new Date(file.uploadedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="py-3 px-3 text-t2">{file.totalViews || 0}</td>
                                <td className="py-3 px-3 text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onSelectFile(file.id)
                                        }}
                                    >
                                        View Details →
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

export default AllFiles

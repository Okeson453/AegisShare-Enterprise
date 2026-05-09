import React from 'react';
import type { FileRecord, FileAccess } from '@/types';

// Props interface for FileDetailPanel
interface FileDetailPanelProps {
    file: FileRecord;
    accesses: FileAccess[];
    onClose: () => void;
    onRevoke: (userId: string) => void;
}

/**
 * FileDetailPanel - Slide-in panel showing comprehensive file details
 * Displays cryptographic parameters, access policies, and access tracking
 */
const FileDetailPanel: React.FC<FileDetailPanelProps> = ({
    file,
    accesses,
    onClose,
    onRevoke,
}) => {
    return (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-s0 border-l border-bd rounded-l-lg shadow-2xl overflow-y-auto animate-slideIn">
            {/* Header with close button */}
            <div className="sticky top-0 bg-s0 border-b border-bd p-4 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-semibold text-t0">File Details</h2>
                    <p className="text-xs text-t3 mt-1">{file.name}</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-rd/20 text-t2 hover:text-rd rounded transition-colors"
                >
                    ✕
                </button>
            </div>

            <div className="p-4 space-y-6">
                {/* Cryptographic Details Section */}
                <section>
                    <h3 className="text-xs font-mono text-t3 uppercase tracking-wider mb-3">
                        Cryptographic Details
                    </h3>
                    <div className="bg-s2 border border-bd/50 rounded p-3 space-y-2">
                        {[
                            { label: 'Algorithm', value: 'AES-256-GCM', color: 'text-em' },
                            { label: 'Key Derivation', value: 'Argon2id · 64MB · 3 iter', color: '' },
                            { label: 'DEK ID', value: file.dekId, color: 'text-cy' },
                            { label: 'Key Wrapping', value: 'ECIES secp256k1', color: '' },
                            { label: 'Transport', value: 'TLS 1.3', color: 'text-em' },
                        ].map(item => (
                            <div key={item.label} className="flex justify-between items-center">
                                <span className="text-xs text-t3 font-mono">{item.label}</span>
                                <span className={`text-xs font-mono ${item.color || 'text-t1'}`}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Access Policy Section */}
                <section>
                    <h3 className="text-xs font-mono text-t3 uppercase tracking-wider mb-3">
                        Access Policy
                    </h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-t3">Policy ID</span>
                            <span className="text-cy">{file.policyId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-t3">Region Lock</span>
                            <span className="text-t0">{file.region}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-t3">Revocation</span>
                            <span className="text-em">Immediate (server-side)</span>
                        </div>
                    </div>
                </section>

                {/* Who Has Access Section */}
                <section>
                    <h3 className="text-xs font-mono text-t3 uppercase tracking-wider mb-3">
                        Who Has Access ({accesses.length})
                    </h3>
                    <div className="space-y-2">
                        {accesses.map(access => (
                            <div
                                key={access.userId}
                                className="p-2 bg-s2 border border-bd/50 rounded flex items-center justify-between hover:border-bd transition-colors"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-7 h-7 rounded bg-s4 border border-cy/20 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-mono text-cy">{access.initials}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-t0">{access.name}</p>
                                        <p className="text-xs text-t3 font-mono">{access.permission} · {access.views} views</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRevoke(access.userId)}
                                    className="px-2 py-1 text-xs font-mono rounded bg-rd1 text-rd border border-rd/20 hover:bg-rd/20 transition-all"
                                >
                                    REVOKE
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Metadata Section */}
                <section>
                    <h3 className="text-xs font-mono text-t3 uppercase tracking-wider mb-3">
                        Metadata
                    </h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-t3">Uploaded by</span>
                            <span className="text-t0">{file.uploadedBy}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-t3">Upload date</span>
                            <span className="text-t0">{file.uploadedAt}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-t3">Expiry</span>
                            <span className="text-am">{file.expiry}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-t3">Total views</span>
                            <span className="text-t0">{file.totalViews}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-t3">Downloads</span>
                            <span className="text-t0">{file.downloads}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default FileDetailPanel;

import React, { useState, useEffect } from 'react';

// Props interface for upload modal
interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (settings: UploadSettings) => void;
}

interface UploadSettings {
    permissions: Record<string, boolean>;
    policyId: string;
    expiry: string;
    maxViews: number;
    security: Record<string, boolean>;
}

/**
 * UploadModal - Complete file upload workflow modal
 * Handles file selection, encryption progress tracking, and policy configuration
 * Demonstrates ZK encryption flow with 4-step cryptographic progression
 */
const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [permissions, setPermissions] = useState({
        'View Only': true,
        Download: false,
        Edit: false,
        Forward: false,
    });
    const [security, setSecurity] = useState({
        'Invisible Watermark': true,
        'Link Expiry': true,
        'Require MFA': true,
        'Password Lock': false,
    });

    // Simulate encryption progress flow
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 80);

        return () => clearInterval(interval);
    }, [isOpen]);

    if (!isOpen) return null;

    // Steps in the encryption flow visualization
    const encryptionSteps = [
        { name: 'Generate DEK', desc: 'Argon2id · 64MB · 3 iterations · 256-bit output' },
        { name: 'AES-256-GCM Encrypt', desc: 'IV: 96-bit random · Auth tag: 128-bit · Chunk: 64KB' },
        { name: 'ECIES Key Wrap', desc: 'Recipient secp256k1 pubkey · Ephemeral keypair per-share' },
        { name: 'Upload Ciphertext', desc: 'HTTPS TLS 1.3 · S3 WORM Object Lock · eu-west-1' },
    ];

    const handleConfirm = () => {
        onConfirm({
            permissions,
            policyId: 'pol_fin_read',
            expiry: '7 days',
            maxViews: 50,
            security,
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-50"
            onClick={e => e.currentTarget === e.target && onClose()}
        >
            <div className="w-full max-w-3xl max-h-[90vh] bg-s1 border border-bd rounded-lg overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-cy/5 to-transparent p-5 border-b border-bd">
                    <h2 className="text-lg font-bold text-t0 mb-1">Secure File Upload — Zero-Knowledge</h2>
                    <p className="text-xs text-t3 font-mono">
                        AES-256-GCM client-side · ECIES key wrapping · Server never sees plaintext · WORM audit logged
                    </p>
                </div>

                {/* Modal Body - Grid Layout */}
                <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 p-5">
                    {/* Left side - Upload & Progress */}
                    <div className="col-span-2 space-y-4">
                        {/* Dropzone */}
                        <div className="border-2 border-dashed border-cy/20 rounded-lg p-6 text-center hover:border-cy/40 hover:bg-cy/5 transition-all cursor-pointer">
                            <p className="text-3xl mb-2">📤</p>
                            <p className="text-sm text-t1">Drop files or <strong>click to browse</strong></p>
                            <p className="text-xs text-t3 mt-1">Max 5 GB per file · All types · E2EE applied before upload</p>
                        </div>

                        {/* Upload Progress Card */}
                        <div className="bg-s2 border border-bd rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <p className="text-sm font-medium text-t0">Q1_2025_Financial_Report.pdf</p>
                                    <p className="text-xs text-t3 font-mono">4.2 MB · DEK: {uploadProgress < 100 ? 'generating…' : 'dek_a3f8d912'}</p>
                                </div>
                                <p className="text-lg font-bold text-cy">{uploadProgress}%</p>
                            </div>

                            {/* Progress bar and status */}
                            <div className="mb-3">
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-cy to-em transition-all upload-progress"
                                        style={{ '--progress-width': uploadProgress + '%' } as any}
                                    />
                                </div>
                            </div>

                            {/* Encryption step indicators */}
                            <div className="space-y-2">
                                {encryptionSteps.map((step, idx) => {
                                    const isComplete = uploadProgress > (idx + 1) * 25;
                                    return (
                                        <div key={idx} className="flex items-start gap-2">
                                            <div
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${isComplete
                                                    ? 'bg-em border-em'
                                                    : 'border-bd bg-s3'
                                                    }`}
                                            >
                                                {isComplete && <span className="text-xs text-s0">✓</span>}
                                            </div>
                                            <div>
                                                <p className={`text-xs font-mono ${isComplete ? 'text-t0 font-semibold' : 'text-t3'}`}>
                                                    {step.name}
                                                </p>
                                                <p className="text-xs text-t3">{step.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Permissions & Options */}
                    <div className="space-y-4">
                        {/* Permissions Section */}
                        <div>
                            <label className="text-xs font-mono text-t3 uppercase tracking-wider block mb-2">
                                Permissions
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(permissions).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => setPermissions(p => ({ ...p, [key as keyof typeof p]: !value }))}
                                        className={`px-2 py-2 rounded text-xs font-mono transition-all ${value
                                            ? 'bg-cy1 border border-cy/30 text-cy'
                                            : 'bg-white/3 border border-bd text-t2'
                                            }`}
                                    >
                                        {key}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Policy Config */}
                        <div>
                            <label className="text-xs font-mono text-t3 uppercase tracking-wider block mb-2">
                                Policy ID
                            </label>
                            <input
                                type="text"
                                defaultValue="pol_fin_read"
                                aria-label="Policy ID"
                                className="w-full px-2 py-2 bg-s2 border border-bd rounded text-xs text-t0 font-mono"
                            />
                        </div>

                        {/* Link Expiry */}
                        <div>
                            <label className="text-xs font-mono text-t3 uppercase tracking-wider block mb-2">
                                Link Expiry
                            </label>
                            <input
                                type="text"
                                defaultValue="7 days"
                                className="w-full px-2 py-2 bg-s2 border border-bd rounded text-xs text-t0 font-mono"
                            />
                        </div>

                        {/* Max Views */}
                        <div>
                            <label className="text-xs font-mono text-t3 uppercase tracking-wider block mb-2">
                                Max Views
                            </label>
                            <input
                                type="number"
                                defaultValue="50"
                                aria-label="Max Views"
                                className="w-full px-2 py-2 bg-s2 border border-bd rounded text-xs text-t0 font-mono"
                            />
                        </div>

                        {/* Security Options */}
                        <div>
                            <label className="text-xs font-mono text-t3 uppercase tracking-wider block mb-2">
                                Security Options
                            </label>
                            <div className="space-y-2">
                                {Object.entries(security).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSecurity(s => ({ ...s, [key as keyof typeof s]: !value }))}
                                        className={`w-full text-left px-2 py-1.5 rounded text-xs border transition-all ${value
                                            ? 'bg-cy1 border-cy/30 text-cy'
                                            : 'bg-white/3 border-bd text-t2'
                                            }`}
                                    >
                                        {value ? '✓' : '○'} {key}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ZK Guarantee */}
                        <div className="bg-em/5 border border-em/15 rounded p-3">
                            <p className="text-xs font-mono font-bold text-em mb-1">✓ Zero-Knowledge Guarantee</p>
                            <p className="text-xs text-t3 leading-relaxed">
                                Keys generated in your browser. Server receives only ciphertext. DEK wrapped with recipient pubkey.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="border-t border-bd p-4 bg-s0 flex items-center justify-between">
                    <p className="text-xs text-t3 font-mono">
                        🔒 ZK · GDPR Art.32 · HIPAA · WORM · HSM-signed · SOC 2 compliant
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded text-sm font-medium bg-white/5 border border-bd text-t1 hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 rounded text-sm font-medium bg-cy text-bg hover:opacity-90 transition-all"
                        >
                            {uploadProgress === 100 ? 'Confirm & Upload' : 'Encrypting…'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;

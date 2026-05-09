import React, { useState } from 'react';

// Type definitions for file vault management
interface FileRecord {
  id: string;
  name: string;
  size: string;
  type: 'PDF' | 'XLS' | 'DOC' | 'ZIP';
  color: string;
  backgroundColor: string;
  shares: number;
  views: number;
  dekId: string;
  policyId: string;
  region: string;
  modifiedAt: string;
  risk: 'none' | 'expiring' | 'hipaa';
  hash: string;
}

// Props interface for FileList component
interface FileListProps {
  files: FileRecord[];
  selectedId?: string | null;
  onSelect: (file: FileRecord) => void;
}

/**
 * FileList - Renders a searchable & filterable list of encrypted files
 * Users can browse, filter by type, and select files for details panel
 */
const FileList: React.FC<FileListProps> = ({ files, selectedId, onSelect }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Modified');

  // Filter logic - allows users to narrow file view by type
  const filters = ['All', 'PDF', 'XLS', 'DOC', 'ZIP', 'Expiring', 'Shared'];
  const filteredFiles = files.filter(f => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Expiring') return f.risk === 'expiring';
    if (activeFilter === 'Shared') return f.shares > 0;
    return f.type === activeFilter;
  });

  return (
    <div className="bg-s1 border border-bd rounded-lg overflow-hidden">
      {/* Header with title, filters, and sort control */}
      <div className="p-4 border-b border-bd flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-semibold text-t0">Zero-Knowledge File Vault</h2>
          <p className="text-xs text-t3 font-mono mt-1">
            {files.length} files · Per-file DEK · S3 WORM · AES-256-GCM + ECIES
          </p>
        </div>

        {/* Filter chips - allows multi-type filtering */}
        <div className="flex gap-2 items-center flex-wrap">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${activeFilter === filter
                  ? 'bg-cy1 border border-cy/30 text-cy'
                  : 'bg-white/3 border border-bd text-t2 hover:bg-white/5'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* File rows - each represents an encrypted file with metadata */}
      <div className="divide-y divide-bd">
        {filteredFiles.map(file => (
          <div
            key={file.id}
            onClick={() => onSelect(file)}
            className={`p-3 cursor-pointer transition-colors ${selectedId === file.id
                ? 'bg-cy/10 border-l-2 border-cy'
                : 'hover:bg-white/3'
              }`}
          >
            {/* File type badge + main content row */}
            <div className="flex items-center gap-3">
              <div
                className="px-2 py-1 rounded text-xs font-bold text-white file-badge"
                style={{ '--bg-color': file.backgroundColor, '--text-color': file.color } as any}
              >
                {file.type}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-t0 truncate">{file.name}</p>
                <p className="text-xs text-t3 font-mono">
                  {file.size} · {file.region} · DEK: {file.dekId} · {file.modifiedAt}
                </p>
              </div>

              {/* Status badges - shows encryption, sharing, and risk status */}
              <div className="flex gap-1 items-center flex-shrink-0">
                <span className="px-2 py-1 text-xs font-mono rounded bg-cy1 text-cy border border-cy/20">
                  E2EE
                </span>
                {file.shares > 0 && (
                  <span className="px-2 py-1 text-xs font-mono rounded bg-vl1 text-vl border border-vl/20">
                    Shared·{file.shares}
                  </span>
                )}
                {file.risk === 'expiring' && (
                  <span className="px-2 py-1 text-xs font-mono rounded bg-am1 text-am border border-am/20">
                    ⚠ Expiring
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;

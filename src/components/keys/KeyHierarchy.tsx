import React from 'react';
import '../../styles/access-control-extension.css';

interface KeyEntry {
  id: string;
  type: 'rk' | 'kek' | 'dek';
  status: 'active' | 'expiring' | 'retired';
  daysUntilExpiry?: number;
}

interface KeyHierarchyProps {
  keys: KeyEntry[];
}

/**
 * KeyHierarchy - Displays RK→KEK→DEK cryptographic key hierarchy
 * Shows 3-level tree structure with expiration status and key IDs
 */
const KeyHierarchy: React.FC<KeyHierarchyProps> = ({ keys }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rk':
        return { bg: 'bg-am/20', text: 'text-am', label: 'Root Key' };
      case 'kek':
        return { bg: 'bg-vl/20', text: 'text-vl', label: 'Key Encryption Key' };
      case 'dek':
        return { bg: 'bg-cy/20', text: 'text-cy', label: 'Data Encryption Key' };
      default:
        return { bg: 'bg-s2', text: 'text-t1', label: 'Key' };
    }
  };

  return (
    <div className="space-y-3 p-4 bg-s1 border border-bd rounded-lg font-mono text-xs">
      {keys.map(key => {
        const colors = getTypeColor(key.type);
        const isExpiring = key.status === 'expiring';

        return (
          <div
            key={key.id}
            className={`p-3 rounded-lg border-l-4 ${
              isExpiring ? 'border-l-am bg-am/5' : colors.bg
            } border border-bd/50`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Type badge */}
                <span className={`px-2 py-0.5 rounded text-xs ${colors.bg} ${colors.text} border border-bd/30`}>
                  {key.type.toUpperCase()}
                </span>

                {/* Key ID */}
                <span className="text-t0">{key.id}</span>

                {/* Status indicator */}
                <div
                  className={`w-2 h-2 rounded-full ${
                    key.status === 'active'
                      ? 'bg-em'
                      : key.status === 'expiring'
                        ? 'bg-am'
                        : 'bg-t3'
                  }`}
                />
              </div>

              {/* Expiry info */}
              {isExpiring && key.daysUntilExpiry !== undefined && (
                <span className="text-am font-semibold">⚠ {key.daysUntilExpiry}d</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KeyHierarchy;

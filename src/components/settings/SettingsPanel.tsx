import React from 'react';

interface SettingItem {
    key: string;
    title: string;
    description: string;
    locked?: boolean;
}

interface SettingsPanelProps {
    title: string;
    subtitle: string;
    items: SettingItem[];
    values: Record<string, boolean>;
    onToggle: (key: string, value: boolean) => void;
    accentColor?: string;
}

/**
 * SettingsPanel - Displays compliance-locked settings grid with toggle controls
 * Shows enabled/disabled state with descriptive labels and lock indicators
 */
const SettingsPanel: React.FC<SettingsPanelProps> = ({
    title,
    subtitle,
    items,
    values,
    onToggle,
    accentColor = 'var(--cy)',
}) => {
    const enabledCount = Object.values(values).filter(Boolean).length;
    const totalCount = Object.keys(values).length;

    return (
        <div
            className="p-6 bg-s1 border rounded-lg accent-header"
        >
            {/* Header with progress */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-t0 mb-1">{title}</h2>
                <p className="text-sm text-t3 mb-3">{subtitle}</p>

                {/* Progress indicator */}
                <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-s3 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all progress-bar"
                            style={{
                                width: ((enabledCount / totalCount) * 100) + '%',
                                background: 'linear-gradient(90deg, var(--cy), var(--em))'
                            }}
                        />
                    </div>
                    <span className="text-xs font-mono text-t3 whitespace-nowrap">
                        {enabledCount}/{totalCount} enabled
                    </span>
                </div>
            </div>

            {/* Settings Items */}
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.key} className="p-3 bg-s2 border border-bd/50 rounded-lg">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-sm font-medium text-t0">{item.title}</h3>
                                    {item.locked && (
                                        <span className="text-xs px-1.5 py-0.5 rounded bg-am/20 text-am font-mono">
                                            ⚿ LOCKED
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-t3">{item.description}</p>
                            </div>

                            {/* Toggle */}
                            <button
                                onClick={() => !item.locked && onToggle(item.key, !values[item.key])}
                                disabled={item.locked}
                                title={`Toggle ${item.title}`}
                                className={`relative w-12 h-7 rounded-full border flex-shrink-0 transition-all ${values[item.key] ? 'bg-cy/30 border-cy/50' : 'bg-s3 border-bd'} ${item.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <div
                                    className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-t3 transition-all ${values[item.key] ? 'translate-x-5 bg-cy' : ''}`}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default SettingsPanel;

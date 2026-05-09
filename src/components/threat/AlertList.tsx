import React from 'react';
import '../../styles/access-control-extension.css';

interface ThreatAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  file: string;
  ip: string;
  geo: string;
  time: string;
  threatDbCount: number;
  status: 'ACTION_REQUIRED' | 'AUTO_MITIGATED';
}

interface AlertListProps {
  alerts: ThreatAlert[];
  onAction?: (alertId: string) => void;
}

/**
 * AlertList - Displays security threat alerts with severity indicators and action buttons
 * Shows critical/high/medium threat cards with metadata and remediation actions
 */
const AlertList: React.FC<AlertListProps> = ({ alerts, onAction }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-rd/10', border: 'border-rd/30', text: 'text-rd' };
      case 'high':
        return { bg: 'bg-am/10', border: 'border-am/30', text: 'text-am' };
      case 'medium':
        return { bg: 'bg-cy/10', border: 'border-cy/30', text: 'text-cy' };
      default:
        return { bg: 'bg-s2', border: 'border-bd', text: 'text-t1' };
    }
  };

  return (
    <div className="space-y-3">
      {alerts.map(alert => {
        const colors = getSeverityColor(alert.severity);
        const borderColor = alert.severity === 'critical' ? 'border-l-rd' : alert.severity === 'high' ? 'border-l-am' : 'border-l-cy';

        return (
          <div
            key={alert.id}
            className={`p-4 border-l-4 ${borderColor} rounded-lg ${colors.bg} border ${colors.border} transition-all hover:opacity-90`}
          >
            {/* Alert header with severity badge */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-mono rounded border ${colors.border} ${colors.text}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <h3 className="text-sm font-semibold text-t0">{alert.title}</h3>
              </div>
            </div>

            {/* Alert description */}
            <p className="text-xs text-t1 mb-3 leading-relaxed">{alert.description}</p>

            {/* Metadata row */}
            <div className="flex items-center justify-between text-xs text-t3 font-mono">
              <div className="space-x-2">
                <span>File: {alert.file}</span>
                <span>·</span>
                <span>IP: {alert.ip}</span>
                <span>·</span>
                <span>Geo: {alert.geo}</span>
                <span>·</span>
                <span>{alert.time}</span>
                <span>·</span>
                <span>{alert.threatDbCount} db references</span>
              </div>
            </div>

            {/* Action button or auto-mitigated badge */}
            <div className="mt-3">
              {alert.status === 'ACTION_REQUIRED' ? (
                <button
                  onClick={() => onAction?.(alert.id)}
                  className={`px-3 py-1.5 text-xs font-mono rounded border transition-all ${colors.text} ${colors.border} hover:${colors.bg}`}
                >
                  ACTION REQUIRED
                </button>
              ) : (
                <span className="px-3 py-1.5 text-xs font-mono rounded bg-em/20 border border-em/30 text-em inline-block">
                  ✓ AUTO-MITIGATED
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertList;

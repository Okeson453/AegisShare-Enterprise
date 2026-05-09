import React from 'react';

interface AuditEvent {
    seq: number;
    timestamp: string;
    user: string;
    event: string;
    eventType: 'critical' | 'high' | 'info';
    file: string;
    ip: string;
    geo: string;
    prevHash: string;
    chainHash: string;
    verified: boolean;
    risk: 'low' | 'medium' | 'high';
}

interface AuditTableProps {
    events: AuditEvent[];
    maxHeight?: number;
}

/**
 * AuditTable - Comprehensive 12-column WORM audit log display
 * Shows immutable event records with Merkle chain hashes and compliance verification
 */
const AuditTable: React.FC<AuditTableProps> = ({ events, maxHeight = 600 }) => {
    return (
        <div className="border border-bd rounded-lg overflow-hidden">
            {/* Table wrapper with horizontal scroll for many columns */}
            <div className="overflow-x-auto audit-table-wrapper" style={{ '--max-height': maxHeight + 'px' } as any}>
                <table className="w-full text-xs font-mono">
                    {/* Header */}
                    <thead className="sticky top-0 bg-s2 border-b border-bd">
                        <tr>
                            {[
                                'Seq',
                                'Timestamp',
                                'User',
                                'Event',
                                'File',
                                'IP',
                                'Geo',
                                'UA',
                                'Prev Hash',
                                'Chain Hash',
                                'Verified',
                                'Risk',
                            ].map(header => (
                                <th key={header} className="px-3 py-2 text-left text-t3 font-semibold border-r border-bd last:border-r-0">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody className="divide-y divide-bd">
                        {events.map((event, idx) => (
                            <tr key={idx} className="hover:bg-white/3 transition-colors">
                                {/* Sequence */}
                                <td className="px-3 py-2 text-t3 border-r border-bd">{event.seq}</td>

                                {/* Timestamp */}
                                <td className="px-3 py-2 text-t1 border-r border-bd">{event.timestamp}</td>

                                {/* User */}
                                <td className="px-3 py-2 text-cy border-r border-bd">{event.user}</td>

                                {/* Event Type Badge */}
                                <td className="px-3 py-2 border-r border-bd">
                                    <span
                                        className={`px-1.5 py-0.5 rounded inline-block ${event.eventType === 'critical'
                                                ? 'bg-rd/20 text-rd'
                                                : event.eventType === 'high'
                                                    ? 'bg-am/20 text-am'
                                                    : 'bg-cy/20 text-cy'
                                            }`}
                                    >
                                        {event.eventType.toUpperCase()}
                                    </span>
                                </td>

                                {/* File */}
                                <td className="px-3 py-2 text-t1 border-r border-bd truncate max-w-xs">{event.file}</td>

                                {/* IP */}
                                <td className="px-3 py-2 text-t2 border-r border-bd font-mono text-xs">{event.ip}</td>

                                {/* Geo */}
                                <td className="px-3 py-2 text-t3 border-r border-bd">{event.geo}</td>

                                {/* User Agent */}
                                <td className="px-3 py-2 text-t3 border-r border-bd truncate max-w-xs">Chrome/120</td>

                                {/* Previous Hash */}
                                <td className="px-3 py-2 text-t3 border-r border-bd font-mono text-xs truncate max-w-xs">
                                    {event.prevHash.substring(0, 12)}...
                                </td>

                                {/* Chain Hash */}
                                <td className="px-3 py-2 text-cy hover:text-cy/80 border-r border-bd font-mono text-xs truncate max-w-xs cursor-pointer">
                                    {event.chainHash.substring(0, 12)}...
                                </td>

                                {/* Verified Badge */}
                                <td className="px-3 py-2 border-r border-bd text-em">
                                    {event.verified ? '✓' : '✗'}
                                </td>

                                {/* Risk Level */}
                                <td className="px-3 py-2">
                                    <span
                                        className={`${event.risk === 'high'
                                                ? 'text-rd'
                                                : event.risk === 'medium'
                                                    ? 'text-am'
                                                    : 'text-em'
                                            }`}
                                    >
                                        {event.risk.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditTable;

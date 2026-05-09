import React, { useMemo } from 'react';
import '../../styles/access-control-extension.css';

interface User {
    id: string;
    initials: string;
    name: string;
    role: string;
    email: string;
    fileCount: number;
    geo: string;
    lastSeen: string;
    mfa: boolean;
    sso: boolean;
    riskLevel: 'low' | 'medium' | 'high';
}

interface UserListProps {
    users: User[];
    onManage?: (user: User) => void;
}

/**
 * UserList - Displays user registry with ABAC attributes and risk assessments
 * Shows avatars, roles, compliance flags, and access management controls
 */
const UserList: React.FC<UserListProps> = ({ users, onManage }) => {
    // Calculate statistics
    const stats = useMemo(() => {
        const total = users.length;
        const highRisk = users.filter(u => u.riskLevel === 'high').length;
        const noMfa = users.filter(u => !u.mfa).length;
        const activeSessions = users.filter(u => u.lastSeen.includes('now')).length;

        return { total, highRisk, noMfa, activeSessions };
    }, [users]);

    return (
        <div className="space-y-4">
            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-3">
                {[
                    { label: 'Total Users', value: stats.total, color: 'text-cy' },
                    { label: 'High Risk', value: stats.highRisk, color: 'text-rd' },
                    { label: 'No MFA', value: stats.noMfa, color: 'text-am' },
                    { label: 'Active Sessions', value: stats.activeSessions, color: 'text-em' },
                ].map(stat => (
                    <div key={stat.label} className="p-3 bg-s2 border border-bd rounded-lg">
                        <p className="text-xs text-t3 font-mono mb-1">{stat.label}</p>
                        <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* User List */}
            <div className="border border-bd rounded-lg divide-y divide-bd">
                {users.map(user => (
                    <div key={user.id} className="p-4 hover:bg-white/3 transition-colors">
                        <div className="flex items-center justify-between">
                            {/* User Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-lg bg-cy/20 border border-cy/30 flex items-center justify-center flex-shrink-0">
                                    <span className="font-mono font-bold text-cy text-xs">{user.initials}</span>
                                </div>

                                {/* Details */}
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-medium text-t0">{user.name}</h3>
                                        {!user.mfa && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-am/20 text-am font-mono">
                                                ⚠ NO MFA
                                            </span>
                                        )}
                                        {!user.sso && (
                                            <span className="text-xs px-1.5 py-0.5 rounded bg-rd/20 text-rd font-mono">
                                                ⚠ NO SSO
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-t3 font-mono">
                                        {user.role} · {user.email} · {user.fileCount} files · {user.geo} · {user.lastSeen}
                                    </p>
                                </div>
                            </div>

                            {/* Risk Badge & Manage Button */}
                            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                                <span
                                    className={`text-xs font-mono px-2 py-1 rounded border ${user.riskLevel === 'high'
                                            ? 'bg-rd/20 border-rd/30 text-rd'
                                            : user.riskLevel === 'medium'
                                                ? 'bg-am/20 border-am/30 text-am'
                                                : 'bg-em/20 border-em/30 text-em'
                                        }`}
                                >
                                    {user.riskLevel.toUpperCase()}
                                </span>
                                {onManage && (
                                    <button
                                        onClick={() => onManage(user)}
                                        className="px-3 py-1.5 bg-cy/10 text-cy border border-cy/20 rounded text-xs font-mono hover:bg-cy/20 transition-all"
                                    >
                                        Manage
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserList;

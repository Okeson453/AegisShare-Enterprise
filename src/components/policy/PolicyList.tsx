import React from 'react';

// Policy type definitions
interface PolicyRule {
  id: string;
  effect: 'allow' | 'deny';
  name: string;
  description: string;
  conditions: Array<{
    key: string;
    operator: string;
    value: string;
  }>;
}

interface PolicyListProps {
  policies: PolicyRule[];
  onEdit?: (policy: PolicyRule) => void;
}

/**
 * PolicyList - Renders attribute-based access control (ABAC) rules in card format
 * Displays effect badges, conditions, and allows policy editing/creation
 */
const PolicyList: React.FC<PolicyListProps> = ({ policies, onEdit }) => {
  return (
    <div className="space-y-3">
      {policies.map(policy => (
        <div
          key={policy.id}
          className={`p-4 border rounded-lg transition-all hover:border-opacity-100 ${
            policy.effect === 'allow'
              ? 'border-l-4 border-l-em border-em/10 bg-em/3'
              : 'border-l-4 border-l-rd border-rd/10 bg-rd/3'
          }`}
        >
          {/* Policy Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`px-2 py-0.5 text-xs font-mono rounded border ${
                    policy.effect === 'allow'
                      ? 'bg-em/10 border-em/30 text-em'
                      : 'bg-rd/10 border-rd/30 text-rd'
                  }`}
                >
                  {policy.effect.toUpperCase()}
                </span>
                <h3 className="text-sm font-semibold text-t0">{policy.name}</h3>
              </div>
              <p className="text-xs text-t3">{policy.description}</p>
            </div>
            {onEdit && (
              <button
                onClick={() => onEdit(policy)}
                className="ml-4 px-2 py-1 text-xs font-mono rounded bg-cy/10 border border-cy/20 text-cy hover:border-cy/40 transition-all"
              >
                Edit
              </button>
            )}
          </div>

          {/* Conditions display */}
          <div className="space-y-1">
            {policy.conditions.map((condition, idx) => (
              <div key={idx} className="text-xs font-mono flex items-center gap-2">
                <span className="text-cy">{condition.key}</span>
                <span className="text-am">{condition.operator}</span>
                <span className="text-em">"{condition.value}"</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* New Rule Button */}
      <button className="w-full p-4 border-2 border-dashed border-bd hover:border-cy/50 rounded-lg text-cy text-sm font-mono transition-all">
        + New Rule
      </button>
    </div>
  );
};

export default PolicyList;

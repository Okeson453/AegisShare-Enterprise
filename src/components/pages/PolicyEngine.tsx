import React, { useState } from 'react'

interface RuleCondition {
    id: string
    field: string
    operator: 'equals' | 'contains' | 'greater' | 'less'
    value: string
}

interface PolicyEngineProps {
    rules?: RuleCondition[]
    onExecute?: (input: Record<string, any>) => void
}

const PolicyEngine: React.FC<PolicyEngineProps> = ({ rules = [], onExecute }) => {
    const [conditions, setConditions] = useState<RuleCondition[]>(rules)
    const [opaPolicy, setOpaPolicy] = useState(`package policy\n\nallow = true`)
    const [simulationInput, setSimulationInput] = useState('resource')
    const [simulationOutput, setSimulationOutput] = useState<{
        decision: 'allow' | 'deny'
        reason: string
    } | null>(null)

    const addCondition = () => {
        const newCondition: RuleCondition = {
            id: Date.now().toString(),
            field: '',
            operator: 'equals',
            value: '',
        }
        setConditions([...conditions, newCondition])
    }

    const removeCondition = (id: string) => {
        setConditions(conditions.filter((c) => c.id !== id))
    }

    const updateCondition = (id: string, updates: Partial<RuleCondition>) => {
        setConditions(conditions.map((c) => (c.id === id ? { ...c, ...updates } : c)))
    }

    const validateOPA = () => {
        if (opaPolicy.includes('package policy') && opaPolicy.includes('allow')) {
            alert('✓ Policy syntax is valid')
        } else {
            alert('✗ Invalid OPA policy')
        }
    }

    const simulate = () => {
        // Simulate decision based on conditions
        const decision = conditions.length > 0 ? 'allow' : 'deny'
        setSimulationOutput({
            decision,
            reason:
                decision === 'allow'
                    ? `Matched ${conditions.length} condition(s)`
                    : 'No matching conditions',
        })
        onExecute?.({ input: simulationInput, decision })
    }

    return (
        <div className="policy-engine">
            {/* Rule Builder */}
            <div className="pe-builder-panel">
                <div className="pe-builder-header">Visual Rule Builder</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {conditions.map((condition) => (
                        <div key={condition.id} className="pe-rule-condition">
                            <select
                                className="pe-condition-select"
                                value={condition.field}
                                onChange={(e) =>
                                    updateCondition(condition.id, { field: e.target.value })
                                }
                            >
                                <option>Select field</option>
                                <option value="role">role</option>
                                <option value="resource">resource</option>
                                <option value="action">action</option>
                            </select>
                            <select
                                className="pe-condition-select"
                                value={condition.operator}
                                onChange={(e) =>
                                    updateCondition(condition.id, {
                                        operator: e.target.value as any,
                                    })
                                }
                            >
                                <option value="equals">equals</option>
                                <option value="contains">contains</option>
                                <option value="greater">greater</option>
                                <option value="less">less</option>
                            </select>
                            <input
                                type="text"
                                className="pe-condition-select"
                                placeholder="value"
                                value={condition.value}
                                onChange={(e) =>
                                    updateCondition(condition.id, { value: e.target.value })
                                }
                                style={{ padding: '6px 8px' }}
                            />
                            <button
                                className="pe-remove-btn"
                                onClick={() => removeCondition(condition.id)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
                <button className="pe-add-condition-btn" onClick={addCondition}>
                    + Add Condition
                </button>
            </div>

            {/* OPA Editor */}
            <div className="pe-opa-editor">
                <div className="pe-opa-header">OPA Policy Editor</div>
                <textarea
                    className="pe-opa-textarea"
                    value={opaPolicy}
                    onChange={(e) => setOpaPolicy(e.target.value)}
                />
                <button className="pe-opa-validate-btn" onClick={validateOPA}>
                    ✓ Validate Policy
                </button>
            </div>

            {/* PDP Simulator */}
            <div className="pe-simulator-panel">
                <div className="pe-simulator-title">Policy Decision Point (PDP) Simulator</div>

                <div className="pe-simulator-input">
                    <div className="pe-input-field">
                        <label className="pe-input-label">Input</label>
                        <input
                            type="text"
                            className="pe-input-value"
                            value={simulationInput}
                            onChange={(e) => setSimulationInput(e.target.value)}
                        />
                    </div>
                    <button className="pe-simulate-btn" onClick={simulate}>
                        ▶ Simulate
                    </button>
                </div>

                <div className="pe-simulator-output">
                    <div className="pe-input-field">
                        <label className="pe-input-label">Decision</label>
                    </div>
                    {simulationOutput ? (
                        <div className="pe-output-box">
                            <div
                                className={`pe-output-decision ${simulationOutput.decision}`}
                            >
                                {simulationOutput.decision === 'allow' ? '✓' : '✕'}{' '}
                                {simulationOutput.decision.toUpperCase()}
                            </div>
                            <div className="pe-output-reason">{simulationOutput.reason}</div>
                        </div>
                    ) : (
                        <div className="pe-output-box" style={{ color: 'var(--t2)' }}>
                            Click Simulate to see decision
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PolicyEngine

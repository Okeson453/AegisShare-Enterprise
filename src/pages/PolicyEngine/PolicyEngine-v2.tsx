// @ts-nocheck
import React, { useState, useRef } from 'react';
import { Card, Button, Badge, DataGrid, Modal, Select, Collapse } from '@/components/ui';
import useUiStore from '@/store/useUiStore';
import '../../styles/policy-engine.css';

type TableColumn<T> = {
    key: keyof T
    label: string
    width?: number
    flex?: number
    render?: (value: any, row: T) => React.ReactNode
}

interface PolicyRule {
    id: string;
    name: string;
    effect: 'Allow' | 'Deny';
    conditions: PolicyCondition[];
    actions: PolicyAction[];
    createdAt: string;
    lastModified: string;
    priority: number;
    conflicts?: string[];
}

interface PolicyAction {
    id: string;
    type: 'audit' | 'mfa' | 'siem';
    enabled: boolean;
}

interface PolicyCondition {
    id: string;
    attribute: string;
    operator: 'equals' | 'not-equals' | 'contains' | 'starts-with' | 'greater-than' | 'less-than';
    value: string;
}

interface ShareObject {
    id: string;
    name: string;
    type: 'file' | 'folder' | 'dataset' | 'report';
    owner: string;
    sharedWith: number;
    permissions: 'read' | 'write' | 'admin';
    lastShared: string;
    classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

interface PDPInput {
    subject: string;
    action: string;
    resource: string;
    attributes: Record<string, string>;
}

interface PDPTrace {
    step: number;
    rule: string;
    condition: string;
    result: boolean;
    reasoning: string;
}

interface PDPResult {
    decision: 'Permit' | 'Deny';
    reason: string;
    evaluatedAt: string;
    matchedRule: string | null;
    trace: PDPTrace[];
    executionTime: number;
}

interface ImpactAnalysis {
    allowedCount: number;
    deniedCount: number;
    affectedRules: string[];
}

const initialRules: PolicyRule[] = [
    {
        id: 'rule-1',
        name: 'Admin Full Access',
        effect: 'Allow',
        conditions: [
            { id: 'c1', attribute: 'role', operator: 'equals', value: 'admin' }
        ],
        actions: [
            { id: 'a1', type: 'audit', enabled: true },
            { id: 'a2', type: 'mfa', enabled: false },
            { id: 'a3', type: 'siem', enabled: false }
        ],
        createdAt: '2024-01-15',
        lastModified: '2024-01-20',
        priority: 100
    },
    {
        id: 'rule-2',
        name: 'Viewer Read-Only',
        effect: 'Allow',
        conditions: [
            { id: 'c2', attribute: 'role', operator: 'equals', value: 'viewer' },
            { id: 'c3', attribute: 'action', operator: 'equals', value: 'read' }
        ],
        actions: [
            { id: 'a4', type: 'audit', enabled: true },
            { id: 'a5', type: 'mfa', enabled: false },
            { id: 'a6', type: 'siem', enabled: false }
        ],
        createdAt: '2024-01-18',
        lastModified: '2024-01-19',
        priority: 50
    },
    {
        id: 'rule-3',
        name: 'Deny External Access After Hours',
        effect: 'Deny',
        conditions: [
            { id: 'c4', attribute: 'source', operator: 'equals', value: 'external' },
            { id: 'c5', attribute: 'time', operator: 'greater-than', value: '18:00' }
        ],
        actions: [
            { id: 'a7', type: 'audit', enabled: true },
            { id: 'a8', type: 'mfa', enabled: false },
            { id: 'a9', type: 'siem', enabled: true }
        ],
        createdAt: '2024-01-20',
        lastModified: '2024-01-20',
        priority: 75
    }
];

const shareObjects: ShareObject[] = [
    {
        id: 'so-1',
        name: 'Q4_Financial_Report.pdf',
        type: 'file',
        owner: 'financial-team',
        sharedWith: 12,
        permissions: 'read',
        lastShared: '2024-01-21',
        classification: 'confidential'
    },
    {
        id: 'so-2',
        name: 'Customer_Data_Vault',
        type: 'folder',
        owner: 'data-admin',
        sharedWith: 45,
        permissions: 'read',
        lastShared: '2024-01-20',
        classification: 'restricted'
    },
    {
        id: 'so-3',
        name: 'Product_Roadmap_2024',
        type: 'report',
        owner: 'product-team',
        sharedWith: 8,
        permissions: 'write',
        lastShared: '2024-01-19',
        classification: 'confidential'
    },
];

const syntaxHighlightRegoCode = (code: string) => {
    const keywords = /\b(package|import|as|else|data|default|some|in|contains|if|not|with|all|exists|test)\b/g;
    const functions = /\b(print|count|sum|max|min|rand|uuid|now|format|concat|split|startswith|endswith|regex|match|contains|inside|type|length|keys|values|walk|range|sort|reverse|unique|group_by|sort_by|min_by|max_by|any|all)\b/g;
    const strings = /"[^"]*"|'[^']*'/g;
    const comments = /#[^\n]*/g;

    let highlighted = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    highlighted = highlighted.replace(comments, '<span class="pe-syntax-comment">$&</span>');
    highlighted = highlighted.replace(strings, '<span class="pe-syntax-string">$&</span>');
    highlighted = highlighted.replace(functions, '<span class="pe-syntax-function">$&</span>');
    highlighted = highlighted.replace(keywords, '<span class="pe-syntax-keyword">$&</span>');

    return highlighted;
};

function PolicyEngineComponent() {
    const { activeTab, setActiveTab } = useUiStore();
    const [rules, setRules] = useState<PolicyRule[]>(initialRules);
    const [selectedRules, setSelectedRules] = useState<string[]>([]);
    const [selectedRule, setSelectedRule] = useState<PolicyRule | null>(null);
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [editingRule, setEditingRule] = useState<PolicyRule | null>(null);
    const [newRuleName, setNewRuleName] = useState('');
    const [newRuleEffect, setNewRuleEffect] = useState<'Allow' | 'Deny'>('Allow');
    const [newOpaCode, setNewOpaCode] = useState('package policies\n\nallow_admin {\n  input.subject.role == "admin"\n}');
    const [opaValidation, setOpaValidation] = useState<{ valid: boolean; errors: string[] }>({ valid: true, errors: [] });
    const [showOpaEditor, setShowOpaEditor] = useState(false);
    const [simulatorInput, setSimulatorInput] = useState<PDPInput>({
        subject: 'user-123',
        action: 'read',
        resource: 'file-456',
        attributes: { role: 'analyst', source: 'internal', time: '14:30' }
    });
    const [simulatorResult, setSimulatorResult] = useState<PDPResult | null>(null);
    const [impactAnalysis, setImpactAnalysis] = useState<ImpactAnalysis | null>(null);
    const [draggedCondition, setDraggedCondition] = useState<{ ruleId: string; conditionId: string } | null>(null);
    const [selectedActions, setSelectedActions] = useState<Record<string, boolean>>({});

    const handleAddCondition = (ruleId: string) => {
        setRules(rules.map(r => {
            if (r.id === ruleId) {
                return {
                    ...r,
                    conditions: [
                        ...r.conditions,
                        {
                            id: `c-${Date.now()}`,
                            attribute: 'department',
                            operator: 'equals',
                            value: ''
                        }
                    ]
                };
            }
            return r;
        }));
    };

    const handleUpdateCondition = (ruleId: string, conditionId: string, field: string, value: string) => {
        setRules(rules.map(r => {
            if (r.id === ruleId) {
                return {
                    ...r,
                    conditions: r.conditions.map(c =>
                        c.id === conditionId ? { ...c, [field]: value } : c
                    )
                };
            }
            return r;
        }));
    };

    const handleRemoveCondition = (ruleId: string, conditionId: string) => {
        setRules(rules.map(r => {
            if (r.id === ruleId) {
                return {
                    ...r,
                    conditions: r.conditions.filter(c => c.id !== conditionId)
                };
            }
            return r;
        }));
    };

    const handleDragCondition = (ruleId: string, conditionId: string) => {
        setDraggedCondition({ ruleId, conditionId });
    };

    const handleDropCondition = (ruleId: string, targetIdx: number) => {
        if (!draggedCondition) return;
        if (draggedCondition.ruleId !== ruleId) return;

        setRules(rules.map(r => {
            if (r.id === ruleId) {
                const conditions = [...r.conditions];
                const draggedIdx = conditions.findIndex(c => c.id === draggedCondition.conditionId);
                const [removed] = conditions.splice(draggedIdx, 1);
                conditions.splice(targetIdx, 0, removed);
                return { ...r, conditions };
            }
            return r;
        }));
        setDraggedCondition(null);
    };

    const handleToggleAction = (ruleId: string, actionId: string) => {
        setRules(rules.map(r => {
            if (r.id === ruleId) {
                return {
                    ...r,
                    actions: r.actions.map(a =>
                        a.id === actionId ? { ...a, enabled: !a.enabled } : a
                    )
                };
            }
            return r;
        }));
    };

    const validateOpaCode = () => {
        const lines = newOpaCode.split('\n');
        const errors: string[] = [];
        let valid = true;

        if (!lines[0].includes('package')) {
            errors.push('Line 1: Missing "package" declaration');
            valid = false;
        }

        // Check for basic syntax errors
        let braceCount = 0;
        lines.forEach((line, idx) => {
            braceCount += (line.match(/{/g) || []).length;
            braceCount -= (line.match(/}/g) || []).length;
        });

        if (braceCount !== 0) {
            errors.push(`Mismatched braces: ${braceCount > 0 ? 'missing closing' : 'extra closing'} brace`);
            valid = false;
        }

        setOpaValidation({ valid, errors });
        return valid;
    };

    const handleFormatOpa = () => {
        const formatted = newOpaCode
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
        setNewOpaCode(formatted);
    };

    const handleDryRun = () => {
        const analysis: ImpactAnalysis = {
            allowedCount: Math.floor(Math.random() * 150) + 50,
            deniedCount: Math.floor(Math.random() * 30) + 5,
            affectedRules: rules.slice(0, 2).map(r => r.name)
        };
        setImpactAnalysis(analysis);
    };

    const evaluatePDP = () => {
        const startTime = performance.now();
        const trace: PDPTrace[] = [];
        let decision: 'Permit' | 'Deny' = 'Deny';
        let matchedRule: string | null = null;
        let reasoning = 'No matching rules found';

        const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

        for (const rule of sortedRules) {
            let allConditionsMet = true;

            for (let i = 0; i < rule.conditions.length; i++) {
                const cond = rule.conditions[i];
                const attrValue = simulatorInput.attributes[cond.attribute] || '';
                let condResult = false;

                switch (cond.operator) {
                    case 'equals':
                        condResult = attrValue === cond.value;
                        break;
                    case 'not-equals':
                        condResult = attrValue !== cond.value;
                        break;
                    case 'contains':
                        condResult = attrValue.includes(cond.value);
                        break;
                    case 'starts-with':
                        condResult = attrValue.startsWith(cond.value);
                        break;
                    case 'greater-than':
                        condResult = parseInt(attrValue) > parseInt(cond.value);
                        break;
                    case 'less-than':
                        condResult = parseInt(attrValue) < parseInt(cond.value);
                        break;
                }

                trace.push({
                    step: trace.length + 1,
                    rule: rule.name,
                    condition: `${cond.attribute} ${cond.operator} ${cond.value}`,
                    result: condResult,
                    reasoning: `${cond.attribute}="${attrValue}" ${cond.operator} "${cond.value}"`
                });

                if (!condResult) {
                    allConditionsMet = false;
                    break;
                }
            }

            if (allConditionsMet) {
                decision = rule.effect === 'Allow' ? 'Permit' : 'Deny';
                matchedRule = rule.name;
                reasoning = `Matched rule: ${rule.name} (${rule.effect})`;
                break;
            }
        }

        const endTime = performance.now();
        const executionTime = Math.round((endTime - startTime) * 100) / 100;

        setSimulatorResult({
            decision,
            reason: reasoning,
            evaluatedAt: new Date().toLocaleTimeString(),
            matchedRule,
            trace,
            executionTime
        });
    };

    const renderDecisionTrace = (trace: PDPTrace[]) => {
        return (
            <div className="pe-trace-waterfall">
                {trace.map((step, idx) => (
                    <div
                        key={step.step}
                        className={`pe-trace-step pe-trace-step-${step.result ? 'pass' : 'fail'}`}
                        style={{ animationDelay: `${idx * 80}ms` }}
                    >
                        <div className="pe-step-circle">{step.step}</div>
                        <div className="pe-step-content">
                            <div className="pe-step-condition">{step.condition}</div>
                            <div className="pe-step-reasoning">{step.reasoning}</div>
                        </div>
                        <div className={`pe-step-result pe-result-${step.result}`}>
                            {step.result ? '✓' : '✗'}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const operatorOptions = ['equals', 'not-equals', 'contains', 'starts-with', 'greater-than', 'less-than'];

    return (
        <div className="policy-engine">
            <div className="pe-header">
                <h1 className="pe-breadcrumb">Policy Engine</h1>
                <div className="pe-tabs">
                    <button
                        className={`pe-tab ${activeTab === 'rules' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rules')}
                    >
                        Rules
                    </button>
                    <button
                        className={`pe-tab ${activeTab === 'opa' ? 'active' : ''}`}
                        onClick={() => setActiveTab('opa')}
                    >
                        OPA Rego
                    </button>
                    <button
                        className={`pe-tab ${activeTab === 'simulator' ? 'active' : ''}`}
                        onClick={() => setActiveTab('simulator')}
                    >
                        Simulator
                    </button>
                </div>
            </div>

            {activeTab === 'rules' && (
                <div className="pe-rules">
                    <div className="pe-section">
                        <div className="pe-section-header">
                            <h3>Policy Rules (Visual Editor)</h3>
                            <span className="pe-rule-count">{rules.length} total</span>
                            <button onClick={() => { setEditingRule(null); setShowRuleModal(true); }} className="pe-btn pe-btn-primary">
                                + New Rule
                            </button>
                        </div>

                        {rules.map(rule => (
                            <div key={rule.id} className="pe-rule-card">
                                <div className="pe-rule-header">
                                    <div className="pe-rule-title">
                                        <Badge severity={rule.effect === 'Allow' ? 'success' : 'error'}>{rule.effect}</Badge>
                                        <h4>{rule.name}</h4>
                                        <span className="pe-priority">Priority {rule.priority}</span>
                                    </div>
                                    <div className="pe-rule-actions">
                                        <button
                                            className="pe-btn-icon"
                                            onClick={() => { setEditingRule(rule); setShowRuleModal(true); }}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="pe-btn-icon"
                                            onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div className="pe-conditions">
                                    <h5>Conditions (drag to reorder)</h5>
                                    {rule.conditions.map((cond, idx) => (
                                        <div
                                            key={cond.id}
                                            className="pe-condition-editor"
                                            draggable
                                            onDragStart={() => handleDragCondition(rule.id, cond.id)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleDropCondition(rule.id, idx)}
                                        >
                                            <span className="pe-drag-handle">⋮⋮</span>
                                            <input
                                                type="text"
                                                value={cond.attribute}
                                                onChange={(e) => handleUpdateCondition(rule.id, cond.id, 'attribute', e.target.value)}
                                                placeholder="Attribute"
                                                className="pe-cond-input"
                                            />
                                            <select
                                                value={cond.operator}
                                                onChange={(e) => handleUpdateCondition(rule.id, cond.id, 'operator', e.target.value)}
                                                className="pe-cond-select"
                                            >
                                                {operatorOptions.map(op => (
                                                    <option key={op} value={op}>{op}</option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                value={cond.value}
                                                onChange={(e) => handleUpdateCondition(rule.id, cond.id, 'value', e.target.value)}
                                                placeholder="Value"
                                                className="pe-cond-input"
                                            />
                                            <button
                                                className="pe-btn-icon"
                                                onClick={() => handleRemoveCondition(rule.id, cond.id)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className="pe-btn-sm"
                                        onClick={() => handleAddCondition(rule.id)}
                                    >
                                        + Add Condition
                                    </button>
                                </div>

                                <div className="pe-actions">
                                    <h5>Actions</h5>
                                    <div className="pe-action-checks">
                                        {rule.actions.map(action => (
                                            <label key={action.id} className="pe-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={action.enabled}
                                                    onChange={() => handleToggleAction(rule.id, action.id)}
                                                />
                                                <span>
                                                    {action.type === 'audit' && '📋 Log to Audit'}
                                                    {action.type === 'mfa' && '🔐 Require MFA re-challenge'}
                                                    {action.type === 'siem' && '🚨 Trigger SIEM alert'}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pe-actions-row">
                            <button className="pe-btn pe-btn-secondary" onClick={handleDryRun}>
                                🧪 Dry Run (Impact Analysis)
                            </button>
                        </div>

                        {impactAnalysis && (
                            <div className="pe-impact-analysis">
                                <h4>Impact Analysis</h4>
                                <div className="pe-impact-cards">
                                    <div className="pe-impact-card">
                                        <div className="pe-impact-value pe-value-allow">{impactAnalysis.allowedCount}</div>
                                        <div className="pe-impact-label">Expected to Allow</div>
                                    </div>
                                    <div className="pe-impact-card">
                                        <div className="pe-impact-value pe-value-deny">{impactAnalysis.deniedCount}</div>
                                        <div className="pe-impact-label">Expected to Deny</div>
                                    </div>
                                </div>
                                <div className="pe-affected-rules">
                                    <strong>Affected Rules:</strong> {impactAnalysis.affectedRules.join(', ')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'opa' && (
                <div className="pe-opa">
                    <div className="pe-section">
                        <div className="pe-section-header">
                            <h3>OPA Rego Policy Editor</h3>
                            <div className="pe-opa-buttons">
                                <button className="pe-btn pe-btn-secondary" onClick={handleFormatOpa}>
                                    Format
                                </button>
                                <button className="pe-btn pe-btn-secondary" onClick={validateOpaCode}>
                                    Validate
                                </button>
                                <button className="pe-btn pe-btn-primary">
                                    Test
                                </button>
                            </div>
                        </div>

                        <div className="pe-opa-editor">
                            <div className="pe-opa-gutter">
                                {newOpaCode.split('\n').map((_, idx) => (
                                    <div key={idx} className="pe-gutter-line">
                                        <span className="pe-line-number">{idx + 1}</span>
                                    </div>
                                ))}
                            </div>
                            <textarea
                                value={newOpaCode}
                                onChange={(e) => setNewOpaCode(e.target.value)}
                                className="pe-opa-textarea"
                                spellCheck="false"
                            />
                        </div>

                        {opaValidation.valid ? (
                            <div className="pe-output-pane pe-output-valid">
                                <span>✓ Valid Rego syntax</span>
                            </div>
                        ) : (
                            <div className="pe-output-pane pe-output-error">
                                <span>✗ {opaValidation.errors.length} error(s)</span>
                                {opaValidation.errors.map((err, idx) => (
                                    <div key={idx} className="pe-error-line">{err}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'simulator' && (
                <div className="pe-simulator">
                    <div className="pe-sim-container">
                        <div className="pe-section">
                            <div className="pe-section-header">
                                <h3>Policy Decision Point (PDP) Simulator</h3>
                            </div>

                            <div className="pe-sim-input">
                                <h5>Request Input</h5>
                                <div className="pe-sim-form">
                                    <label>
                                        <span>Subject</span>
                                        <input
                                            type="text"
                                            value={simulatorInput.subject}
                                            onChange={(e) =>
                                                setSimulatorInput({ ...simulatorInput, subject: e.target.value })
                                            }
                                            className="pe-input"
                                        />
                                    </label>
                                    <label>
                                        <span>Action</span>
                                        <input
                                            type="text"
                                            value={simulatorInput.action}
                                            onChange={(e) =>
                                                setSimulatorInput({ ...simulatorInput, action: e.target.value })
                                            }
                                            className="pe-input"
                                        />
                                    </label>
                                    <label>
                                        <span>Resource</span>
                                        <input
                                            type="text"
                                            value={simulatorInput.resource}
                                            onChange={(e) =>
                                                setSimulatorInput({ ...simulatorInput, resource: e.target.value })
                                            }
                                            className="pe-input"
                                        />
                                    </label>

                                    <div className="pe-attributes">
                                        <label>Attributes</label>
                                        {Object.entries(simulatorInput.attributes).map(([key, value]) => (
                                            <div key={key} className="pe-attr-row">
                                                <input
                                                    type="text"
                                                    value={key}
                                                    readOnly
                                                    className="pe-attr-key"
                                                />
                                                <input
                                                    type="text"
                                                    value={value}
                                                    onChange={(e) =>
                                                        setSimulatorInput({
                                                            ...simulatorInput,
                                                            attributes: { ...simulatorInput.attributes, [key]: e.target.value }
                                                        })
                                                    }
                                                    className="pe-input"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button onClick={evaluatePDP} className="pe-btn pe-btn-primary pe-btn-lg">
                                        Evaluate Policy
                                    </button>
                                </div>
                            </div>
                        </div>

                        {simulatorResult && (
                            <div className="pe-section">
                                <div className="pe-section-header">
                                    <h3>Evaluation Result</h3>
                                </div>

                                <div className={`pe-decision-box pe-decision-${simulatorResult.decision.toLowerCase()}`}>
                                    <div className="pe-decision-icon">
                                        {simulatorResult.decision === 'Permit' ? '✓' : '✕'}
                                    </div>
                                    <div className="pe-decision-info">
                                        <h4>{simulatorResult.decision}</h4>
                                        <p>{simulatorResult.reason}</p>
                                        <span className="pe-exec-time">Evaluated in {simulatorResult.executionTime}ms</span>
                                    </div>
                                </div>

                                {simulatorResult.decision === 'Deny' && simulatorResult.trace.length > 0 && (
                                    <div className="pe-deny-explanation">
                                        <h5>Why was this denied?</h5>
                                        <p>
                                            {simulatorResult.trace[simulatorResult.trace.length - 1].reasoning}
                                        </p>
                                    </div>
                                )}

                                <div className="pe-trace-section">
                                    <h5>Decision Trace (Step-by-Step)</h5>
                                    {renderDecisionTrace(simulatorResult.trace)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Modal
                isOpen={showRuleModal}
                title={editingRule ? 'Edit Rule' : 'Create New Rule'}
                size="md"
                onClose={() => { setShowRuleModal(false); setEditingRule(null); }}
                footer={
                    <>
                        <Button variant="ghost" onClick={() => { setShowRuleModal(false); setEditingRule(null); }}>Cancel</Button>
                        <Button variant="primary">
                            {editingRule ? 'Update' : 'Create'} Rule
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-t0 mb-1">Rule Name</label>
                        <input
                            type="text"
                            value={newRuleName}
                            onChange={(e) => setNewRuleName(e.target.value)}
                            placeholder="e.g., Admin Full Access"
                            className="w-full px-3 py-2 bg-s3 border border-bd rounded-lg text-t0 placeholder-t2 outline-none focus:border-cy"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-t0 mb-1">Effect</label>
                        <Select
                            options={[
                                { value: 'Allow', label: 'Allow' },
                                { value: 'Deny', label: 'Deny' }
                            ]}
                            value={newRuleEffect}
                            onChange={(val) => setNewRuleEffect(val as 'Allow' | 'Deny')}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default PolicyEngineComponent;

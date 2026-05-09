// @ts-nocheck
import React, { useState } from 'react';
import { Card, Button, Badge, DataGrid, Modal, Select, Collapse, CommandPalette } from '@/components/ui';
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
  createdAt: string;
  lastModified: string;
  priority: number;
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
}

const initialRules: PolicyRule[] = [
  {
    id: 'rule-1',
    name: 'Admin Full Access',
    effect: 'Allow',
    conditions: [
      { id: 'c1', attribute: 'role', operator: 'equals', value: 'admin' }
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
  {
    id: 'so-4',
    name: 'Public_Knowledge_Base',
    type: 'dataset',
    owner: 'documentation',
    sharedWith: 156,
    permissions: 'read',
    lastShared: '2024-01-21',
    classification: 'public'
  },
  {
    id: 'so-5',
    name: 'HR_Employee_Records',
    type: 'folder',
    owner: 'hr-admin',
    sharedWith: 3,
    permissions: 'admin',
    lastShared: '2024-01-15',
    classification: 'restricted'
  }
];

function PolicyEngineComponent() {
  const { activeTab, setActiveTab } = useUiStore();
  const [rules, setRules] = useState<PolicyRule[]>(initialRules);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [selectedRule, setSelectedRule] = useState<PolicyRule | null>(null);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleEffect, setNewRuleEffect] = useState<'Allow' | 'Deny'>('Allow');
  const [simulatorInput, setSimulatorInput] = useState<PDPInput>({
    subject: 'user-123',
    action: 'read',
    resource: 'file-456',
    attributes: { role: 'analyst', department: 'engineering' }
  });
  const [simulatorResult, setSimulatorResult] = useState<PDPResult | null>(null);

  const ruleColumns: TableColumn<PolicyRule>[] = [
    { key: 'name', label: 'Rule Name', flex: 1 },
    {
      key: 'effect', label: 'Effect', width: 80, render: (val) => (
        <Badge severity={val === 'Allow' ? 'success' : 'error'}>{val}</Badge>
      )
    },
    { key: 'priority', label: 'Priority', width: 80 },
    { key: 'createdAt', label: 'Created', width: 100 },
  ]

  const shareColumns: TableColumn<ShareObject>[] = [
    { key: 'name', label: 'Name', flex: 1 },
    { key: 'type', label: 'Type', width: 80 },
    { key: 'owner', label: 'Owner', width: 120 },
    { key: 'sharedWith', label: 'Shared With', width: 80 },
    {
      key: 'permissions', label: 'Permissions', width: 100, render: (val) => (
        <Badge severity="info">{val}</Badge>
      )
    },
  ]

  const handleOpenRuleModal = () => {
    setNewRuleName('');
    setNewRuleEffect('Allow');
    setSelectedRule(null);
    setShowRuleModal(true);
  };

  const handleSaveRule = () => {
    if (newRuleName.trim()) {
      if (selectedRule) {
        setRules(rules.map(r => r.id === selectedRule.id ? { ...r, name: newRuleName, effect: newRuleEffect, lastModified: new Date().toISOString().split('T')[0] } : r));
      } else {
        const newRule: PolicyRule = {
          id: `rule-${Date.now()}`,
          name: newRuleName,
          effect: newRuleEffect,
          conditions: [],
          createdAt: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T')[0],
          priority: Math.max(...rules.map(r => r.priority), 0) + 10
        };
        setRules([...rules, newRule]);
      }
      setShowRuleModal(false);
    }
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

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

  const evaluatePDP = () => {
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

    setSimulatorResult({
      decision,
      reason: reasoning,
      evaluatedAt: new Date().toLocaleTimeString(),
      matchedRule,
      trace
    });
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
            className={`pe-tab ${activeTab === 'shares' ? 'active' : ''}`}
            onClick={() => setActiveTab('shares')}
          >
            Shares
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
              <h3>Policy Rules</h3>
              <span className="pe-rule-count">{rules.length} total</span>
              <button onClick={handleOpenRuleModal} className="pe-btn pe-btn-primary">
                + New Rule
              </button>
              <button onClick={() => setShowCommandPalette(true)} className="pe-btn">
                ⌘ Commands
              </button>
            </div>

            <DataGrid<PolicyRule>
              rows={rules}
              columns={[
                {
                  key: 'name',
                  label: 'Rule Name',
                  width: 200,
                  sortable: true,
                  render: (value, row) => (
                    <div className="flex items-center gap-2">
                      <span className={`pe-effect ${row.effect.toLowerCase()}`}>{row.effect}</span>
                      <span className="text-t0 font-medium">{value}</span>
                    </div>
                  )
                },
                {
                  key: 'priority',
                  label: 'Priority',
                  width: 80,
                  sortable: true,
                  render: (value) => <span className="font-semibold text-cy">{value}</span>
                },
                {
                  key: 'conditions',
                  label: 'Conditions',
                  width: 100,
                  render: (_, row) => <span className="text-t2">{row.conditions.length} conditions</span>
                },
                {
                  key: 'lastModified',
                  label: 'Last Modified',
                  width: 120,
                  render: (value) => <span className="text-t2 text-sm">{value}</span>
                },
              ]}
              striped
              selectable
              selectedRows={selectedRules}
              onSelectionChange={setSelectedRules}
              containerHeight={500}
              onRowClick={(rule) => {
                setEditingRule(rule);
                setNewRuleName(rule.name);
                setNewRuleEffect(rule.effect);
                setShowRuleModal(true);
              }}
            />

            {selectedRules.length > 0 && (
              <div className="pe-bulk-actions mt-4 flex gap-2">
                <button
                  className="pe-btn pe-btn-danger"
                  onClick={() => {
                    setRules(rules.filter(r => !selectedRules.includes(r.id)));
                    setSelectedRules([]);
                  }}
                >
                  Delete Selected ({selectedRules.length})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={showRuleModal}
        title={selectedRule ? 'Edit Rule' : 'Create New Rule'}
        size="md"
        onClose={() => setShowRuleModal(false)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowRuleModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveRule}>
              {selectedRule ? 'Update' : 'Create'} Rule
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

      {activeTab === 'shares' && (
        <div className="pe-shares">
          <div className="pe-section">
            <div className="pe-section-header">
              <h3>Shared Objects</h3>
              <span className="pe-rule-count">{shareObjects.length} total</span>
            </div>

            <DataGrid<ShareObject>
              rows={shareObjects}
              columns={[
                {
                  key: 'name',
                  label: 'Object Name',
                  width: 220,
                  sortable: true,
                  render: (value, row) => (
                    <div className="flex items-center gap-2">
                      <span className={`pe-type-badge pe-type-${row.type}`}>{row.type[0].toUpperCase()}</span>
                      <span className="text-t0 font-medium">{value}</span>
                    </div>
                  )
                },
                {
                  key: 'type',
                  label: 'Type',
                  width: 100,
                  sortable: true,
                  render: (value) => <Badge severity="info">{value}</Badge>
                },
                {
                  key: 'owner',
                  label: 'Owner',
                  width: 140,
                  sortable: true,
                  render: (value) => <span className="text-t1">{value}</span>
                },
                {
                  key: 'sharedWith',
                  label: 'Shared With',
                  width: 100,
                  sortable: true,
                  render: (value) => <span className="font-semibold text-cy">{value} users</span>
                },
                {
                  key: 'permissions',
                  label: 'Permissions',
                  width: 110,
                  sortable: true,
                  render: (value) => {
                    const colorMap = { 'read': 'info', 'write': 'warning', 'admin': 'critical' };
                    return <Badge severity={colorMap[value as keyof typeof colorMap] || 'info'}>{value}</Badge>;
                  }
                },
                {
                  key: 'classification',
                  label: 'Classification',
                  width: 130,
                  sortable: true,
                  render: (value) => {
                    const colorMap = { 'public': 'info', 'internal': 'info', 'confidential': 'warning', 'restricted': 'critical' };
                    return <Badge severity={colorMap[value as keyof typeof colorMap] || 'info'}>{value}</Badge>;
                  }
                },
                {
                  key: 'lastShared',
                  label: 'Last Shared',
                  width: 120,
                  sortable: true,
                  render: (value) => <span className="text-t2 text-sm">{value}</span>
                },
              ]}
              striped
              containerHeight={500}
              onRowClick={(obj) => console.log('View object details:', obj)}
            />
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

                <div className={`pe-decision pe-decision-${simulatorResult.decision.toLowerCase()}`}>
                  <div className="pe-decision-badge">
                    {simulatorResult.decision === 'Permit' ? '✓' : '✕'}
                  </div>
                  <div className="pe-decision-content">
                    <h4>{simulatorResult.decision}</h4>
                    <p>{simulatorResult.reason}</p>
                    <span className="pe-eval-time">{simulatorResult.evaluatedAt}</span>
                  </div>
                </div>

                <div className="pe-trace">
                  <h5>Evaluation Trace</h5>
                  <div className="pe-trace-list">
                    {simulatorResult.trace.map((step) => (
                      <div
                        key={step.step}
                        className={`pe-trace-item pe-trace-${step.result ? 'pass' : 'fail'}`}
                      >
                        <div className="pe-trace-step">{step.step}</div>
                        <div className="pe-trace-details">
                          <div className="pe-trace-condition">{step.condition}</div>
                          <code className="pe-trace-reason">{step.reasoning}</code>
                        </div>
                        <div className={`pe-trace-result pe-result-${step.result ? 'true' : 'false'}`}>
                          {step.result ? '✓' : '✗'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const OpaPolicies: React.FC = () => {
  return (
    <Card>
      <h3 className="text-sm font-semibold text-t0 mb-4">OPA Policy Definitions</h3>
      <div className="space-y-3">
        <div className="bg-s2 p-3 rounded font-mono text-xs text-t2">
          <p className="text-cy mb-2">package aegisshare</p>
          <p>allow['admin_upload'] {'{}'}</p>
          <p className="text-t3 ml-2">user.role == 'admin'</p>
          <p className="text-t3 ml-2">input.action == 'upload'</p>
          <p>{'}'}</p>
        </div>
        <p className="text-sm text-t2">3 policies defined and validated</p>
      </div>
    </Card>
  )
}

const PolicyEngine: React.FC = () => {
  const { activeTab, setActiveTab } = useUiStore()

  return (
    <div>
      <h1 className="text-3xl font-bold text-t0 mb-6">Policy Engine</h1>
      <Tabs
        items={[
          { id: 'abac', label: 'ABAC Rules' },
          { id: 'opa', label: 'OPA Policies' },
          { id: 'pdp', label: 'PDP Simulator' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="mt-6 space-y-4">
        {activeTab === 'abac' && <AbacRules />}
        {activeTab === 'opa' && <OpaPolicies />}
        {activeTab === 'pdp' && <PdpSimulator />}
      </div>
    </div>
  )
}

export default PolicyEngine

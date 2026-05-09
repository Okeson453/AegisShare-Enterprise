/**
 * Component Showcase - Interactive demo page for all AegisShare v4 components
 * Used for development, testing, and documentation purposes
 */

export interface ComponentShowcaseItem {
    category: string
    name: string
    description: string
    component: string
    code: string
    notes?: string
}

export const showcaseItems: ComponentShowcaseItem[] = [
    // UI Components
    {
        category: 'UI Components',
        name: 'Tabs',
        description: 'Multi-section tabbed interface with variants',
        component: 'Tabs component',
        code: '<Tabs items={[{id: "tab1", label: "Overview"}]} activeId="tab1" variant="underline" />',
    },
    {
        category: 'UI Components',
        name: 'Popover',
        description: 'Context menu with placement and trigger modes',
        component: 'Popover component',
        code: '<Popover trigger={<button>Click</button>} content="Popover" placement="top" trigger_type="click" />',
    },
    {
        category: 'UI Components',
        name: 'StatusPill',
        description: 'Status badge with 5 severity levels',
        component: 'StatusPill component',
        code: '<StatusPill status="critical" label="Alert" animate={true} />',
    },
    {
        category: 'UI Components',
        name: 'Drawer',
        description: 'Slide-in side panel for details and forms',
        component: 'Drawer component',
        code: '<Drawer open={true} onClose={() => {}} position="right" title="Settings" />',
    },
    {
        category: 'UI Components',
        name: 'ProgressRing',
        description: 'SVG circular progress indicator',
        component: 'ProgressRing component',
        code: '<ProgressRing value={75} max={100} radius={45} color="var(--cy)" />',
    },
    {
        category: 'UI Components',
        name: 'FilterChip',
        description: 'Active/removable filter pills',
        component: 'FilterChip component',
        code: '<FilterChip label="Active" active={true} removable={true} count={5} />',
    },
    {
        category: 'UI Components',
        name: 'Timeline',
        description: 'Step-by-step progress visualizer',
        component: 'Timeline component',
        code: '<Timeline steps={[{id: "1", step: 1, label: "Step 1", status: "completed"}]} direction="horizontal" />',
    },
    {
        category: 'Pages - Phase 2',
        name: 'CommandCenter',
        description: 'SOC operations dashboard with KPI tracking',
        component: 'CommandCenter',
        code: '<CommandCenter defconLevel={2} kpis={[...]} swimlane={[...]} healthTiles={[...]} />',
        notes: 'Bento grid layout with staggered animations',
    },
    {
        category: 'Pages - Phase 2',
        name: 'ThreatCenter',
        description: 'Threat assessment with MITRE heatmap',
        component: 'ThreatCenter',
        code: '<ThreatCenter mitreMatrix={[...]} baselineData={[...]} geoMap={[...]} playbooks={[...]} />',
        notes: 'Interactive MITRE matrix with baseline anomalies',
    },
    {
        category: 'Pages - Phase 2',
        name: 'SecureVault',
        description: 'Zero-knowledge secret management',
        component: 'SecureVault',
        code: '<SecureVault files={[...]} stats={[...]} uploadWizard={[...]} detailPanel={[...]} />',
        notes: 'Multi-tab detail panel with progress tracking',
    },
    {
        category: 'Pages - Phase 3',
        name: 'AuditLedger',
        description: 'Merkle chain visualization with timeline',
        component: 'AuditLedger',
        code: '<AuditLedger merkleNodes={[...]} auditEntries={[...]} siemFormat="json" />',
        notes: 'Immutable audit trail with SIEM export',
    },
    {
        category: 'Pages - Phase 3',
        name: 'KeyManagement',
        description: 'Key hierarchy with rotation scheduling',
        component: 'KeyManagement',
        code: '<KeyManagement keyTree={[...]} rotationSchedule={[...]} hsmDevices={[...]} />',
        notes: 'Interactive key tree with Gantt timeline',
    },
    {
        category: 'Pages - Phase 3',
        name: 'AccessControl',
        description: 'User access matrix with risk scoring',
        component: 'AccessControl',
        code: '<AccessControl users={[...]} rbacMatrix={[...]} riskScores={[...]} />',
        notes: 'JIT access request panel with approval workflow',
    },
    {
        category: 'Pages - Phase 4',
        name: 'PolicyEngine',
        description: 'Visual rule builder with OPA editor',
        component: 'PolicyEngine',
        code: '<PolicyEngine rules={[...]} opaPolicy="package policy" onExecute={handleSimulation} />',
        notes: 'PDP simulator for decision testing',
    },
    {
        category: 'Pages - Phase 4',
        name: 'ComplianceHub',
        description: 'Multi-framework compliance tracking',
        component: 'ComplianceHub',
        code: '<ComplianceHub frameworks={[...]} controls={[...]} />',
        notes: 'Arc gauges for compliance scoring',
    },
    {
        category: 'Pages - Phase 4',
        name: 'Configuration',
        description: 'Profile presets with diff viewer',
        component: 'Configuration',
        code: '<Configuration presets={[...]} currentSettings={[...]} />',
        notes: 'Unsaved changes banner with diff view',
    },
    {
        category: 'Pages - Phase 4',
        name: 'AdminConsole',
        description: 'System topology with SLA gauges',
        component: 'AdminConsole',
        code: '<AdminConsole slaMetrics={[...]} securityScores={[...]} drSteps={[...]} />',
        notes: '5-step disaster recovery wizard',
    },
    {
        category: 'Enhancements',
        name: 'DashboardBuilder',
        description: 'Customizable dashboard layout system',
        component: 'DashboardBuilder',
        code: '<DashboardBuilder widgets={[...]} editable={true} onSave={handleSave} />',
        notes: 'Drag-to-reorder widget layout',
    },
]

/**
 * Get showcase items by category
 */
export function getShowcasesByCategory(category: string) {
    return showcaseItems.filter((item) => item.category === category)
}

/**
 * Get all unique categories
 */
export function getCategories() {
    return Array.from(new Set(showcaseItems.map((item) => item.category)))
}

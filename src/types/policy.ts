export interface Policy {
    id: string
    name: string
    effect: PolicyEffect
    conditions: Condition[]
    priority: number
    createdAt: string
    updatedAt: string
}

export type PolicyEffect = 'ALLOW' | 'DENY'

export interface Condition {
    operator: string
    attribute: string
    value: string | string[]
}

export interface PdpRequest {
    subject: { id: string; role: string; mfa: boolean }
    resource: { type: string; id: string; classification: string }
    action: string
    environment: { time: string; geo: string }
    context?: object
}

export interface PdpTraceStep {
    step: number
    rule: string
    matched: boolean
    reason: string
}

export interface PdpResult {
    decision: 'ALLOW' | 'DENY'
    evaluationTime?: number
    evalTime: number
    appliedPolicies?: string[]
    matchedRule?: string
    trace?: PdpTraceStep[]
    latencyMs?: number
    reasons?: string[]
}

export interface OpaDecision {
    allow: boolean
    explanation: string
}

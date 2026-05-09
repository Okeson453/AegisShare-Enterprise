import React, { useState, useEffect } from 'react';

interface PolicySimulatorProps {
    onSimulate?: (result: { decision: string; evalTime: number }) => void;
}

/**
 * PolicySimulator - Interactive policy decision point (PDP) simulator
 * Allows editing request JSON and running ABAC evaluations with animated step reveal
 */
const PolicySimulator: React.FC<PolicySimulatorProps> = ({ onSimulate }) => {
    const [requestJson, setRequestJson] = useState(
        JSON.stringify(
            {
                subject: { id: 'user_001', role: 'finance', mfa: true },
                action: 'file_download',
                resource: { type: 'file', id: 'file_123', classification: 'confidential' },
                environment: { time: '2026-03-20T14:30:00Z', geo: 'EU' },
            },
            null,
            2
        )
    );

    const [evaluation, setEvaluation] = useState<{
        decision: string;
        evalTime: number;
        steps: Array<{ step: string; result: string }>;
    } | null>(null);

    const handleRunSimulation = () => {
        try {
            JSON.parse(requestJson); // Validate JSON
            // Simulate evaluation flow
            setEvaluation({
                decision: 'ALLOW',
                evalTime: 11.3,
                steps: [
                    { step: 'Auth Check', result: 'pass' },
                    { step: 'RBAC Evaluation', result: 'pass' },
                    { step: 'ABAC Rules', result: 'pass' },
                    { step: 'Audit Log', result: 'recorded' },
                    { step: 'Final Decision', result: 'ALLOW' },
                ],
            });
            onSimulate?.({ decision: 'ALLOW', evalTime: 11.3 });
        } catch (_e) {
            alert('Invalid JSON request');
        }
    };

    return (
        <div className="space-y-4">
            {/* Request JSON Editor */}
            <div>
                <label className="text-xs font-mono text-t3 uppercase tracking-wider block mb-2">
                    PDP Request (JSON)
                </label>
                <textarea
                    value={requestJson}
                    onChange={e => setRequestJson(e.target.value)}
                    aria-label="PDP Request JSON"
                    className="w-full h-48 p-3 bg-s2 border border-bd rounded font-mono text-xs text-t0 focus:border-cy/50 focus:outline-none resize-none"
                />
            </div>

            {/* Run Button */}
            <button
                onClick={handleRunSimulation}
                className="w-full px-4 py-2 bg-cy text-bg rounded font-mono text-sm font-semibold hover:opacity-90 transition-all"
            >
                Run Simulation
            </button>

            {/* Evaluation Results */}
            {evaluation && (
                <div className="space-y-3 p-4 bg-s1 border border-bd rounded-lg">
                    {/* Decision Card */}
                    <div
                        className={`px-4 py-3 rounded-lg border ${evaluation.decision === 'ALLOW'
                            ? 'bg-em/10 border-em/30'
                            : 'bg-rd/10 border-rd/30'
                            }`}
                    >
                        <p className="text-xs text-t3 font-mono mb-1">Final Decision</p>
                        <p className={`text-xl font-bold ${evaluation.decision === 'ALLOW' ? 'text-em' : 'text-rd'}`}>
                            {evaluation.decision}
                        </p>
                        <p className="text-xs text-t3 mt-2">Policy ID: pol_fin_read · Eval time: {evaluation.evalTime}ms</p>
                    </div>

                    {/* Evaluation Steps */}
                    <div className="space-y-1">
                        {evaluation.steps.map((step, idx) => (
                            <div
                                key={idx}
                                className="p-2 bg-s2 border border-bd/50 rounded text-xs font-mono animate-fadeIn eval-step"
                                style={{ '--step-delay': (idx * 100) + 'ms' } as any}
                            >
                                <span className="text-t3">{step.step}</span>
                                <span className="text-em ml-2">→</span>
                                <span className="text-cy ml-2">{step.result}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PolicySimulator;

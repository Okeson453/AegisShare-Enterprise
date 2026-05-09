import React from 'react'import '../../styles/access-control-extension.css';import Spinne from '../ui/Spinner'

interface JsonViewerProps {
    data: Record<string, any>
    loading?: boolean
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, loading = false }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Spinne />
            </div>
        )
    }

    const renderValue = (value: any, depth: number = 0): React.ReactNode => {
        const indent = depth * 20

        if (value === null) return <span className="text-rd">null</span>
        if (typeof value === 'boolean')
            return <span className="text-em">{value.toString()}</span>
        if (typeof value === 'number')
            return <span className="text-am">{value}</span>
        if (typeof value === 'string')
            return <span className="text-em">"{value}"</span>
        if (Array.isArray(value)) {
            return (
                <div>
                    <span className="text-t1">[</span>
                    {value.map((item, idx) => (
                        <div key={idx} style={{ marginLeft: indent + 10 }}>
                            {renderValue(item, depth + 1)}
                            {idx < value.length - 1 && <span className="text-t1">,</span>}
                        </div>
                    ))}
                    <span className="text-t1">]</span>
                </div>
            )
        }
        if (typeof value === 'object') {
            return (
                <div>
                    <span className="text-t1">{'{'}</span>
                    {Object.entries(value).map(([key, val], idx, arr) => (
                        <div key={key} style={{ marginLeft: indent + 10 }}>
                            <span className="text-cy">"{key}"</span>
                            <span className="text-t1">: </span>
                            {renderValue(val, depth + 1)}
                            {idx < arr.length - 1 && <span className="text-t1">,</span>}
                        </div>
                    ))}
                    <span className="text-t1">{'}'}</span>
                </div>
            )
        }

        return <span className="text-t1">{String(value)}</span>
    }

    return (
        <pre className="bg-s0 border border-bd rounded-lg p-4 font-mono text-sm text-t0 overflow-x-auto">
            {renderValue(data)}
        </pre>
    )
}

export default JsonViewer

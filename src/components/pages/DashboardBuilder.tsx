import React, { useState } from 'react'

interface Widget {
    id: string
    title: string
    component: React.ReactNode
    size: 'sm' | 'md' | 'lg' | 'xl'
    position: number
}

interface DashboardBuilderProps {
    widgets?: Widget[]
    onSave?: (layout: Widget[]) => void
    editable?: boolean
}

const DashboardBuilder: React.FC<DashboardBuilderProps> = ({
    widgets = [
        {
            id: '1',
            title: 'System Status',
            component: <div style={{ color: 'var(--t2)' }}>Monitoring dashboard widget</div>,
            size: 'md',
            position: 0,
        },
        {
            id: '2',
            title: 'Security Alerts',
            component: <div style={{ color: 'var(--t2)' }}>Alert feed widget</div>,
            size: 'md',
            position: 1,
        },
        {
            id: '3',
            title: 'Performance Metrics',
            component: <div style={{ color: 'var(--t2)' }}>Metrics chart widget</div>,
            size: 'lg',
            position: 2,
        },
    ],
    onSave,
    editable = true,
}) => {
    const [layout, setLayout] = useState(widgets)
    const [editMode, setEditMode] = useState(false)

    const moveWidget = (id: string, direction: 'up' | 'down') => {
        const idx = layout.findIndex((w) => w.id === id)
        if (direction === 'up' && idx > 0) {
            const newLayout = [...layout]
            ;[newLayout[idx], newLayout[idx - 1]] = [newLayout[idx - 1], newLayout[idx]]
            setLayout(newLayout)
        } else if (direction === 'down' && idx < layout.length - 1) {
            const newLayout = [...layout]
            ;[newLayout[idx], newLayout[idx + 1]] = [newLayout[idx + 1], newLayout[idx]]
            setLayout(newLayout)
        }
    }

    const removeWidget = (id: string) => {
        setLayout(layout.filter((w) => w.id !== id))
    }

    const saveLayout = () => {
        onSave?.(layout)
        setEditMode(false)
        alert('Dashboard layout saved!')
    }

    return (
        <div className="dashboard-builder">
            <div className="dashboard-toolbar">
                <div className="dashboard-toolbar-group">
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t0)' }}>
                        AegisShare v4 Dashboard
                    </span>
                </div>
                <div className="dashboard-toolbar-group">
                    {editable && (
                        <>
                            <button
                                className={`dashboard-toolbar-btn ${editMode ? 'active' : ''}`}
                                onClick={() => setEditMode(!editMode)}
                            >
                                {editMode ? '✓ Done' : '✎ Edit'}
                            </button>
                            {editMode && (
                                <button
                                    className="dashboard-toolbar-btn"
                                    onClick={saveLayout}
                                >
                                    ✓ Save Layout
                                </button>
                            )}
                        </>
                    )}
                    <button className="dashboard-toolbar-btn">⚙ Settings</button>
                    <button className="dashboard-toolbar-btn">? Help</button>
                </div>
            </div>

            {layout.map((widget, idx) => (
                <div
                    key={widget.id}
                    className={`dashboard-widget widget-${widget.size} ${editMode ? 'edit-mode' : ''}`}
                >
                    <div className="dashboard-widget-header">
                        <div className="dashboard-widget-title">{widget.title}</div>
                        <div className="dashboard-widget-actions">
                            {editMode && (
                                <>
                                    <button
                                        className="dashboard-action-btn"
                                        onClick={() => moveWidget(widget.id, 'up')}
                                        disabled={idx === 0}
                                        title="Move up"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        className="dashboard-action-btn"
                                        onClick={() => moveWidget(widget.id, 'down')}
                                        disabled={idx === layout.length - 1}
                                        title="Move down"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        className="dashboard-action-btn"
                                        onClick={() => removeWidget(widget.id)}
                                        title="Remove"
                                    >
                                        ✕
                                    </button>
                                </>
                            )}
                            <button className="dashboard-action-btn" title="Refresh">
                                ↻
                            </button>
                        </div>
                    </div>
                    <div className="dashboard-widget-content">{widget.component}</div>
                </div>
            ))}
        </div>
    )
}

export default DashboardBuilder

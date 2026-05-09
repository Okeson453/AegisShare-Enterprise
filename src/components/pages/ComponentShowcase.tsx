import React, { useState } from 'react'
import { showcaseItems, getCategories } from '../../utils/componentShowcase'

const ComponentShowcase: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState(getCategories()[0])
    const [selectedItem, setSelectedItem] = useState(showcaseItems[0])
    const [copied, setCopied] = useState(false)

    const items = showcaseItems.filter((item) => item.category === selectedCategory)

    const copyCode = () => {
        navigator.clipboard.writeText(selectedItem.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '200px 300px 1fr',
            gap: '12px',
            padding: '12px',
            minHeight: '100vh',
            backgroundColor: 'var(--s3)',
        }}>
            {/* Categories */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingRight: '8px',
                borderRight: '1px solid var(--bd)',
            }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t0)' }}>
                    Categories
                </div>
                {getCategories().map((cat) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat)
                            setSelectedItem(
                                showcaseItems.find((item) => item.category === cat) || selectedItem
                            )
                        }}
                        style={{
                            padding: '8px 12px',
                            background: selectedCategory === cat ? 'var(--cy)' : 'var(--s2)',
                            color: selectedCategory === cat ? 'black' : 'var(--t1)',
                            border: '1px solid var(--bd)',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Items */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingRight: '8px',
                borderRight: '1px solid var(--bd)',
                overflowY: 'auto',
            }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--t0)' }}>
                    Components
                </div>
                {items.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setSelectedItem(item)}
                        style={{
                            padding: '8px 12px',
                            background: selectedItem.name === item.name ? 'var(--vl)' : 'var(--s2)',
                            color: selectedItem.name === item.name ? 'white' : 'var(--t1)',
                            border: '1px solid var(--bd)',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            {/* Details */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto',
            }}>
                <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--glass-2)',
                    border: '1px solid var(--glass-bd)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(12px)',
                }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--t0)' }}>
                        {selectedItem.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--t2)', marginTop: '4px' }}>
                        {selectedItem.description}
                    </div>
                </div>

                {selectedItem.notes && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'var(--s2)',
                        border: '1px solid var(--bd)',
                        borderRadius: '6px',
                    }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t1)' }}>
                            Notes
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--t2)', marginTop: '4px' }}>
                            {selectedItem.notes}
                        </div>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    flex: 1,
                    backgroundColor: 'var(--s2)',
                    border: '1px solid var(--bd)',
                    borderRadius: '6px',
                    padding: '12px',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--t1)' }}>
                            Usage Code
                        </div>
                        <button
                            onClick={copyCode}
                            style={{
                                padding: '4px 8px',
                                background: copied ? 'var(--em)' : 'var(--cy)',
                                color: copied ? 'white' : 'black',
                                border: 'none',
                                borderRadius: '3px',
                                fontSize: '9px',
                                fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            {copied ? '✓ Copied' : '📋 Copy'}
                        </button>
                    </div>
                    <pre style={{
                        flex: 1,
                        fontFamily: 'Monaco, Courier New, monospace',
                        fontSize: '9px',
                        color: 'var(--cy)',
                        margin: 0,
                        overflow: 'auto',
                        padding: '8px',
                        backgroundColor: 'var(--s1)',
                        borderRadius: '4px',
                    }}>
                        {selectedItem.code}
                    </pre>
                </div>

                {selectedItem.component}
            </div>
        </div>
    )
}

export default ComponentShowcase

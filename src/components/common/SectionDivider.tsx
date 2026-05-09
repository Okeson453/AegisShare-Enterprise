import React from 'react'

interface SectionDividerProps {
    label: string
}

const SectionDivider: React.FC<SectionDividerProps> = ({ label }) => {
    return (
        <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-bd to-transparent" />
            <span className="text-xs font-mono text-t2 uppercase tracking-widest">
                {label}
            </span>
            <div className="flex-1 h-px bg-gradient-to-l from-bd to-transparent" />
        </div>
    )
}

export default SectionDivider

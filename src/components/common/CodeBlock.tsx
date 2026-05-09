import React from 'react'

interface CodeBlockProps {
    code: string
    language?: 'typescript' | 'javascript' | 'python' | 'bash' | 'rego' | 'json'
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
    return (
        <pre
            className={`
        bg-s0 border border-bd rounded-lg p-4
        font-mono text-sm text-t0 overflow-x-auto
        language-${language}
      `}
        >
            <code>{code}</code>
        </pre>
    )
}

export default CodeBlock

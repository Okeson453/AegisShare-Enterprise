import React, { useState } from 'react';

interface OpaCodeViewerProps {
  code: string;
  language?: 'rego' | 'json';
}

/**
 * OpaCodeViewer - Displays OPA Rego policies with client-side syntax highlighting
 * Uses regex-based token matching for policy language highlighting
 */
const OpaCodeViewer: React.FC<OpaCodeViewerProps> = ({ code, language = 'rego' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Syntax highlighting for Rego language
  const highlightCode = (text: string) => {
    const keywords = /\b(package|default|if|not|allow|deny|print|data|input)\b/g;
    const functions = /\b[a-z_][a-z0-9_]*\(/g;
    const strings = /"[^"]*"/g;
    const comments = /#.*/g;
    const operators = /[{}[\]().,=]/g;

    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply syntax coloring (simplified - real implementation would use proper tokenization)
    html = html.replace(keywords, '<span style="color:var(--t3)">$1</span>');
    html = html.replace(functions, '<span style="color:var(--cy)">$1</span>');
    html = html.replace(strings, '<span style="color:var(--em)">$1</span>');
    html = html.replace(comments, '<span style="color:var(--t3);opacity:0.7">$1</span>');

    return html;
  };

  return (
    <div className="bg-s2 border border-bd rounded-lg overflow-hidden">
      {/* Header with copy button */}
      <div className="p-3 border-b border-bd flex items-center justify-between">
        <span className="text-xs font-mono text-t3 uppercase tracking-wider">
          {language.toUpperCase()} Code
        </span>
        <button
          onClick={handleCopy}
          className="px-2 py-1 text-xs font-mono rounded bg-cy/10 border border-cy/20 text-cy hover:bg-cy/20 transition-all"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code block with line numbers and syntax highlighting */}
      <pre className="p-4 overflow-x-auto text-xs font-mono text-t1 leading-relaxed">
        <code
          dangerouslySetInnerHTML={{
            __html: highlightCode(code),
          }}
        />
      </pre>
    </div>
  );
};

export default OpaCodeViewer;

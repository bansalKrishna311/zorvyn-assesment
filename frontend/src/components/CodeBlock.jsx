import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

function normalizeCode(code) {
  if (typeof code === 'string') {
    return code.trim();
  }

  return JSON.stringify(code, null, 2);
}

function CodeBlock({ title, code, language = 'json' }) {
  const [copied, setCopied] = useState(false);

  const codeText = normalizeCode(code);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/80">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
        <span className="font-medium tracking-wide text-text-secondary">{title || language.toUpperCase()}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2 py-1 font-medium text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-sm leading-relaxed text-text-primary">
        <code>{codeText}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;

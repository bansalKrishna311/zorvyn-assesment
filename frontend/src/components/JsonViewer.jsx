import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';

function highlightJson(data) {
  const json = JSON.stringify(data, null, 2)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      if (match.endsWith(':')) {
        return `<span class="text-[#8896b3]">${match}</span>`;
      }

      if (match === 'true' || match === 'false') {
        return `<span class="text-[#4f8ef7]">${match}</span>`;
      }

      if (match === 'null') {
        return `<span class="text-[#f87171]">${match}</span>`;
      }

      if (match.startsWith('"')) {
        return `<span class="text-[#10d9a0]">${match}</span>`;
      }

      return `<span class="text-[#f59e0b]">${match}</span>`;
    },
  );
}

function JsonViewer({ data }) {
  const [copied, setCopied] = useState(false);

  const content = useMemo(() => highlightJson(data), [data]);
  const jsonText = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/90">
      <div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs">
        <span className="font-semibold tracking-wide text-text-secondary">JSON RESPONSE</span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-2 py-1 font-medium text-text-secondary transition hover:border-accent/60 hover:text-text-primary"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      <pre
        className="max-h-[560px] overflow-auto p-4 font-mono text-sm leading-relaxed text-text-primary"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default JsonViewer;

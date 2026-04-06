import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Lock, ShieldAlert } from 'lucide-react';
import MethodBadge from './MethodBadge';
import CodeBlock from './CodeBlock';
import StatusBadge from './StatusBadge';

const MotionSpan = motion.span;
const MotionDiv = motion.div;

function getRequestPreview(fields) {
  if (!fields.length) {
    return null;
  }

  return fields.reduce((acc, field) => {
    acc[field.key] = field.example;
    return acc;
  }, {});
}

function RolePills({ roles, auth }) {
  if (!auth) {
    return <span className="rounded-full border border-green/40 bg-green/10 px-2 py-1 text-xs text-green">PUBLIC</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => (
        <span
          key={role}
          className="rounded-full border border-accent/40 bg-accent/10 px-2 py-1 text-xs font-semibold uppercase text-accent"
        >
          {role}
        </span>
      ))}
    </div>
  );
}

function FieldTable({ fields, title }) {
  if (!fields.length) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-surface-2/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
        {title}
      </div>
      <div className="divide-y divide-border/60">
        {fields.map((field) => (
          <div key={field.key} className="grid grid-cols-[1.2fr_0.9fr_0.8fr_1.1fr] gap-2 px-3 py-2 text-xs">
            <span className="font-mono text-text-primary">{field.key}</span>
            <span className="text-text-secondary">{field.type}</span>
            <span className={`${field.required ? 'text-red' : 'text-green'}`}>
              {field.required ? 'required' : 'optional'}
            </span>
            <span className="truncate text-text-secondary">{String(field.example ?? '-')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EndpointCard({ endpoint, isOpen, onToggle }) {
  const requestBody = getRequestPreview(endpoint.bodyFields);

  return (
    <article className="overflow-hidden rounded-xl border border-border bg-surface/90 transition hover:border-accent/30 hover:shadow-glow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
      >
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <MethodBadge method={endpoint.method} />
            <code className="truncate rounded bg-surface-2 px-2 py-1 font-mono text-sm text-text-primary">
              {endpoint.path}
            </code>
          </div>

          <p className="text-sm text-text-secondary">{endpoint.description}</p>

          <RolePills auth={endpoint.auth} roles={endpoint.roles} />
        </div>

        <MotionSpan animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="text-text-secondary" />
        </MotionSpan>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border px-4 py-4">
              {endpoint.auth ? (
                <div className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-2 text-xs text-accent">
                  <Lock size={14} /> Requires Bearer token
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-lg border border-green/40 bg-green/10 px-3 py-2 text-xs text-green">
                  <ShieldAlert size={14} /> Public endpoint
                </div>
              )}

              <FieldTable fields={endpoint.pathParams} title="Path Parameters" />
              <FieldTable fields={endpoint.queryParams} title="Query Parameters" />

              {requestBody && <CodeBlock title="Request Body" code={requestBody} language="json" />}
              <CodeBlock title="Sample Response" code={endpoint.sampleResponse} language="json" />

              <div className="flex flex-wrap gap-2">
                {endpoint.statusCodes.map((status) => (
                  <StatusBadge key={`${endpoint.id}-${status.code}`} code={status.code} label={`${status.code} ${status.meaning}`} />
                ))}
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </article>
  );
}

export default EndpointCard;

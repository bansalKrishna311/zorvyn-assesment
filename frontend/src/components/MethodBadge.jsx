const methodStyles = {
  GET: 'bg-green/15 text-green border border-green/40',
  POST: 'bg-blue/15 text-blue border border-blue/40',
  PUT: 'bg-orange/15 text-orange border border-orange/40',
  PATCH: 'bg-purple/15 text-purple border border-purple/40',
  DELETE: 'bg-red/15 text-red border border-red/40',
};

function MethodBadge({ method }) {
  return (
    <span
      className={`inline-flex min-w-16 justify-center rounded-full px-3 py-1 text-xs font-semibold tracking-[0.14em] ${methodStyles[method] || 'bg-surface-2 text-text-secondary border border-border'}`}
    >
      {method}
    </span>
  );
}

export default MethodBadge;

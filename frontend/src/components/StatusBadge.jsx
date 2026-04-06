const getStatusClasses = (code) => {
  if (code >= 200 && code < 300) {
    return 'bg-green/15 text-green border-green/40';
  }

  if (code >= 400 && code < 500) {
    return 'bg-red/15 text-red border-red/40';
  }

  if (code >= 500) {
    return 'bg-red/20 text-red border-red/50';
  }

  return 'bg-blue/15 text-blue border-blue/40';
};

function StatusBadge({ code, label }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(code)}`}
    >
      {label || code}
    </span>
  );
}

export default StatusBadge;

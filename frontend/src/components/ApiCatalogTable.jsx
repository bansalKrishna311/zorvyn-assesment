import MethodBadge from './MethodBadge';

function RoleSummary({ endpoint }) {
  if (!endpoint.auth) {
    return <span className="rounded-full border border-green/45 bg-green/10 px-2 py-1 text-[11px] font-semibold text-green">Public</span>;
  }

  if (!endpoint.roles.length) {
    return <span className="text-xs text-text-secondary">Authenticated</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {endpoint.roles.map((role) => (
        <span
          key={`${endpoint.id}-${role}`}
          className="rounded-full border border-accent/35 bg-accent/10 px-2 py-1 text-[11px] font-semibold uppercase text-accent"
        >
          {role}
        </span>
      ))}
    </div>
  );
}

function ApiCatalogTable({ endpoints, dense = false }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/85">
      <table className="w-full table-fixed border-collapse text-left">
        <thead className="bg-surface-2/70 text-[11px] uppercase tracking-[0.14em] text-text-secondary">
          <tr>
            <th className="w-[112px] px-4 py-3">Method</th>
            <th className="w-[34%] px-4 py-3">Path</th>
            <th className="w-[22%] px-4 py-3">Access</th>
            <th className="px-4 py-3">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70 text-sm">
          {endpoints.map((endpoint) => (
            <tr key={endpoint.id} className="align-top transition hover:bg-surface-2/35">
              <td className="px-4 py-3">
                <MethodBadge method={endpoint.method} />
              </td>
              <td className="px-4 py-3">
                <a href={`#ref-${endpoint.id}`} className="font-mono text-sm text-text-primary underline-offset-4 hover:text-accent hover:underline">
                  {endpoint.path}
                </a>
              </td>
              <td className="px-4 py-3">
                <RoleSummary endpoint={endpoint} />
              </td>
              <td className={`px-4 py-3 text-text-secondary ${dense ? 'text-xs' : 'text-sm'}`}>
                {endpoint.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApiCatalogTable;

import MethodBadge from './MethodBadge';
import StatusBadge from './StatusBadge';

function valueType(value) {
  if (Array.isArray(value)) {
    return 'array';
  }

  if (value === null) {
    return 'null';
  }

  return typeof value;
}

function flattenSchema(value, prefix = '') {
  if (Array.isArray(value)) {
    if (!value.length) {
      return [{ field: `${prefix}[]`, type: 'array' }];
    }

    const first = value[0];
    const itemType = valueType(first);

    if (itemType === 'object' && first) {
      return flattenSchema(first, `${prefix}[]`);
    }

    return [{ field: `${prefix}[]`, type: itemType }];
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nested]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      const nestedType = valueType(nested);

      if (nestedType === 'object' || nestedType === 'array') {
        return flattenSchema(nested, path);
      }

      return [{ field: path, type: nestedType }];
    });
  }

  return [{ field: prefix || 'value', type: valueType(value) }];
}

function buildParameterRows(endpoint) {
  const rows = [
    ...endpoint.pathParams.map((field) => ({ location: 'path', ...field })),
    ...endpoint.queryParams.map((field) => ({ location: 'query', ...field })),
    ...endpoint.bodyFields.map((field) => ({ location: 'body', ...field })),
  ];

  return rows;
}

function EndpointReferenceTable({ endpoint }) {
  const parameters = buildParameterRows(endpoint);
  const schemaRows = flattenSchema(endpoint.sampleResponse);

  return (
    <article id={`ref-${endpoint.id}`} className="scroll-mt-24 overflow-hidden rounded-xl border border-border bg-surface/95">
      <div className="border-b border-border bg-surface-2/55 px-5 py-4">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <MethodBadge method={endpoint.method} />
          <code className="rounded bg-background/50 px-2 py-1 font-mono text-sm text-text-primary">
            {endpoint.path}
          </code>
        </div>
        <p className="text-sm text-text-secondary">{endpoint.description}</p>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2/60 text-[11px] uppercase tracking-[0.14em] text-text-secondary">
              <tr>
                <th className="px-3 py-2">Authentication</th>
                <th className="px-3 py-2">Allowed Roles</th>
              </tr>
            </thead>
            <tbody className="text-text-primary">
              <tr>
                <td className="px-3 py-2 text-sm">
                  {endpoint.auth ? 'Bearer token required' : 'Public endpoint'}
                </td>
                <td className="px-3 py-2 text-sm">
                  {endpoint.auth ? endpoint.roles.join(', ') : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
            Request Parameters
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/40 text-[11px] uppercase tracking-[0.14em] text-text-secondary">
              <tr>
                <th className="w-[95px] px-3 py-2">In</th>
                <th className="w-[180px] px-3 py-2">Field</th>
                <th className="w-[110px] px-3 py-2">Type</th>
                <th className="w-[100px] px-3 py-2">Required</th>
                <th className="px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-text-primary">
              {parameters.length ? (
                parameters.map((row) => (
                  <tr key={`${endpoint.id}-${row.location}-${row.key}`}>
                    <td className="px-3 py-2 font-mono text-xs uppercase text-text-secondary">{row.location}</td>
                    <td className="px-3 py-2 font-mono text-xs">{row.key}</td>
                    <td className="px-3 py-2 text-xs text-text-secondary">{row.type}</td>
                    <td className="px-3 py-2 text-xs">
                      <span className={row.required ? 'text-red' : 'text-green'}>
                        {row.required ? 'required' : 'optional'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-text-secondary">
                      {row.options?.length ? `Allowed: ${row.options.join(', ')}` : 'No enum constraint'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-3 text-xs text-text-secondary">
                    No path, query, or body parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="overflow-hidden rounded-lg border border-border">
          <div className="border-b border-border bg-surface-2/60 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
            Response Schema
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/40 text-[11px] uppercase tracking-[0.14em] text-text-secondary">
              <tr>
                <th className="w-[65%] px-3 py-2">Field</th>
                <th className="px-3 py-2">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-text-primary">
              {schemaRows.map((row) => (
                <tr key={`${endpoint.id}-${row.field}`}>
                  <td className="px-3 py-2 font-mono text-xs">{row.field}</td>
                  <td className="px-3 py-2 text-xs text-text-secondary">{row.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">Status Codes</p>
          <div className="flex flex-wrap gap-2">
            {endpoint.statusCodes.map((status) => (
              <StatusBadge key={`${endpoint.id}-status-${status.code}`} code={status.code} label={`${status.code} ${status.meaning}`} />
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}

export default EndpointReferenceTable;

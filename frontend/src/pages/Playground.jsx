import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, LogOut, Send, Sparkles, TerminalSquare } from 'lucide-react';
import endpoints, { endpointSections } from '../data/endpoints';
import BASE_URL from '../config';
import JsonViewer from '../components/JsonViewer';
import MethodBadge from '../components/MethodBadge';
import StatusBadge from '../components/StatusBadge';
import useToken from '../hooks/useToken';

const MotionDiv = motion.div;

const methodWithBody = new Set(['POST', 'PUT', 'PATCH']);

function getDefaultValues(fields) {
  return fields.reduce((acc, field) => {
    if (field.required && field.options?.length) {
      acc[field.key] = field.options[0];
    } else {
      acc[field.key] = '';
    }
    return acc;
  }, {});
}

function parseTypedValue(value, type) {
  if (value === '' || typeof value === 'undefined') {
    return undefined;
  }

  if (type === 'number') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  if (type === 'boolean') {
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  }

  return value;
}

function buildPayload(fields, values) {
  return fields.reduce((acc, field) => {
    const next = parseTypedValue(values[field.key], field.type);
    if (typeof next !== 'undefined') {
      acc[field.key] = next;
    }
    return acc;
  }, {});
}

function formatSize(bytes) {
  if (!bytes) {
    return '0 B';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(2)} KB`;
}

function Playground() {
  const { token, role, setAuth, clearAuth, isAuthenticated } = useToken();
  const [tokenInput, setTokenInput] = useState(token);

  const [selectedId, setSelectedId] = useState(endpoints[0]?.id || '');
  const selectedEndpoint = useMemo(
    () => endpoints.find((endpoint) => endpoint.id === selectedId) || endpoints[0],
    [selectedId],
  );

  const [bodyValues, setBodyValues] = useState({});
  const [queryValues, setQueryValues] = useState({});
  const [pathValues, setPathValues] = useState({});

  const [showLogin, setShowLogin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [response, setResponse] = useState(null);

  useEffect(() => {
    setTokenInput(token || '');
  }, [token]);

  useEffect(() => {
    if (!selectedEndpoint) {
      return;
    }

    setBodyValues(getDefaultValues(selectedEndpoint.bodyFields));
    setQueryValues(getDefaultValues(selectedEndpoint.queryParams));
    setPathValues(getDefaultValues(selectedEndpoint.pathParams));
    setRequestError('');
  }, [selectedEndpoint]);

  const endpointNeedsAuth = Boolean(selectedEndpoint?.auth);

  const activeToken = tokenInput.trim();

  const groupedEndpoints = useMemo(
    () =>
      endpointSections.map((section) => ({
        section,
        items: endpoints.filter((endpoint) => endpoint.section === section),
      })),
    [],
  );

  const onInputChange = (setter) => (key, value) => {
    setter((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateBody = onInputChange(setBodyValues);
  const updateQuery = onInputChange(setQueryValues);
  const updatePath = onInputChange(setPathValues);

  const handleQuickLogin = async () => {
    setLoginError('');
    setLoginLoading(true);

    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginForm);
      const nextToken = loginResponse.data?.token || '';
      const nextRole = loginResponse.data?.user?.role || '';

      setAuth(nextToken, nextRole);
      setTokenInput(nextToken);
      setShowLogin(false);
    } catch (error) {
      setLoginError(error.response?.data?.msg || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedEndpoint) {
      return;
    }

    setRequestError('');

    if (endpointNeedsAuth && !activeToken) {
      setRequestError('This endpoint requires a Bearer token. Login first or paste a token.');
      return;
    }

    let compiledPath = selectedEndpoint.path;

    for (const param of selectedEndpoint.pathParams) {
      const value = pathValues[param.key];
      if (!value) {
        setRequestError(`Path parameter "${param.key}" is required.`);
        return;
      }

      compiledPath = compiledPath.replace(`:${param.key}`, encodeURIComponent(value));
    }

    const startedAt = performance.now();
    setRequestLoading(true);

    try {
      const config = {
        method: selectedEndpoint.method.toLowerCase(),
        url: `${BASE_URL}${compiledPath}`,
        params: buildPayload(selectedEndpoint.queryParams, queryValues),
        headers: {},
      };

      if (endpointNeedsAuth) {
        config.headers.Authorization = `Bearer ${activeToken}`;
      }

      if (methodWithBody.has(selectedEndpoint.method)) {
        config.data = buildPayload(selectedEndpoint.bodyFields, bodyValues);
      }

      const apiResponse = await axios(config);
      const elapsed = Math.round(performance.now() - startedAt);
      const serialized = JSON.stringify(apiResponse.data);
      const size = new TextEncoder().encode(serialized).length;

      setResponse({
        status: apiResponse.status,
        timeMs: elapsed,
        sizeBytes: size,
        payload: apiResponse.data,
      });
    } catch (error) {
      const elapsed = Math.round(performance.now() - startedAt);
      const payload = error.response?.data || { msg: error.message };
      const status = error.response?.status || 0;
      const serialized = JSON.stringify(payload);
      const size = new TextEncoder().encode(serialized).length;

      setResponse({
        status,
        timeMs: elapsed,
        sizeBytes: size,
        payload,
      });
    } finally {
      setRequestLoading(false);
    }
  };

  const clearResponse = () => {
    setResponse(null);
    setRequestError('');
  };

  const clearAuthState = () => {
    clearAuth();
    setTokenInput('');
  };

  return (
    <div className="mx-auto w-full max-w-[1680px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary">API Playground</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Build requests against verified backend routes and inspect live JSON responses.
          </p>
        </div>

        {isAuthenticated && (
          <div className="inline-flex items-center gap-2 rounded-full border border-green/40 bg-green/10 px-4 py-2 text-xs font-semibold text-green">
            Authenticated as {role ? role.toUpperCase() : 'USER'}
            <button
              type="button"
              onClick={clearAuthState}
              className="inline-flex items-center gap-1 rounded-full border border-green/50 px-2 py-1 text-[11px] hover:bg-green/20"
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.76fr_1.24fr]">
        <section className="rounded-xl border border-border bg-surface/90 p-5 xl:sticky xl:top-24 xl:h-fit">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Request Builder</p>
            <MethodBadge method={selectedEndpoint.method} />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                Endpoint
              </label>
              <select
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary outline-none transition focus:border-accent"
              >
                {groupedEndpoints.map((group) => (
                  <optgroup key={group.section} label={group.section}>
                    {group.items.map((endpoint) => (
                      <option key={endpoint.id} value={endpoint.id}>
                        {endpoint.method} {endpoint.path}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-border bg-surface-2/60 p-3">
              <p className="font-mono text-xs text-text-primary">{selectedEndpoint.path}</p>
              <p className="mt-2 text-xs text-text-secondary">{selectedEndpoint.description}</p>
            </div>

            {endpointNeedsAuth && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
                  Bearer Token
                </label>
                <textarea
                  value={tokenInput}
                  onChange={(event) => setTokenInput(event.target.value)}
                  rows={3}
                  placeholder="Paste JWT token"
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 font-mono text-xs text-text-primary outline-none transition focus:border-accent"
                />

                {!activeToken && (
                  <div className="rounded-lg border border-orange/40 bg-orange/10 p-3 text-sm text-orange">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="mt-0.5" />
                      <div>
                        <p className="font-semibold">Login required</p>
                        <p className="text-xs text-orange/90">
                          This endpoint is protected. Use quick login to fetch a token.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowLogin((prev) => !prev)}
                          className="mt-2 rounded-lg border border-orange/50 px-3 py-1 text-xs font-semibold hover:bg-orange/20"
                        >
                          {showLogin ? 'Hide Login' : 'Login'}
                        </button>
                      </div>
                    </div>

                    {showLogin && (
                      <div className="mt-3 space-y-2">
                        <input
                          value={loginForm.email}
                          onChange={(event) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              email: event.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary outline-none focus:border-accent"
                          placeholder="you@company.com"
                        />
                        <input
                          value={loginForm.password}
                          onChange={(event) =>
                            setLoginForm((prev) => ({
                              ...prev,
                              password: event.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-primary outline-none focus:border-accent"
                          placeholder="Your password"
                          type="password"
                        />
                        {loginError && <p className="text-xs text-red">{loginError}</p>}
                        <button
                          type="button"
                          onClick={handleQuickLogin}
                          disabled={loginLoading}
                          className="inline-flex items-center gap-2 rounded-lg border border-accent/50 bg-accent px-3 py-2 text-xs font-semibold text-white disabled:opacity-70"
                        >
                          {loginLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                          {loginLoading ? 'Authenticating...' : 'Authenticate'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!!selectedEndpoint.pathParams.length && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">Path Parameters</p>
                {selectedEndpoint.pathParams.map((param) => (
                  <input
                    key={param.key}
                    value={pathValues[param.key] ?? ''}
                    onChange={(event) => updatePath(param.key, event.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                    placeholder={`${param.key} (${param.type})`}
                  />
                ))}
              </div>
            )}

            {!!selectedEndpoint.queryParams.length && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">Query Parameters</p>
                {selectedEndpoint.queryParams.map((param) => (
                  <input
                    key={param.key}
                    value={queryValues[param.key] ?? ''}
                    onChange={(event) => updateQuery(param.key, event.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                    placeholder={`${param.key} (${param.type})`}
                  />
                ))}
              </div>
            )}

            {methodWithBody.has(selectedEndpoint.method) && !!selectedEndpoint.bodyFields.length && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">Request Body</p>
                {selectedEndpoint.bodyFields.map((field) => {
                  if (field.options?.length) {
                    return (
                      <select
                        key={field.key}
                        value={bodyValues[field.key] ?? ''}
                        onChange={(event) => updateBody(field.key, event.target.value)}
                        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                      >
                        {field.required ? null : <option value="">(optional) {field.key}</option>}
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    );
                  }

                  if (field.type === 'boolean') {
                    return (
                      <select
                        key={field.key}
                        value={String(bodyValues[field.key] ?? '')}
                        onChange={(event) => updateBody(field.key, event.target.value)}
                        className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                      >
                        {field.required ? null : <option value="">(optional) {field.key}</option>}
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    );
                  }

                  return (
                    <input
                      key={field.key}
                      value={bodyValues[field.key] ?? ''}
                      onChange={(event) => updateBody(field.key, event.target.value)}
                      type={field.type === 'number' ? 'number' : 'text'}
                      className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
                      placeholder={`${field.key}${field.required ? ' *' : ''}`}
                    />
                  );
                })}
              </div>
            )}

            {requestError && <p className="rounded-lg border border-red/40 bg-red/10 p-2 text-xs text-red">{requestError}</p>}

            <button
              type="button"
              onClick={handleSendRequest}
              disabled={requestLoading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent/60 bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-70"
            >
              {requestLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {requestLoading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-surface/90 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">Response Viewer</p>
            {response && (
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <StatusBadge code={response.status} label={response.status ? `HTTP ${response.status}` : 'NETWORK'} />
                <span>{response.timeMs}ms</span>
                <span>{formatSize(response.sizeBytes)}</span>
              </div>
            )}
          </div>

          {!response && !requestLoading && (
            <div className="flex h-[560px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-2/40 text-center">
              <TerminalSquare className="mb-3 text-text-muted" size={28} />
              <p className="text-sm font-semibold text-text-primary">Send a request to see the response</p>
              <p className="mt-1 max-w-sm text-xs text-text-secondary">
                Status, response time, payload size, and syntax-highlighted JSON will appear here.
              </p>
            </div>
          )}

          {requestLoading && (
            <div className="flex h-[560px] items-center justify-center rounded-xl border border-border bg-surface-2/40">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary">
                <Loader2 size={16} className="animate-spin" />
                Waiting for API response...
              </div>
            </div>
          )}

          {response && !requestLoading && (
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(response.payload, null, 2))}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-semibold text-text-secondary transition hover:text-text-primary"
                >
                  Copy response
                </button>
                <button
                  type="button"
                  onClick={clearResponse}
                  className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-semibold text-text-secondary transition hover:text-text-primary"
                >
                  Clear
                </button>
              </div>

              <JsonViewer data={response.payload} />
            </MotionDiv>
          )}
        </section>
      </div>
    </div>
  );
}

export default Playground;

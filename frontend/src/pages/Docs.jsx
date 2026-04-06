import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import RoleTable from '../components/RoleTable';
import CodeBlock from '../components/CodeBlock';
import ApiCatalogTable from '../components/ApiCatalogTable';
import EndpointReferenceTable from '../components/EndpointReferenceTable';
import endpoints, { endpointSections } from '../data/endpoints';
import {
  docsErrorRows,
  docsSidebarGroups,
  getQuickStartCommands,
  sectionIdForGroup,
} from '../data/docsContent';
import BASE_URL from '../config';

const MotionMain = motion.main;

function Docs() {
  const [activeSection, setActiveSection] = useState('overview');

  const sectionIds = useMemo(
    () => docsSidebarGroups.flatMap((group) => group.items.map((item) => item.id)),
    [],
  );

  const groupedEndpoints = useMemo(
    () =>
      endpointSections.map((group) => ({
        group,
        id: sectionIdForGroup(group),
        items: endpoints.filter((endpoint) => endpoint.section === group),
      })),
    [],
  );

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const offset = 140;

    const updateActiveSection = () => {
      let nextActive = sections[0].id;

      for (const section of sections) {
        const top = section.getBoundingClientRect().top;
        if (top <= offset) {
          nextActive = section.id;
        } else {
          break;
        }
      }

      const atPageBottom =
        Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;

      if (atPageBottom) {
        nextActive = sections[sections.length - 1].id;
      }

      setActiveSection((prev) => (prev === nextActive ? prev : nextActive));
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sectionIds]);

  const handleJump = (id) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    setActiveSection(id);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const curlCommands = getQuickStartCommands(BASE_URL);

  return (
    <div className="mx-auto flex w-full max-w-[1680px] gap-6 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <div className="hidden lg:block">
        <Sidebar groups={docsSidebarGroups} activeSection={activeSection} onSelect={handleJump} />
      </div>

      <MotionMain
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-w-0 flex-1 space-y-12"
      >
        <section id="overview" className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface/90 p-7">
          <h1 className="font-display text-3xl font-bold text-text-primary">Zorvyn Finance API Reference</h1>
          <p className="max-w-5xl text-base leading-relaxed text-text-secondary">
            Production-style API documentation derived from the implemented backend routes, controllers,
            middleware, and models in this repository. No seeded accounts or fake credentials are embedded.
          </p>

          <CodeBlock title="Base URL" language="bash" code={BASE_URL} />

          <div className="flex flex-wrap gap-2">
            {['Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'express-validator', 'REST'].map((item) => (
              <span
                key={item}
                className="rounded-full border border-border bg-surface-2/70 px-3 py-1 text-xs font-semibold text-text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="authentication" className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface/90 p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-accent/35 bg-accent/10 p-2 text-accent">
              <KeyRound size={18} />
            </div>
            <h2 className="font-display text-3xl font-bold text-text-primary">Authentication</h2>
          </div>

          <p className="text-base leading-relaxed text-text-secondary">
            Protected routes require a Bearer token returned by /api/auth/login. Tokens are signed using
            JWT_SECRET and expire after 1 day. The auth middleware also enforces active user status.
          </p>

          <CodeBlock title="Authorization Header" language="http" code={`Authorization: Bearer JWT_TOKEN`} />
        </section>

        <section id="role-system" className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface/90 p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-blue/35 bg-blue/10 p-2 text-blue">
              <ShieldCheck size={18} />
            </div>
            <h2 className="font-display text-3xl font-bold text-text-primary">Role System</h2>
          </div>

          <p className="text-base leading-relaxed text-text-secondary">
            Roles are enforced via allowRoles middleware. Valid roles are admin, analyst, and viewer.
          </p>

          <RoleTable />
        </section>

        <section id="api-index" className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface/90 p-7">
          <h2 className="font-display text-3xl font-bold text-text-primary">API Index</h2>
          <p className="text-sm text-text-secondary">
            Complete endpoint inventory with method, path, access policy, and contract summary.
          </p>
          <ApiCatalogTable endpoints={endpoints} />
        </section>

        {groupedEndpoints.map((groupBlock) => (
          <section
            key={groupBlock.group}
            id={groupBlock.id}
            className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface/90 p-7"
          >
            <h2 className="font-display text-3xl font-bold text-text-primary">{groupBlock.group} Endpoint Specs</h2>

            <div className="space-y-5">
              {groupBlock.items.map((endpoint) => (
                <EndpointReferenceTable key={endpoint.id} endpoint={endpoint} />
              ))}
            </div>
          </section>
        ))}

        <section id="error-reference" className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface/90 p-7">
          <h2 className="font-display text-3xl font-bold text-text-primary">Error Reference</h2>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-2/70 text-xs uppercase tracking-[0.12em] text-text-secondary">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Meaning</th>
                  <th className="px-4 py-3">When It Happens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70 text-text-primary">
                {docsErrorRows.map((row) => (
                  <tr key={row.code}>
                    <td className="px-4 py-3 font-mono">{row.code}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.meaning}</td>
                    <td className="px-4 py-3 text-text-secondary">{row.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="quick-start" className="scroll-mt-24 space-y-5 rounded-xl border border-border bg-surface/90 p-7">
          <h2 className="font-display text-3xl font-bold text-text-primary">Quick Start</h2>
          <p className="text-sm text-text-secondary">
            Replace request fields with your real environment values before execution.
          </p>
          <div className="space-y-4">
            {curlCommands.map((command) => (
              <div key={command.title} className="space-y-2">
                <p className="text-sm font-semibold text-text-primary">{command.title}</p>
                <CodeBlock language="bash" code={command.code} />
              </div>
            ))}
          </div>
        </section>
      </MotionMain>
    </div>
  );
}

export default Docs;

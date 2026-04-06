import { motion } from 'framer-motion';

const MotionSpan = motion.span;

function Sidebar({ groups, activeSection, onSelect }) {
  return (
    <aside className="sticky top-24 h-[calc(100vh-7.5rem)] w-[260px] shrink-0 overflow-y-auto rounded-xl border border-border bg-surface/90 p-4">
      <div className="mb-6 flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="font-display text-sm font-bold tracking-wide text-text-primary">Zorvyn API</p>
          <p className="text-xs text-text-secondary">Reference</p>
        </div>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-1 text-[10px] font-semibold text-accent">
          LIVE
        </span>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
              {group.label}
            </p>

            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(item.id)}
                      className={`relative w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? 'bg-surface-2 text-text-primary'
                          : 'text-text-secondary hover:bg-surface-2/70 hover:text-text-primary'
                      }`}
                    >
                      {isActive && (
                        <MotionSpan
                          layoutId="sidebar-active"
                          className="absolute inset-y-1 left-0 w-1 rounded-r-full bg-accent"
                          transition={{ type: 'spring', stiffness: 420, damping: 40 }}
                        />
                      )}
                      <span className="pl-2">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

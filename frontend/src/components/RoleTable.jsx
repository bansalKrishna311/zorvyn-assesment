import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { roleMatrix } from '../data/roles';

const MotionSpan = motion.span;

const roleCells = [
  { key: 'admin', label: 'ADMIN', classes: 'text-red bg-red/10 border-red/30' },
  { key: 'analyst', label: 'ANALYST', classes: 'text-blue bg-blue/10 border-blue/30' },
  { key: 'viewer', label: 'VIEWER', classes: 'text-green bg-green/10 border-green/30' },
];

function AccessIcon({ allowed }) {
  return allowed ? (
    <MotionSpan initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex">
      <Check size={16} className="text-green" />
    </MotionSpan>
  ) : (
    <MotionSpan initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex">
      <X size={16} className="text-red/80" />
    </MotionSpan>
  );
}

function RoleTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface/90">
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-border bg-surface-2/70 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">
        <span>Capability</span>
        {roleCells.map((role) => (
          <span key={role.key} className="flex justify-center">
            <span className={`rounded-full border px-3 py-1 ${role.classes}`}>{role.label}</span>
          </span>
        ))}
      </div>

      <div className="divide-y divide-border/70">
        {roleMatrix.map((row) => (
          <div
            key={row.feature}
            className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3 text-sm text-text-primary"
          >
            <span className="pr-4 text-text-secondary">{row.feature}</span>
            <span className="flex justify-center">
              <AccessIcon allowed={row.admin} />
            </span>
            <span className="flex justify-center">
              <AccessIcon allowed={row.analyst} />
            </span>
            <span className="flex justify-center">
              <AccessIcon allowed={row.viewer} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoleTable;

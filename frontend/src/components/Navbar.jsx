import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const MotionSpan = motion.span;

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/docs', label: 'Docs' },
  { to: '/playground', label: 'Playground' },
];

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <NavLink to="/" className="inline-flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-lg border border-accent/60 bg-accent/10 text-sm font-black text-accent">
            ZF
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold tracking-wide text-text-primary">Zorvyn Finance API</p>
            <p className="text-xs text-text-secondary">Documentation</p>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <MotionSpan
                      layoutId="navbar-active"
                      className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

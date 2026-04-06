import { motion } from 'framer-motion';
import { BarChart3, Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const MotionSection = motion.section;
const MotionDiv = motion.div;
const MotionH1 = motion.h1;
const MotionP = motion.p;
const MotionArticle = motion.article;

const heroChildren = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

const features = [
  {
    title: 'Role Based Access Control',
    description: 'VIEWER / ANALYST / ADMIN three-tier permissions wired directly to middleware.',
    icon: Shield,
    iconColor: 'text-blue bg-blue/15 border border-blue/35',
  },
  {
    title: 'Real-time Analytics',
    description: 'Dashboard APIs are backed by MongoDB aggregations for finance trends and totals.',
    icon: BarChart3,
    iconColor: 'text-gold bg-gold/15 border border-gold/35',
  },
  {
    title: 'JWT Secured',
    description: 'Stateless auth flow with Bearer token checks and active-user enforcement.',
    icon: Lock,
    iconColor: 'text-green bg-green/15 border border-green/35',
  },
];

const builtWith = ['Node.js', 'Express', 'MongoDB', 'JWT', 'REST'];

function Home() {
  return (
    <div className="relative isolate overflow-hidden px-4 pb-24 pt-24 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-hero-gradient bg-[length:220%_220%] opacity-90 blur-3xl animate-gradient-shift" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-accent-glow animate-pulse-glow" />

      <MotionSection
        className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col items-center justify-center text-center"
        initial="hidden"
        animate="show"
      >
        <MotionDiv custom={0} variants={heroChildren} className="mb-7 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-surface/90 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-text-secondary">
          <span className="size-2 rounded-full bg-green shadow-glow-sm" />
          Finance API v1.0
        </MotionDiv>

        <MotionH1
          custom={0.05}
          variants={heroChildren}
          className="font-display text-4xl font-black tracking-tight text-text-primary sm:text-5xl lg:text-6xl"
        >
          The Finance API Built for Modern Fintech
        </MotionH1>

        <MotionP
          custom={0.14}
          variants={heroChildren}
          className="mt-6 max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg"
        >
          Production-grade auth, role-aware operations, and analytics-first endpoints designed for
          teams that care about precision, security, and speed.
        </MotionP>

        <MotionDiv custom={0.22} variants={heroChildren} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/docs"
            className="rounded-xl border border-accent/60 bg-accent px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:scale-[1.02] hover:bg-accent-hover hover:shadow-glow"
          >
            Explore Docs
          </Link>
          <Link
            to="/playground"
            className="rounded-xl border border-border bg-surface/70 px-6 py-3 text-sm font-semibold text-text-primary transition duration-200 hover:scale-[1.02] hover:border-accent/60 hover:bg-surface-2"
          >
            Try Playground
          </Link>
        </MotionDiv>
      </MotionSection>

      <section className="relative mx-auto mt-8 max-w-6xl">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <MotionArticle
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group rounded-xl border border-border bg-surface/90 p-6 transition hover:border-accent/35 hover:shadow-glow"
              >
                <div className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl ${feature.iconColor}`}>
                  <Icon size={20} />
                </div>
                <h2 className="font-display text-xl font-bold text-text-primary">{feature.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{feature.description}</p>
              </MotionArticle>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-sm text-text-secondary">
          <span className="mr-1 text-text-muted">Built with</span>
          {builtWith.map((item) => (
            <span key={item} className="rounded-full border border-border bg-surface-2/70 px-3 py-1 text-xs font-medium text-text-primary">
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

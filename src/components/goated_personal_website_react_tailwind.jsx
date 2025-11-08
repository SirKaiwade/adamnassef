import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Linkedin, Mail, ExternalLink, Download, Menu, X, Search, TerminalSquare, PlayCircle, Notebook, Rocket, Star, Sun, Moon } from "lucide-react";
import { useTheme } from '../contexts/ThemeContext';

// ======== CONFIG: edit these to personalize ========
const PROFILE = {
  name: "Adam Nassef",
  tagline: "Cognitive Science @ U of T · Builder · PM Intern",
  blurb:
    "Interned on optimization & simulation at Amazon. Built a blockchain marketing studio to $1.3M+ revenue. I like hard problems, simple UX, and fast feedback loops.",
  headshot: "https://media.licdn.com/dms/image/v2/D4D03AQFakq3HVOpZ-w/profile-displayphoto-shrink_800_800/B4DZdyp9m4GUAc-/0/1749975292738?e=1764201600&v=beta&t=aV4iFVnuAIrLdvSamAYXJORzN0YgXTAihx4Vmilfmq0",
  resumeUrl: "/Adam_Nassef_Resume_2025.pdf", // PDF file in public directory
  email: "ayhnassef@gmail.com",
  github: "https://github.com/",
  linkedin: "https://linkedin.com/in/adamnassef",
  instagram: "https://instagram.com/sirkaiwade",
  accent: "from-sky-400 via-violet-400 to-fuchsia-400", // Tailwind gradient tokens
};

const PROJECTS = [
  {
    title: "Amazon Middle Mile · Optimization & Simulation",
    subtitle: "Program/PM Intern · 2025",
    description:
      "Built simulation tooling for throughput scenarios. Cut analysis time by ~60%. Worked across ops science, SDEs, and PMs.",
    links: [{ href: "#", label: "Read case study" }],
    tags: ["systems", "simulation", "ops-science"],
  },
  {
    title: "Minty Marketing Solutions",
    subtitle: "Founder · 2022 →",
    description:
      "Full‑stack Web3 growth studio. $300k+ revenue. Led GTM for NFT launches totaling $1.3M+ in primary sales.",
    links: [{ href: "#", label: "Site" }, { href: "#", label: "Playbook" }],
    tags: ["web3", "growth", "playbooks"],
  },
  {
    title: "Cabin Systems · Lufthansa Technik",
    subtitle: "Product Dev Intern · 2024",
    description:
      "Rapid prototyping for cabin UX. Led FCC certification for connectivity feature.",
    links: [{ href: "#", label: "Notes" }],
    tags: ["aviation", "prototype", "ux"],
  },
  {
    title: "IFE Dashboard Reimagined",
    subtitle: "Side project",
    description:
      "A concept redesign of private-jet in-flight entertainment and cabin-control interfaces. Built as a web-based prototype",
    links: [{ href: "#", label: "Demos" }],
    tags: ["Next.js", "Tailwind", "Framer Motion"],
  },
];


// ======== UTILS ========
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

const useKeyboard = (bindings) => {
  useEffect(() => {
    const onKey = (e) => {
      const key = (e.key || "").toLowerCase();
      if (bindings[key]) bindings[key](e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bindings]);
};

// ======== COMPONENTS ========
const Pill = ({ children }) => {
  const { theme } = useTheme();
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs/5 theme-transition ${
      theme === 'light' 
        ? 'text-slate-600 border-slate-300 bg-slate-100' 
        : 'text-zinc-300 border-zinc-700/60 bg-zinc-900/40'
    }`}>
      {children}
    </span>
  );
};

const Section = ({ id, title, icon: Icon, children }) => {
  const { theme } = useTheme();
  return (
    <section id={id} className="relative scroll-mt-24 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 flex items-center gap-3">
          {Icon ? <Icon className={`h-5 w-5 theme-transition ${theme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`} /> : null}
          <h2 className={`text-2xl font-semibold theme-transition ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
};

const GradientText = ({ children }) => (
  <span className={classNames("bg-clip-text text-transparent bg-gradient-to-r", PROFILE.accent)}>
    {children}
  </span>
);

const Nav = ({ onOpenCmd }) => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="#top" className={`text-2xl font-bold transition-colors ${theme === 'light' ? 'text-slate-900 hover:text-slate-700' : 'text-zinc-100 hover:text-white'}`}>
          <GradientText>Adam Nassef</GradientText>
        </a>
        <div className="hidden gap-8 md:flex items-center">
          {[
            ["About", "#about"],
            ["Projects", "#projects"],
            ["Experience", "#experience"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} className={`text-lg font-semibold transition-colors ${theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-300 hover:text-white'}`}>
              {label}
            </a>
          ))}
          <button
            onClick={toggleTheme}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300 ${
              theme === 'light' 
                ? 'border-slate-300 bg-slate-100 hover:bg-slate-200' 
                : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900'
            }`}
            aria-label="Toggle theme"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-blue-400" />
              )}
            </motion.div>
          </button>
          <button
            onClick={onOpenCmd}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-base font-medium transition-colors ${
              theme === 'light' 
                ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200' 
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900'
            }`}
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
            <kbd className={`ml-1 hidden rounded px-1.5 text-[10px] md:inline transition-colors ${
              theme === 'light' 
                ? 'bg-slate-200 text-slate-500' 
                : 'bg-zinc-800 text-zinc-400'
            }`}>K</kbd>
          </button>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className={`h-6 w-6 transition-colors ${theme === 'light' ? 'text-slate-600' : 'text-zinc-300'}`} /> : <Menu className={`h-6 w-6 transition-colors ${theme === 'light' ? 'text-slate-600' : 'text-zinc-300'}`} />}
        </button>
      </div>
      {open && (
        <div className={`border-t px-4 py-3 md:hidden transition-colors ${theme === 'light' ? 'border-slate-200' : 'border-zinc-800/80'}`}>
          {[
            ["About", "#about"],
            ["Projects", "#projects"],
            ["Experience", "#experience"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href} className={`block py-2 transition-colors ${theme === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-300'}`}>
              {label}
            </a>
          ))}
          <div className="mt-2 flex gap-2">
            <button
              onClick={toggleTheme}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300 ${
                theme === 'light' 
                  ? 'border-slate-300 bg-slate-100 hover:bg-slate-200' 
                  : 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900'
              }`}
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-400" />
                )}
              </motion.div>
            </button>
            <button
              onClick={onOpenCmd}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                theme === 'light' 
                  ? 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200' 
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <Search className="h-4 w-4" /> Open search
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);
  const { theme } = useTheme();

  return (
    <div ref={ref} className={`relative isolate overflow-hidden theme-transition pt-24 ${theme === 'light' ? 'bg-white' : 'bg-zinc-950'}`}>
      <motion.div style={{ y, opacity }} className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_.8fr]">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs theme-transition ${
              theme === 'light' 
                ? 'border-slate-300 bg-slate-100 text-slate-600' 
                : 'border-zinc-800 bg-zinc-900/40 text-zinc-400'
            }`}>
              <TerminalSquare className="h-3.5 w-3.5" />
              shipping in public
            </div>
            <h1 className={`mt-4 text-4xl font-bold tracking-tight sm:text-6xl theme-transition ${
              theme === 'light' ? 'text-slate-900' : 'text-zinc-50'
            }`}>
              Shipping <GradientText>useful software</GradientText> with intent
            </h1>
            <p className={`mt-6 md:text-lg theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>{PROFILE.blurb}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium theme-transition ${
                  theme === 'light' 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-white/90 text-zinc-900 hover:bg-white'
                }`}
              >
                <Rocket className="h-4 w-4" /> View projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={PROFILE.resumeUrl}
                download="Adam_Nassef_Resume_2025.pdf"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm theme-transition ${
                  theme === 'light' 
                    ? 'border-slate-300 text-slate-700 hover:bg-slate-50' 
                    : 'border-zinc-800 text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Download className="h-4 w-4" /> Resume
              </a>
              <div className="ml-auto hidden items-center gap-3 md:flex">
                <a href={PROFILE.linkedin} aria-label="LinkedIn" className={`theme-transition ${theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}><Linkedin /></a>
                <a href={PROFILE.instagram} aria-label="Instagram" className={`theme-transition ${theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href={`mailto:${PROFILE.email}`} aria-label="Email" className={`theme-transition ${theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-white'}`}><Mail /></a>
              </div>
            </div>
          </div>
          <div className={`relative order-first h-56 w-56 place-self-center overflow-hidden rounded-3xl border shadow-2xl md:order-last md:h-72 md:w-72 theme-transition ${
            theme === 'light' 
              ? 'border-slate-200 bg-slate-50' 
              : 'border-zinc-800 bg-zinc-900/40'
          }`}>
            <img alt="headshot" src={PROFILE.headshot} className="h-full w-full object-cover" />
          </div>
        </div>
      </motion.div>

      {/* background blob */}
      <div aria-hidden className={`absolute -top-32 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full blur-3xl theme-transition ${
        theme === 'light' 
          ? 'bg-gradient-to-tr from-fuchsia-500/5 via-violet-500/5 to-sky-500/5' 
          : 'bg-gradient-to-tr from-fuchsia-500/10 via-violet-500/10 to-sky-500/10'
      }`} />
    </div>
  );
};

const ProjectCard = ({ p }) => {
  const { theme } = useTheme();
  const mainLink = p.links && p.links.length > 0 ? p.links[0].href : null;
  const isExternal = mainLink && (mainLink.startsWith('http://') || mainLink.startsWith('https://'));
  
  const cardContent = (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col justify-between rounded-2xl border p-5 theme-transition cursor-pointer ${
        theme === 'light' 
          ? 'border-slate-200 bg-slate-50 hover:border-slate-300' 
          : 'border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700'
      }`}
    >
      <div>
        <div className={`flex items-center gap-2 text-xs theme-transition ${theme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
          <Star className="h-3.5 w-3.5" />
          {p.subtitle}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <h3 className={`text-lg font-semibold theme-transition ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>{p.title}</h3>
          {p.inProgress && (
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium theme-transition ${
              theme === 'light' 
                ? 'text-amber-700 border-amber-300 bg-amber-50' 
                : 'text-amber-400 border-amber-700/60 bg-amber-900/30'
            }`}>
              In Progress
            </span>
          )}
        </div>
        <p className={`mt-2 text-sm theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>{p.description}</p>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {p.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
        {p.links && p.links.length > 0 && (
          <div className="ml-auto flex items-center gap-3">
            {p.links.map((l) => (
              <span key={l.label} onClick={(e) => e.stopPropagation()} className={`inline-flex items-center gap-1 text-sm theme-transition ${
                theme === 'light' 
                  ? 'text-slate-600 hover:text-slate-900' 
                  : 'text-zinc-300 hover:text-white'
              }`}>
                {l.label} <ExternalLink className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );

  if (mainLink) {
    if (isExternal) {
      return (
        <a href={mainLink} target="_blank" rel="noopener noreferrer" className="block">
          {cardContent}
        </a>
      );
    }
    return (
      <Link to={mainLink} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

const TimelineItem = ({ role, org, time, points = [], links = [] }) => {
  const { theme } = useTheme();
  return (
    <div className="relative pl-8">
      <div className={`absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full z-10 border-4 theme-transition ${
        theme === 'light' 
          ? 'bg-slate-400 border-white' 
          : 'bg-zinc-600 border-zinc-950'
      }`} />
      <div className={`rounded-xl border p-4 relative z-10 theme-transition ${
        theme === 'light' 
          ? 'border-slate-200 bg-slate-50' 
          : 'border-zinc-800/80 bg-zinc-900/40'
      }`}>
        <div className="flex flex-wrap items-baseline gap-2">
          <h4 className={`font-medium theme-transition ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>{role}</h4>
          <span className={`text-sm theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>{org}</span>
          <span className={`ml-auto text-xs theme-transition ${theme === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>{time}</span>
        </div>
        <ul className={`mt-2 list-disc space-y-1 pl-5 text-sm theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
          {points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
        {links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs theme-transition ${
                  theme === 'light' 
                    ? 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900' 
                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                }`}
              >
                {link.label} <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className={`border-t py-10 theme-transition ${
      theme === 'light' 
        ? 'border-slate-200 bg-white' 
        : 'border-zinc-800/80 bg-zinc-950'
    }`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className={`text-sm theme-transition ${theme === 'light' ? 'text-slate-500' : 'text-zinc-500'}`}>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
          <div className={`flex items-center gap-4 theme-transition ${theme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
            <a href={PROFILE.linkedin} className={`theme-transition ${theme === 'light' ? 'hover:text-slate-900' : 'hover:text-white'}`}><Linkedin className="h-5 w-5" /></a>
            <a href={`mailto:${PROFILE.email}`} className={`theme-transition ${theme === 'light' ? 'hover:text-slate-900' : 'hover:text-white'}`}><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const CommandPalette = ({ open, setOpen }) => {
  const [q, setQ] = useState("");
  const { theme } = useTheme();
  const contentRef = useRef(null);
  const items = useMemo(
    () => [
      { label: "Go to About", href: "#about" },
      { label: "Go to Projects", href: "#projects" },
      { label: "Go to Experience", href: "#experience" },
      { label: "Contact", href: "#contact" },
      { label: "Open Resume", href: PROFILE.resumeUrl },
      { label: "Email Adam", href: `mailto:${PROFILE.email}` },
    ],
    []
  );

  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const onDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onDown);
    return () => window.removeEventListener("keydown", onDown);
  }, [setOpen]);

  const handleBackdropClick = (e) => {
    // Close if clicking on the backdrop (not the content)
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  if (!open) return null;
  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/50 p-4 backdrop-blur"
      onClick={handleBackdropClick}
    >
      <div 
        ref={contentRef}
        className={`mx-auto w-full max-w-xl rounded-2xl border shadow-2xl theme-transition ${
          theme === 'light' 
            ? 'border-slate-200 bg-white' 
            : 'border-zinc-800 bg-zinc-950'
        }`}
      >
        <div className={`flex items-center gap-2 border-b px-4 py-3 theme-transition ${
          theme === 'light' 
            ? 'border-slate-200' 
            : 'border-zinc-800'
        }`}>
          <Search className={`h-4 w-4 theme-transition ${theme === 'light' ? 'text-slate-500' : 'text-zinc-400'}`} />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a command…"
            className={`w-full bg-transparent text-sm outline-none theme-transition ${
              theme === 'light' 
                ? 'text-slate-900 placeholder-slate-500' 
                : 'text-zinc-200 placeholder-zinc-500'
            }`}
          />
          <kbd className={`rounded px-1.5 text-[10px] theme-transition ${
            theme === 'light' 
              ? 'bg-slate-100 text-slate-500' 
              : 'bg-zinc-800 text-zinc-400'
          }`}>Esc</kbd>
        </div>
        <div className="max-h-80 overflow-auto p-2">
          {filtered.map((i) => (
            <a
              key={i.label}
              href={i.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 text-sm theme-transition ${
                theme === 'light' 
                  ? 'text-slate-700 hover:bg-slate-100' 
                  : 'text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              {i.label}
            </a>
          ))}
          {filtered.length === 0 && (
            <div className={`px-3 py-6 text-center text-sm theme-transition ${
              theme === 'light' ? 'text-slate-500' : 'text-zinc-500'
            }`}>No results</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function GoatedPersonalSite() {
  const [openCmd, setOpenCmd] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Fade in when component mounts
    setIsVisible(true);
  }, []);
  
  useKeyboard({
    k: (e) => {
      if (e.ctrlKey || e.metaKey) return; // reserve for browsers
      // Don't trigger if user is typing in an input or textarea
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      e.stopPropagation();
      setOpenCmd(true);
    },
    "/": (e) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      e.stopPropagation();
      setOpenCmd(true);
    },
    g: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }),
  });

  return (
    <>
      {!isVisible && (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center theme-transition ${theme === 'light' ? 'bg-white' : 'bg-zinc-950'}`}>
          <div className={`font-mono text-sm uppercase tracking-widest theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
            Initializing...
          </div>
        </div>
      )}
      <div 
        id="top" 
        className={`min-h-screen theme-transition transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} ${theme === 'light' ? 'bg-white text-slate-900' : 'bg-zinc-950 text-zinc-50'}`}
      >
      <Nav onOpenCmd={() => setOpenCmd(true)} />
      <Hero />

      <main>
        <Section id="about" title="About" icon={PlayCircle}>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <p className={`theme-transition ${theme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                I grew up in Bonn, Germany. I study Cognitive Science with minors in German and Psychology at the University of Toronto.
                I founded a marketing studio, interned at Amazon and Lufthansa Technik, and focus on building practical, thoughtful products.
              </p>
              <p className={`mt-4 theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>
                Interests: perception and decision‑making, attention and memory, aviation.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["SQL", "R", "Prototyping", "Wireframing", "Figma", "A/B Testing", "QuickSight"].map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </div>
            <div className={`rounded-2xl border p-4 theme-transition ${
              theme === 'light' 
                ? 'border-slate-200 bg-slate-50' 
                : 'border-zinc-800/80 bg-zinc-900/40'
            }`}>
              <div className={`text-sm theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>Now</div>
              <ul className={`mt-2 space-y-2 text-sm theme-transition ${theme === 'light' ? 'text-slate-700' : 'text-zinc-300'}`}>
                <li>• Finishing bachelors degree</li>
                <li>• Building and shipping new products</li>
                <li>• Preparing for my transition into full-time PM</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="projects" title="Projects" icon={Rocket}>
          <div className="grid gap-5 md:grid-cols-2">
            <ProjectCard 
              p={{
                title: "SkyGrid",
                subtitle: "Real-time Flight Tracking",
                description: "Interactive flight tracking application with live aircraft data visualization.",
                links: [{ href: "/skygrid", label: "View Project" }],
                tags: ["React", "Mapbox", "TypeScript", "Real-time"]
              }} 
            />
            <ProjectCard 
              p={{
                title: "Deutschly",
                subtitle: "German Grammar Learning Platform",
                description: "German grammar learning platform for mastering articles and cases.",
                links: [{ href: "https://www.deutschly.com/", label: "Visit Site" }],
                tags: ["Education", "German", "Grammar", "Language Learning"],
                inProgress: true
              }} 
            />
            <ProjectCard 
              p={{
                title: "Giftendo",
                subtitle: "Gift Registry Platform",
                description: "Online platform for creating and sharing gift registries for weddings, events, and personal occasions.",
                links: [{ href: "https://www.giftendo.com/", label: "Visit Site" }],
                tags: ["Web Platform", "Gift Registry", "Events", "Weddings"],
                inProgress: true
              }} 
            />
            {/* Hidden project cards for future use - uncomment when ready */}
            {/* 
            {PROJECTS.map((p) => (
              <ProjectCard key={p.title} p={p} />)
            )}
            */}
          </div>
        </Section>

        <Section id="experience" title="Experience" icon={Notebook}>
          <div className="relative">
            <div className={`absolute top-0 bottom-0 w-0.5 theme-transition ${theme === 'light' ? 'bg-slate-300' : 'bg-zinc-600'}`} style={{ left: '30px' }}></div>
            <div className="space-y-8 pl-8">
              <TimelineItem
                role="Product Management Intern"
                org="Amazon"
                time="May 2025 – Aug 2025 · Berlin, Germany"
                points={[
                  "Owned end-to-end development and launch of OpsClock Core, a React-based capacity planning platform",
                  "Reduced manual analysis time by 80% and drove rapid stakeholder adoption",
                  "Led deployment of Laminar (internal PM tool) to standardize simulation intake workflows",
                  "Created centralized WikiX knowledge hub to improve documentation and reduce onboarding time"
                ]}
              />
              <TimelineItem
                role="Product Development Intern"
                org="Lufthansa Technik"
                time="May 2024 – Sep 2024 · Hamburg, Germany"
                points={[
                  "Designed, prototyped, and led certification of new cabin connectivity control feature",
                  "Collaborated with cross-functional teams on VIP/Business aircraft cabin systems",
                  "Led full overhaul of Jira workflows and dashboards in Agile environment",
                  "Aligned stakeholders during key product lifecycle reviews and steering boards"
                ]}
                links={[
                  { label: "FCC Certification", href: "https://fccid.io/2BKRFSAC0522001001" }
                ]}
              />
              <TimelineItem
                role="Founder"
                org="Minty Marketing Solutions LTD"
                time="Nov 2021 – Aug 2022 · London, United Kingdom"
                points={[
                  "Founded marketing and product launch agency, driving $1.5M+ in annual revenue",
                  "Led go-to-market strategy for product launches, including $1M+ revenue campaign in 24 hours",
                  "Collaborated directly with clients on product positioning across 20+ campaigns",
                  "Hired and managed 40+ person contractor team, built internal workflows and SOPs"
                ]}
                links={[
                  { label: "Company Website", href: "https://mintysolutions.com" }
                ]}
              />
            </div>
          </div>
        </Section>

        <Section id="contact" title="Contact" icon={Mail}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href={`mailto:${PROFILE.email}`} className={`group flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 theme-transition ${
                theme === 'light' 
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                  : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700'
              }`}>
                <div className={`p-3 rounded-full transition-colors mb-4 theme-transition ${
                  theme === 'light' 
                    ? 'bg-slate-200 group-hover:bg-slate-300' 
                    : 'bg-zinc-800/50 group-hover:bg-zinc-700/50'
                }`}>
                  <Mail className={`h-6 w-6 theme-transition ${
                    theme === 'light' 
                      ? 'text-slate-600 group-hover:text-slate-900' 
                      : 'text-zinc-300 group-hover:text-white'
                  }`} />
                </div>
                <h3 className={`font-medium mb-1 theme-transition ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>Email</h3>
                <p className={`text-sm text-center theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>Get in touch directly</p>
              </a>
              <a href={PROFILE.linkedin} className={`group flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 theme-transition ${
                theme === 'light' 
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                  : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700'
              }`}>
                <div className={`p-3 rounded-full transition-colors mb-4 theme-transition ${
                  theme === 'light' 
                    ? 'bg-slate-200 group-hover:bg-slate-300' 
                    : 'bg-zinc-800/50 group-hover:bg-zinc-700/50'
                }`}>
                  <Linkedin className={`h-6 w-6 theme-transition ${
                    theme === 'light' 
                      ? 'text-slate-600 group-hover:text-slate-900' 
                      : 'text-zinc-300 group-hover:text-white'
                  }`} />
                </div>
                <h3 className={`font-medium mb-1 theme-transition ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>LinkedIn</h3>
                <p className={`text-sm text-center theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>Professional network</p>
              </a>
              <a href={PROFILE.instagram} className={`group flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 theme-transition ${
                theme === 'light' 
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300' 
                  : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700'
              }`}>
                <div className={`p-3 rounded-full transition-colors mb-4 theme-transition ${
                  theme === 'light' 
                    ? 'bg-slate-200 group-hover:bg-slate-300' 
                    : 'bg-zinc-800/50 group-hover:bg-zinc-700/50'
                }`}>
                  <svg className={`h-6 w-6 theme-transition ${
                    theme === 'light' 
                      ? 'text-slate-600 group-hover:text-slate-900' 
                      : 'text-zinc-300 group-hover:text-white'
                  }`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className={`font-medium mb-1 theme-transition ${theme === 'light' ? 'text-slate-900' : 'text-zinc-100'}`}>Instagram</h3>
                <p className={`text-sm text-center theme-transition ${theme === 'light' ? 'text-slate-600' : 'text-zinc-400'}`}>Follow my journey</p>
              </a>
            </div>
        </Section>
      </main>

      <Footer />

      <CommandPalette open={openCmd} setOpen={setOpenCmd} />

      {/* Keyboard hint */}
      <div className={`fixed bottom-4 right-4 hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs md:flex theme-transition ${
        theme === 'light' 
          ? 'border-slate-200 bg-white/90 text-slate-600' 
          : 'border-zinc-800 bg-zinc-950/90 text-zinc-400'
      }`}>
        <Search className="h-3.5 w-3.5" /> Press <kbd className={`mx-1 rounded px-1.5 theme-transition ${
          theme === 'light' 
            ? 'bg-slate-100 text-slate-500' 
            : 'bg-zinc-800 text-zinc-400'
        }`}>K</kbd> to search
      </div>

      {/* Accent gradient */}
      <div className={`pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t theme-transition ${
        theme === 'light' 
          ? 'opacity-10' 
          : 'opacity-20'
      } ${classNames(PROFILE.accent)}`} />
      </div>
    </>
  );
}

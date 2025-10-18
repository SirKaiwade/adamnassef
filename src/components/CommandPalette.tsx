import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, FileText, Mail, Github, Linkedin, Twitter } from 'lucide-react';

const commands = [
  { name: 'About', section: 'about', icon: Search, type: 'navigate' },
  { name: 'Projects', section: 'projects', icon: Search, type: 'navigate' },
  { name: 'Experience', section: 'experience', icon: Search, type: 'navigate' },
  { name: 'Writing', section: 'writing', icon: Search, type: 'navigate' },
  { name: 'Contact', section: 'contact', icon: Search, type: 'navigate' },
  { name: 'Resume', href: '/resume.pdf', icon: FileText, type: 'link' },
  { name: 'Email', href: 'mailto:adam@example.com', icon: Mail, type: 'link' },
  { name: 'GitHub', href: 'https://github.com', icon: Github, type: 'link' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin, type: 'link' },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter, type: 'link' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === '/' && !isOpen) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          executeCommand(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const executeCommand = (cmd: typeof commands[0]) => {
    if (cmd.type === 'navigate' && cmd.section) {
      const element = document.getElementById(cmd.section);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (cmd.type === 'link' && cmd.href) {
      window.open(cmd.href, '_blank');
    }
    setIsOpen(false);
    setSearch('');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden mx-4">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
                  <Search className="text-zinc-500" size={20} />
                  <input
                    type="text"
                    placeholder="Type a command or search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none"
                    autoFocus
                  />
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <kbd className="px-2 py-1 bg-zinc-800 rounded">ESC</kbd>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredCommands.length > 0 ? (
                    <div className="py-2">
                      {filteredCommands.map((cmd, index) => {
                        const Icon = cmd.icon;
                        return (
                          <button
                            key={cmd.name}
                            onClick={() => executeCommand(cmd)}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                              index === selectedIndex
                                ? 'bg-zinc-800 text-white'
                                : 'text-zinc-400 hover:bg-zinc-800/50'
                            }`}
                          >
                            <Icon size={18} />
                            <span>{cmd.name}</span>
                            <span className="ml-auto text-xs text-zinc-600">
                              {cmd.type === 'navigate' ? 'Navigate' : 'Open'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-zinc-500">
                      No results found
                    </div>
                  )}
                </div>

                <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded">↵</kbd>
                      Select
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Command size={12} />
                    <span>K or /</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 px-4 py-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-300 flex items-center gap-2 shadow-lg z-40"
      >
        <Command size={16} />
        <span className="text-sm">Press K</span>
      </motion.button>
    </>
  );
}

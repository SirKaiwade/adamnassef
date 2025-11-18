import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail, FileText } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-sky-400/20 via-violet-400/20 to-fuchsia-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-fuchsia-400/20 via-violet-400/20 to-sky-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Adam Nassef
            </motion.h1>
            <motion.p
              className="text-2xl md:text-3xl bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Developer & Creative Technologist
            </motion.p>
            <motion.p
              className="text-lg text-zinc-400 mb-8 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Building elegant digital experiences at the intersection of design and engineering.
              Passionate about creating products that people love to use.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <a
                href="#projects"
                className="px-6 py-3 bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-6 py-3 bg-zinc-800/50 border border-zinc-700 text-white rounded-lg font-medium hover:bg-zinc-800 transition-all duration-300"
              >
                Get in Touch
              </a>
            </motion.div>
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:adam@example.com" className="text-zinc-400 hover:text-white transition-colors">
                <Mail size={24} />
              </a>
              <a href="/Nassef_Adam_Resume_2025.pdf" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <FileText size={24} />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 rounded-full blur-2xl opacity-30" />
              <img
                src="https://media.licdn.com/dms/image/v2/D4D03AQFakq3HVOpZ-w/profile-displayphoto-shrink_800_800/B4DZdyp9m4GUAc-/0/1749975292738?e=1762387200&v=beta&t=Q5OBKvs_eOiySU4EUYuaNYCC5ai8lfOdEF2RCMy56Is"
                alt="Adam Nassef"
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-zinc-800"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <a href="#about" className="text-zinc-400 hover:text-white transition-colors">
            <ArrowDown size={32} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

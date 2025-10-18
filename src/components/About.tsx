import { motion } from 'framer-motion';
import { Code2, Palette, Zap, Coffee } from 'lucide-react';

const skills = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS',
  'Next.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL',
  'Framer Motion', 'Figma', 'Git', 'CI/CD'
];

export default function About() {
  return (
    <section id="about" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            className="md:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8">
              <p className="text-zinc-300 text-lg leading-relaxed mb-4">
                I'm a software engineer who loves turning ideas into reality through code.
                With a background in full-stack development and a keen eye for design, I create
                digital experiences that are both beautiful and functional.
              </p>
              <p className="text-zinc-300 text-lg leading-relaxed mb-4">
                Currently, I'm focused on building scalable web applications and exploring
                the intersection of AI and user experience. I believe great software should
                feel magical while being built on solid engineering principles.
              </p>
              <p className="text-zinc-300 text-lg leading-relaxed">
                When I'm not coding, you'll find me exploring new coffee shops, reading about
                design systems, or tinkering with side projects that scratch my creative itch.
              </p>
            </div>

            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Code2 className="text-violet-400" size={24} />
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full text-zinc-300 text-sm hover:border-violet-400 hover:text-white transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={24} />
                Now
              </h3>
              <div className="space-y-4 text-zinc-300">
                <div className="flex items-start gap-3">
                  <Coffee className="text-sky-400 mt-1 flex-shrink-0" size={20} />
                  <p>Building AI-powered productivity tools</p>
                </div>
                <div className="flex items-start gap-3">
                  <Palette className="text-fuchsia-400 mt-1 flex-shrink-0" size={20} />
                  <p>Learning advanced animation techniques with Framer</p>
                </div>
                <div className="flex items-start gap-3">
                  <Code2 className="text-violet-400 mt-1 flex-shrink-0" size={20} />
                  <p>Contributing to open-source React libraries</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <p className="text-sm text-zinc-500">Last updated: September 2025</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

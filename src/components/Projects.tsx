import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
  {
    title: 'Amazon Internship Project',
    description: 'Developed internal tooling for logistics optimization, reducing processing time by 40% and improving team efficiency.',
    tags: ['React', 'AWS', 'TypeScript', 'DynamoDB'],
    link: '#',
    github: null,
    gradient: 'from-orange-500 to-yellow-500',
  },
  {
    title: 'Lufthansa Digital Platform',
    description: 'Built customer-facing web application for flight management with real-time updates and seamless booking experience.',
    tags: ['Next.js', 'PostgreSQL', 'Redis', 'Tailwind'],
    link: '#',
    github: null,
    gradient: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Minty Marketing',
    description: 'Full-stack marketing analytics platform with AI-powered insights for small businesses to optimize their campaigns.',
    tags: ['Python', 'Flask', 'React', 'Chart.js'],
    link: '#',
    github: 'https://github.com',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    title: 'AI Website Generator',
    description: 'Automated website creation tool using GPT-4 to generate responsive, accessible websites from natural language prompts.',
    tags: ['OpenAI', 'Node.js', 'React', 'MongoDB'],
    link: '#',
    github: 'https://github.com',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    title: 'E-Commerce Platform',
    description: 'Modern headless commerce solution with Stripe integration, inventory management, and real-time order tracking.',
    tags: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
    link: '#',
    github: 'https://github.com',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    title: 'Developer Portfolio Tool',
    description: 'SaaS platform for developers to create and customize portfolio websites with one-click deployment.',
    tags: ['React', 'Supabase', 'Vercel', 'Tailwind'],
    link: '#',
    github: 'https://github.com',
    gradient: 'from-cyan-500 to-teal-600',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 h-full flex flex-col hover:border-zinc-700 transition-all duration-300">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.gradient} mb-4 flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white/20 rounded backdrop-blur-sm" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:via-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300">
                  {project.title}
                </h3>

                <p className="text-zinc-400 mb-4 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4 border-t border-zinc-800">
                  <a
                    href={project.link}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm">View Project</span>
                  </a>
                  {project.github && (
                    <a
                      href={project.github}
                      className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
                    >
                      <Github size={18} />
                      <span className="text-sm">Code</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

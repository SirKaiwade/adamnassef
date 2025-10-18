import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const experiences = [
  {
    role: 'Software Engineer Intern',
    company: 'Amazon',
    period: 'Summer 2024',
    description: 'Developed internal logistics optimization tools',
    points: [
      'Built React-based dashboard reducing processing time by 40%',
      'Implemented AWS Lambda functions for real-time data processing',
      'Collaborated with cross-functional teams across 3 time zones',
    ],
  },
  {
    role: 'Full Stack Developer',
    company: 'Lufthansa Systems',
    period: '2023 - 2024',
    description: 'Created customer-facing flight management platform',
    points: [
      'Architected scalable Next.js application serving 100K+ users',
      'Integrated real-time flight updates with WebSocket technology',
      'Improved booking conversion rate by 25% through UX optimization',
    ],
  },
  {
    role: 'Founder & Lead Developer',
    company: 'Minty Marketing',
    period: '2022 - Present',
    description: 'AI-powered marketing analytics for small businesses',
    points: [
      'Built end-to-end SaaS platform from concept to launch',
      'Implemented machine learning models for campaign optimization',
      'Grew user base to 500+ active businesses in first year',
    ],
  },
  {
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    period: '2021 - 2022',
    description: 'Custom websites and web applications for clients',
    points: [
      'Delivered 20+ projects for startups and small businesses',
      'Specialized in React, Node.js, and modern JAMstack solutions',
      'Maintained 100% client satisfaction rate',
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Experience
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 mb-12" />
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-sky-400 via-violet-400 to-fuchsia-400" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.company + exp.period}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-8 md:pl-20"
              >
                <div className="absolute left-[-8px] md:left-[24px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400" />

                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-all duration-300">
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Briefcase size={16} />
                        <span>{exp.company}</span>
                      </div>
                    </div>
                    <span className="px-4 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-sm text-zinc-400">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-zinc-300 mb-4">
                    {exp.description}
                  </p>

                  <ul className="space-y-2">
                    {exp.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-zinc-400">
                        <span className="text-violet-400 mt-1">▸</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

const articles = [
  {
    title: 'Building Scalable React Applications with TypeScript',
    date: 'September 15, 2025',
    readTime: '8 min read',
    excerpt: 'A deep dive into patterns and practices for maintaining large React codebases with TypeScript.',
    tags: ['React', 'TypeScript', 'Architecture'],
  },
  {
    title: 'The Art of Code Review: Beyond Finding Bugs',
    date: 'August 28, 2025',
    readTime: '6 min read',
    excerpt: 'How effective code reviews can improve team culture and code quality simultaneously.',
    tags: ['Engineering', 'Collaboration'],
  },
  {
    title: 'Modern Animation Techniques with Framer Motion',
    date: 'August 12, 2025',
    readTime: '10 min read',
    excerpt: 'Creating delightful user experiences with performant animations in React applications.',
    tags: ['React', 'Animation', 'UX'],
  },
  {
    title: 'From Idea to MVP: Lessons from Building Minty Marketing',
    date: 'July 20, 2025',
    readTime: '12 min read',
    excerpt: 'The journey of building and launching a SaaS product from scratch in 6 months.',
    tags: ['Startup', 'Product', 'SaaS'],
  },
];

export default function Writing() {
  return (
    <section id="writing" className="py-24 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Writing
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400 mb-12" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
            >
              <div className="bg-zinc-950/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 h-full hover:border-zinc-700 transition-all duration-300">
                <div className="flex items-center gap-4 text-sm text-zinc-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-sky-400 group-hover:via-violet-400 group-hover:to-fuchsia-400 group-hover:bg-clip-text transition-all duration-300">
                  {article.title}
                </h3>

                <p className="text-zinc-400 mb-4">
                  {article.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-xs text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-violet-400 group-hover:gap-3 transition-all duration-300">
                  <span className="text-sm font-medium">Read more</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

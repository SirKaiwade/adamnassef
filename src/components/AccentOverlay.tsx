import { motion } from 'framer-motion';

export default function AccentOverlay() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-30 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-violet-600/10 via-transparent to-transparent"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}

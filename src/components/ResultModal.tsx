import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultModalProps {
  isOpen: boolean;
  prize: string;
  onClaim: () => void;
}

const Confetti: React.FC = () => {
  const colors = ['#39FF14', '#FFD700', '#FF6B6B', '#00CED1', '#9B59B6', '#FF8C00'];
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 100,
            rotate: Math.random() * 720,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'easeIn',
          }}
          style={{
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0',
          }}
        />
      ))}
    </div>
  );
};

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, prize, onClaim }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Confetti />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative bg-gradient-to-b from-card to-background rounded-2xl p-8 max-w-md w-full text-center neon-border"
            >
              {/* Celebration emoji */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Congratulations!
              </motion.h2>

              {/* Prize */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6"
              >
                <p className="text-muted-foreground mb-2">You won:</p>
                <p className="text-2xl md:text-3xl font-bold neon-text">
                  {prize}
                </p>
              </motion.div>

              {/* Decorative stars */}
              <div className="absolute -top-4 -left-4 text-4xl animate-float">✨</div>
              <div className="absolute -top-4 -right-4 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-4xl animate-float" style={{ animationDelay: '1s' }}>🏆</div>

              {/* Claim Button */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={onClaim}
                className="spin-button w-full"
              >
                Claim Offer
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResultModal;

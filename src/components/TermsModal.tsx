import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const terms = [
    'Offer valid from 25 December 2025 to 31 December 2025 only.',
    'Payment must be made at the gym location.',
    'Offer NOT valid at Vanamthopu & BV Nagar branches.',
    'One entry per person - duplicate entries will be disqualified.',
    'Prize is non-transferable and cannot be exchanged for cash.',
    'Management reserves the right to modify or cancel the offer.',
    'Decision of the management is final and binding.',
    'Winner must claim the prize within 7 days of the offer end date.',
    'Valid ID proof required at the time of claiming the prize.',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gradient-to-b from-card to-background rounded-2xl p-6 md:p-8 max-w-lg w-full neon-border max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-foreground mb-6">
              Terms & Conditions
            </h2>

            <ul className="space-y-3">
              {terms.map((term, index) => (
                <li key={index} className="flex gap-3 text-muted-foreground">
                  <span className="text-primary flex-shrink-0">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={onClose}
              className="spin-button w-full mt-6"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TermsModal;

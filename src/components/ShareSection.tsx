import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import TermsModal from './TermsModal';

interface ShareSectionProps {
  isVisible: boolean;
  prize: string;
  prizeIcon: string;
}

const INSTAGRAM_URL = 'https://www.instagram.com/futurefitnessgym_nellore/';
const FACEBOOK_URL = 'https://www.facebook.com/FutureFitnessFamilyGYM/';

const ShareSection: React.FC<ShareSectionProps> = ({ isVisible, prize, prizeIcon }) => {
  const [showTerms, setShowTerms] = useState(false);

  if (!isVisible) return null;

  const shareMessage = encodeURIComponent(
    `🎉 I just spun & won at Future Fitness Gym - Nellore!\n\n💪 My Prize: ${prize}\n\n🔥 New Year, New Resolution!\n\nTry your luck too! 🎯`
  );

  const whatsappUrl = `https://wa.me/?text=${shareMessage}`;
  const pageUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-4 text-center"
    >
      {/* Confetti animation background */}
      <div className="confetti-container absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#39FF14', '#FF6B6B', '#FFD700', '#00CED1', '#9B59B6', '#FF8C00'][Math.floor(Math.random() * 6)],
            }}
          />
        ))}
      </div>

      {/* Celebration icon */}
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <span className="text-4xl">🎊</span>
        </motion.div>

        {/* Main title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-6"
        >
          You're All Set!
        </motion.h2>

        {/* Reward display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-6"
        >
          <p className="text-muted-foreground text-lg mb-2">Your Reward</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{prizeIcon}</span>
            <span className="text-2xl md:text-3xl font-bold text-primary">{prize}</span>
          </div>
        </motion.div>

        {/* Visit message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mb-2"
        >
          Visit{' '}
          <a
            href="https://futurefitnessgymnellore.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            Future Fitness Gym
          </a>{' '}
          to claim your membership!
        </motion.p>

        {/* Email confirmation message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-muted-foreground text-sm mb-8"
        >
          You will receive an email shortly.
        </motion.p>

        {/* Share section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share with friends</span>
          </div>

          {/* WhatsApp button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Share on WhatsApp
          </a>

          {/* Copy Link button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-3 w-full py-4 bg-transparent border-2 border-primary text-primary font-semibold rounded-xl transition-all duration-300 hover:bg-primary/10 hover:scale-[1.02]"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy Link
          </button>
        </motion.div>

        {/* T&C Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <button
            onClick={() => setShowTerms(true)}
            className="text-muted-foreground hover:text-primary underline text-sm transition-colors"
          >
            T&C Apply
          </button>
        </motion.div>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </motion.div>
  );
};

export default ShareSection;

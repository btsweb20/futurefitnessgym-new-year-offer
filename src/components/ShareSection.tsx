import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import TermsModal from './TermsModal';

interface ShareSectionProps {
  isVisible: boolean;
  prize: string;
  prizeIcon: string;
  userName: string;
}

const ShareSection: React.FC<ShareSectionProps> = ({ isVisible, prize, prizeIcon, userName }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  // Share link
  const shareLink = 'https://futurefitnessgym-new-year-offer.lovable.app';

  const shareMessage = `🔥 I just won "${prize}" from Future Fitness Gym! 💪

You can also try your luck and win amazing gym membership rewards — including a chance to get 1 YEAR FREE membership!

Tap here and spin now 👇
${shareLink}

Hurry! Limited-time offer 💥`;

  const handleWhatsAppShare = async () => {
    setIsSharing(true);
    
    try {
      // Capture screenshot
      if (captureRef.current) {
        const canvas = await html2canvas(captureRef.current, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          useCORS: true,
          logging: false,
        });
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          }, 'image/png', 1.0);
        });
        
        const file = new File([blob], 'future-fitness-reward.png', { type: 'image/png' });
        
        // Try Web Share API with files (works on mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: shareMessage,
            files: [file],
          });
          setIsSharing(false);
          return;
        }
        
        // Fallback for desktop: Download image and open WhatsApp
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'future-fitness-reward.png';
        downloadLink.click();
        
        // Open WhatsApp with message
        setTimeout(() => {
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
          window.open(whatsappUrl, '_blank');
        }, 500);
      }
    } catch (error) {
      // Fallback: Open WhatsApp with just the message
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
    
    setIsSharing(false);
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

      {/* Capturable content for screenshot */}
      <div ref={captureRef} className="relative z-10 bg-background rounded-2xl p-6">
        {/* Celebration icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <span className="text-4xl">🎊</span>
        </motion.div>

        {/* Main title with user name */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-6"
        >
          {userName ? `${userName} won this!` : "You're All Set!"}
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
          className="text-muted-foreground text-sm mb-6"
        >
          You will receive an email shortly.
        </motion.p>
      </div>

      {/* Share section - outside capture area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-8 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6"
      >
        {/* Share title */}
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Share this with your friends!
        </h3>
        
        {/* Subtitle */}
        <p className="text-primary font-medium mb-3">
          Give your friends a chance to win exciting gym membership offers too.
        </p>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-6">
          Your friends can also spin and win exciting rewards — including a chance to get a FREE 1-Year Gym Membership.
        </p>

        {/* WhatsApp share button */}
        <button
          onClick={handleWhatsAppShare}
          disabled={isSharing}
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#25D366]/30"
        >
          {isSharing ? (
            <>
              <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Preparing...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share on WhatsApp
            </>
          )}
        </button>
      </motion.div>

      {/* T&C Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 mt-8"
      >
        <button
          onClick={() => setShowTerms(true)}
          className="text-muted-foreground hover:text-primary underline text-sm transition-colors"
        >
          T&C Apply
        </button>
      </motion.div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </motion.div>
  );
};

export default ShareSection;

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import TermsModal from './TermsModal';
import GymLogo from './GymLogo';

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

  const shareMessage = `🔥 I just won an exciting offer from Future Fitness Gym! 💪

You can also try your luck and win amazing gym membership rewards — including a chance to get a FREE 1 YEAR MEMBERSHIP!

Tap here to try your luck 👇
${shareLink}

Hurry! Limited-time offer 💥`;

  const handleWhatsAppShare = async () => {
    setIsSharing(true);
    
    try {
      // Wait for logo to be fully rendered
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Capture screenshot
      if (captureRef.current) {
        const canvas = await html2canvas(captureRef.current, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: false,
          foreignObjectRendering: false,
        });
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          }, 'image/png', 1.0);
        });
        
        const file = new File([blob], 'future-fitness-reward.png', { type: 'image/png' });
        
        // Check if Web Share API supports files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'Future Fitness Gym Offer',
              text: shareMessage,
              files: [file],
            });
            setIsSharing(false);
            return;
          } catch (shareError) {
            // User cancelled or share failed, try fallback
            console.log('Share cancelled or failed, trying fallback');
          }
        }
        
        // Fallback: Download image first, then open WhatsApp with text
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'future-fitness-reward.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Open WhatsApp with message after short delay
        setTimeout(() => {
          const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
          window.open(whatsappUrl, '_blank');
        }, 800);
        
        setIsSharing(false);
        return;
      }
    } catch (error) {
      console.error('Screenshot failed:', error);
    }
    
    // Final fallback: Just open WhatsApp with text and link
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(whatsappUrl, '_blank');
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

      {/* Capturable content for screenshot - includes logo */}
      <div ref={captureRef} className="relative z-10 bg-background rounded-2xl p-6 border border-primary/20">
        {/* Future Fitness Gym Logo */}
        <div className="flex justify-center mb-4">
          <GymLogo />
        </div>

        {/* Celebration icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-3xl">🎊</span>
        </div>

        {/* Congratulations title */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Congratulations!
        </h2>

        {/* User name display */}
        {userName && (
          <p className="text-lg text-primary font-semibold mb-4">
            {userName} won this offer!
          </p>
        )}

        {/* Reward display */}
        <div className="bg-primary/10 border-2 border-primary rounded-xl p-5 mb-5">
          <p className="text-muted-foreground text-sm mb-2">Your Reward</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{prizeIcon}</span>
            <span className="text-xl md:text-2xl font-bold text-primary">{prize}</span>
          </div>
        </div>

        {/* Visit message */}
        <p className="text-muted-foreground text-sm mb-2">
          Visit{' '}
          <span className="text-primary font-semibold">
            Future Fitness Gym
          </span>{' '}
          to claim your membership!
        </p>

        {/* Email confirmation message */}
        <p className="text-muted-foreground text-xs">
          You will receive an email shortly.
        </p>
      </div>

      {/* Share section - outside capture area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-6 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-2xl p-6"
      >
        {/* Share title */}
        <h3 className="text-xl font-bold text-foreground mb-2">
          Share this with your friends!
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-sm mb-5">
          Your friends can also spin and win exciting gym membership offers — including a chance to get a FREE 1-Year Membership.
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
        className="relative z-10 mt-6"
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

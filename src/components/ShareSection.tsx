import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import TermsModal from './TermsModal';
import gymLogo from '@/assets/gym-logo.png';

interface ShareSectionProps {
  isVisible: boolean;
  prize: string;
  prizeIcon: string;
  userName: string;
}

const ShareSection: React.FC<ShareSectionProps> = ({ isVisible, prize, prizeIcon, userName }) => {
  const [showTerms, setShowTerms] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  const shareLink = 'https://futurefitnessgym-new-year-offer.lovable.app/';
  const qrImageUrl =
  "https://blogger.googleusercontent.com/img/a/AVvXsEh2Dmygo5Wu7XBcXP_pKX4Kpt6hQwK5r3Yuc3yKsKH0I7AhHBQUYkq6XknXBIRgT6QFom4s4nJ7SLOIV5d1ffDAScliTD8Xjl-x7QUAa-HA3RY2OjUI41qjyuRS9F16a1828YX00_KR3QMEVbUnD6G5Cv5nlqBsAFrt9mEsNxbOUQxC0VHlwym4HysNJe2e";


  // Generate QR code as inline SVG for the share link
 

  const handleWhatsAppShare = async () => {
    if (!logoLoaded) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsSharing(true);
    
    try {
      // Wait for DOM to fully render
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (captureRef.current) {
        // Capture screenshot
        const canvas = await html2canvas(captureRef.current, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
        });
        
        // Convert canvas to blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error('Failed to create blob'));
          }, 'image/png', 1.0);
        });
        
        // Create file from blob
        const file = new File([blob], 'future-fitness-offer.png', { type: 'image/png' });
        
        // Share ONLY the image (WhatsApp strips text when sharing images on mobile)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
            });
            setIsSharing(false);
            return;
          } catch (shareError) {
            // User cancelled or share failed
          }
        }
        
        // Fallback for desktop: Download image and open WhatsApp
        const downloadLink = document.createElement('a');
        downloadLink.href = canvas.toDataURL('image/png');
        downloadLink.download = 'future-fitness-offer.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        setTimeout(() => {
          window.open('https://api.whatsapp.com/', '_blank');
        }, 500);
        
        setIsSharing(false);
        return;
      }
    } catch (error) {
      // Silent fallback
    }
    
    window.open('https://api.whatsapp.com/', '_blank');
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

      {/* Capturable content for screenshot - includes logo, reward, link, and QR */}
      <div ref={captureRef} className="relative z-10 bg-background rounded-2xl p-6 border border-primary/20">
        {/* Future Fitness Gym Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src={gymLogo} 
            alt="Future Fitness Gym" 
            className="h-20 w-auto object-contain"
            onLoad={() => setLogoLoaded(true)}
            crossOrigin="anonymous"
          />
        </div>

        {/* Celebration icon */}
        <div className="w-14 h-14 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">{prizeIcon}</span>
        </div>

        {/* Success title */}
        <h2 className="text-2xl font-bold text-primary mb-1">
          You're All Set!
        </h2>

        {/* User name display */}
        {userName && (
          <p className="text-muted-foreground mb-3">
            Congratulations {userName}!
          </p>
        )}

        {/* Reward display */}
        <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 mb-4">
          <p className="text-muted-foreground text-xs mb-1">Your Reward</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{prizeIcon}</span>
            <span className="text-lg font-bold text-primary">{prize}</span>
          </div>
        </div>

        {/* Visit message */}
        <p className="text-muted-foreground text-sm mb-1">
          Visit <span className="text-primary font-semibold">Future Fitness Gym</span> to claim your membership!
        </p>

        {/* Email confirmation message */}
        <p className="text-muted-foreground text-xs mb-4">
          📧 You will receive an email shortly.
        </p>

        {/* Divider */}
        <div className="border-t border-primary/20 my-4"></div>

        {/* Call to Action with Link - VISIBLE IN SCREENSHOT */}
        <div className="mb-4">
          <p className="text-lg font-bold text-foreground mb-1">
            🔥 Try your luck now!
          </p>
          <p className="text-primary font-medium text-sm">
            {shareLink}
          </p>
        </div>

        {/* QR Code - VISIBLE IN SCREENSHOT */}
        <div className="flex flex-col items-center mb-4">
          {/* QR Code - REAL WORKING QR */}
<div className="flex flex-col items-center mb-4">
  <img
    src={qrImageUrl}
    alt="Scan to visit Future Fitness Gym"
    className="w-28 h-28 rounded-lg bg-white p-1 shadow-md"
  />
  <p className="text-xs text-muted-foreground mt-1">
    Scan to visit the offer page
  </p>
</div>

          <p className="text-xs text-muted-foreground mt-1">
            Scan to visit
          </p>
        </div>

        {/* Share encouragement text */}
        <p className="text-xs text-muted-foreground">
          Share this with your friends so they can also win exciting gym offers!
        </p>
      </div>

      {/* Share Button - Outside capture area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-6"
      >
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
        transition={{ delay: 0.6 }}
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

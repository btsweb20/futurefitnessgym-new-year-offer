import React, { useState, useRef, useEffect } from 'react';
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

const ShareSection: React.FC<ShareSectionProps> = ({
  isVisible,
  prize,
  prizeIcon,
  userName,
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [qrBase64, setQrBase64] = useState<string | null>(null);

  const captureRef = useRef<HTMLDivElement>(null);

  if (!isVisible) return null;

  const shareLink = 'https://futurefitnessgym-new-year-offer.lovable.app/';

  // Load QR image and convert to base64 (fixes screenshot issue)
  useEffect(() => {
    const loadQrAsBase64 = async () => {
      const response = await fetch(
        'https://blogger.googleusercontent.com/img/a/AVvXsEh2Dmygo5Wu7XBcXP_pKX4Kpt6hQwK5r3Yuc3yKsKH0I7AhHBQUYkq6XknXBIRgT6QFom4s4nJ7SLOIV5d1ffDAScliTD8Xjl-x7QUAa-HA3RY2OjUI41qjyuRS9F16a1828YX00_KR3QMEVbUnD6G5Cv5nlqBsAFrt9mEsNxbOUQxC0VHlwym4HysNJe2e'
      );

      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        setQrBase64(reader.result as string);
      };

      reader.readAsDataURL(blob);
    };

    loadQrAsBase64();
  }, []);

  const handleWhatsAppShare = async () => {
    if (!logoLoaded) await new Promise(r => setTimeout(r, 500));
    setIsSharing(true);

    try {
      await new Promise(r => setTimeout(r, 400));

      if (captureRef.current) {
        const canvas = await html2canvas(captureRef.current, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob(b => b && resolve(b), 'image/png')
        );

        const file = new File([blob], 'future-fitness-offer.png', {
          type: 'image/png',
        });

        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file] });
          setIsSharing(false);
          return;
        }

        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'future-fitness-offer.png';
        link.click();

        setTimeout(() => {
          window.open('https://api.whatsapp.com/', '_blank');
        }, 500);
      }
    } catch (e) {
      console.error(e);
    }

    setIsSharing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-4 text-center"
    >
      <div className="confetti-container absolute inset-0 pointer-events-none overflow-hidden" />

      <div ref={captureRef} className="relative z-10 bg-background rounded-2xl p-6 border border-primary/20">

        <div className="flex justify-center mb-4">
          <img
            src={gymLogo}
            alt="Future Fitness Gym"
            className="h-20 w-auto"
            onLoad={() => setLogoLoaded(true)}
          />
        </div>

        <div className="w-14 h-14 mx-auto mb-3 bg-primary/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">{prizeIcon}</span>
        </div>

        <h2 className="text-2xl font-bold text-primary mb-1">
          You're All Set!
        </h2>

        {userName && (
          <p className="text-muted-foreground mb-3">
            Congratulations {userName}!
          </p>
        )}

        <div className="bg-primary/10 border-2 border-primary rounded-xl p-4 mb-4">
          <p className="text-muted-foreground text-xs mb-1">Your Reward</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">{prizeIcon}</span>
            <span className="text-lg font-bold text-primary">{prize}</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-1">
          Visit <span className="text-primary font-semibold">Future Fitness Gym</span> to claim your membership!
        </p>

        <p className="text-muted-foreground text-xs mb-4">
          📧 You will receive an email shortly.
        </p>

        <div className="border-t border-primary/20 my-4"></div>

        <div className="mb-4">
          <p className="text-lg font-bold text-foreground mb-1">🔥 Try your luck now!</p>
          <p className="text-primary font-medium text-sm">{shareLink}</p>
        </div>

        {qrBase64 && (
          <div className="flex flex-col items-center mb-4">
            <img
              src={qrBase64}
              alt="Scan to visit"
              className="w-28 h-28 rounded-lg bg-white p-1 shadow-md"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Scan to visit the offer page
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Share this with your friends so they can also win exciting gym offers!
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 mt-6"
      >
        <button
          onClick={handleWhatsAppShare}
          disabled={isSharing}
          className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
        >
          {isSharing ? 'Preparing...' : 'Share on WhatsApp'}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10 mt-6"
      >
        <button
          onClick={() => setShowTerms(true)}
          className="text-muted-foreground hover:text-primary underline text-sm"
        >
          T&C Apply
        </button>
      </motion.div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </motion.div>
  );
};

export default ShareSection;

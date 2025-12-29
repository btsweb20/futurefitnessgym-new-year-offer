import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import SpinWheel from '@/components/SpinWheel';
import ResultModal from '@/components/ResultModal';
import RegistrationForm from '@/components/RegistrationForm';
import ShareSection from '@/components/ShareSection';
import TermsModal from '@/components/TermsModal';
import CampaignStatus from '@/components/CampaignStatus';
import { 
  generateFingerprint, 
  setCookie, 
  getCookie, 
  saveToIndexedDB, 
  getFromIndexedDB 
} from '@/lib/fingerprint';

const LOGO_URL = 'https://futurefitnessgymnellore.com/static/media/logo.2f698da7dd4e6a5054ac.png';
const INSTAGRAM_URL = 'https://www.instagram.com/futurefitnessgym_nellore/';
const FACEBOOK_URL = 'https://www.facebook.com/FutureFitnessFamilyGYM/';

// Campaign dates
const CAMPAIGN_START = new Date('2025-12-25T00:00:00');
const CAMPAIGN_END = new Date('2025-12-31T23:59:59');
const CAMPAIGN_EXPIRY = new Date('2026-01-01T00:00:00');

// Storage keys for spin blocking
const SPIN_STORAGE_KEY = 'ffg_spin_completed';
const SPIN_PRIZE_KEY = 'ffg_won_prize';
const SPIN_PRIZE_ICON_KEY = 'ffg_won_prize_icon';
const SPIN_FORM_SUBMITTED_KEY = 'ffg_form_submitted';
const SPIN_USER_NAME_KEY = 'ffg_user_name';
const FINGERPRINT_KEY = 'ffg_device_fp';

type CampaignStatusType = 'upcoming' | 'active' | 'ended';

const Index = () => {
  const [campaignStatus, setCampaignStatus] = useState<CampaignStatusType>('active');
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [wonPrize, setWonPrize] = useState('');
  const [wonPrizeIcon, setWonPrizeIcon] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has already spun using multiple storage methods
  useEffect(() => {
    const checkSpinStatus = async () => {
      const fingerprint = generateFingerprint();
      
      // Check all storage methods
      const localStorageSpin = localStorage.getItem(SPIN_STORAGE_KEY);
      const cookieSpin = getCookie(SPIN_STORAGE_KEY);
      const indexedDBSpin = await getFromIndexedDB(`${FINGERPRINT_KEY}_${fingerprint}`);
      
      // Get saved prize data from any available source
      const savedPrize = localStorage.getItem(SPIN_PRIZE_KEY) || getCookie(SPIN_PRIZE_KEY);
      const savedPrizeIcon = localStorage.getItem(SPIN_PRIZE_ICON_KEY) || getCookie(SPIN_PRIZE_ICON_KEY);
      const savedFormSubmitted = localStorage.getItem(SPIN_FORM_SUBMITTED_KEY) || getCookie(SPIN_FORM_SUBMITTED_KEY);
      const savedUserName = localStorage.getItem(SPIN_USER_NAME_KEY) || getCookie(SPIN_USER_NAME_KEY);

      // If any storage method indicates spin completed
      const hasAlreadySpun = localStorageSpin === 'true' || cookieSpin === 'true' || indexedDBSpin === 'true';

      if (hasAlreadySpun && savedPrize) {
        setHasSpun(true);
        setWonPrize(savedPrize);
        setWonPrizeIcon(savedPrizeIcon || '');
        setUserName(savedUserName || '');
        
        if (savedFormSubmitted === 'true') {
          setFormSubmitted(true);
          setShowShare(true);
        } else {
          // Show the result modal so they can claim
          setShowResult(true);
        }
      } else if (hasAlreadySpun && !savedPrize) {
        // Edge case: spin recorded but no prize data - still block
        setHasSpun(true);
        setWonPrize('Special Offer');
        setShowResult(true);
      }
      
      setIsLoading(false);
    };

    checkSpinStatus();
  }, []);

  // Check campaign status
  useEffect(() => {
    const checkCampaignStatus = () => {
      const now = new Date();
      
      if (now < CAMPAIGN_START) {
        setCampaignStatus('upcoming');
      } else if (now >= CAMPAIGN_EXPIRY) {
        setCampaignStatus('ended');
      } else {
        setCampaignStatus('active');
      }
    };

    checkCampaignStatus();
    const interval = setInterval(checkCampaignStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Sound effects
  const playSpinSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 200;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Audio not supported
    }
  }, []);

  const playWinSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      [523, 659, 784, 1047].forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.15;
        
        oscillator.start(audioContext.currentTime + i * 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.3);
        oscillator.stop(audioContext.currentTime + i * 0.15 + 0.3);
      });
    } catch (e) {
      // Audio not supported
    }
  }, []);

  const handleSpinStart = () => {
    playSpinSound();
  };

  const handleSpinComplete = async (segment: { label: string; icon: string }, index: number) => {
    setWonPrize(segment.label);
    setWonPrizeIcon(segment.icon);
    setHasSpun(true);
    
    const fingerprint = generateFingerprint();
    
    // Save to ALL storage methods to block future spins
    // LocalStorage
    localStorage.setItem(SPIN_STORAGE_KEY, 'true');
    localStorage.setItem(SPIN_PRIZE_KEY, segment.label);
    localStorage.setItem(SPIN_PRIZE_ICON_KEY, segment.icon);
    
    // Cookies (persist longer, survive some incognito sessions)
    setCookie(SPIN_STORAGE_KEY, 'true', 365);
    setCookie(SPIN_PRIZE_KEY, segment.label, 365);
    setCookie(SPIN_PRIZE_ICON_KEY, segment.icon, 365);
    
    // IndexedDB with fingerprint (harder to clear)
    try {
      await saveToIndexedDB(`${FINGERPRINT_KEY}_${fingerprint}`, 'true');
      await saveToIndexedDB(`${SPIN_PRIZE_KEY}_${fingerprint}`, segment.label);
    } catch (e) {
      console.log('IndexedDB not available');
    }
    
    playWinSound();
    setTimeout(() => {
      setShowResult(true);
    }, 500);
  };

  const handleClaimPrize = () => {
    setShowResult(false);
    setShowForm(true);
  };

  const handleFormSuccess = (submittedName: string) => {
    setShowForm(false);
    setFormSubmitted(true);
    setShowShare(true);
    setUserName(submittedName);
    
    // Save form submission status and user name to all storage methods
    localStorage.setItem(SPIN_FORM_SUBMITTED_KEY, 'true');
    localStorage.setItem(SPIN_USER_NAME_KEY, submittedName);
    setCookie(SPIN_FORM_SUBMITTED_KEY, 'true', 365);
    setCookie(SPIN_USER_NAME_KEY, submittedName, 365);
  };

  const handleSetIsSpinning = (spinning: boolean) => {
    setIsSpinning(spinning);
    if (spinning) {
      handleSpinStart();
    }
  };

  // Show loading state while checking spin status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // Show campaign status screens if not active
  if (campaignStatus !== 'active') {
    return <CampaignStatus status={campaignStatus} />;
  }

  // If showing share screen, only show that (no spinner, no header, no footer duplicates)
  if (showShare) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-12">
        <ShareSection isVisible={showShare} prize={wonPrize} prizeIcon={wonPrizeIcon} userName={userName} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 md:py-12">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        {/* Logo */}
        <motion.img
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          src={LOGO_URL}
          alt="Future Fitness Gym"
          className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 object-contain"
        />

        {/* Limited Time Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-glow mb-6"
        >
          <span className="text-primary">✨</span>
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">
            Limited Time Offer
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-extrabold text-foreground mb-4"
        >
          One Spin. One Chance.
        </motion.h1>

        {/* Highlight */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-4xl font-bold neon-text mb-2"
        >
          1 Year Gym FREE!
        </motion.p>

        {/* CTA Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl font-semibold text-primary tracking-widest uppercase"
        >
          Try Your Luck
        </motion.p>
      </motion.header>

      {/* Spin Wheel Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative mb-12"
      >
        <SpinWheel
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
          setIsSpinning={handleSetIsSpinning}
          disabled={hasSpun}
        />
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-auto text-center"
      >
        {/* T&C Link */}
        <button
          onClick={() => setShowTerms(true)}
          className="text-muted-foreground hover:text-primary underline text-sm mb-6 transition-colors"
        >
          T&C Apply
        </button>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 mb-6">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Facebook"
          >
            <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>

        {/* Gym Name */}
        <p className="text-muted-foreground border-t border-border pt-4 text-sm">
          Future Fitness Gym – Nellore
        </p>

        {/* Copyright */}
        <p className="text-muted-foreground text-xs mt-2">
          © 2025 Future Fitness Gym – Nellore
          <br />
          All rights reserved
        </p>
      </motion.footer>

      {/* Modals */}
      <ResultModal
        isOpen={showResult}
        prize={wonPrize}
        onClaim={handleClaimPrize}
      />

      <RegistrationForm
        isOpen={showForm}
        prize={wonPrize}
        onClose={() => setShowForm(false)}
        onSuccess={handleFormSuccess}
      />

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
      />
    </div>
  );
};

export default Index;

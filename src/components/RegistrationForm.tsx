import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface RegistrationFormProps {
  isOpen: boolean;
  prize: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  fullName: string;
  whatsappNumber: string;
  email: string;
  preferredLocation: string;
}

const WEBHOOK_URL = 'https://n8n.srv1225457.hstgr.cloud/webhook/Futurefitnessgym-newyearoffer';

const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOpen, prize, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    whatsappNumber: '',
    email: '',
    preferredLocation: 'Nellore',
  });
  const [followChecked, setFollowChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Name must be less than 100 characters';
    }

    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.whatsappNumber.replace(/\s/g, ''))) {
      newErrors.whatsappNumber = 'Enter a valid 10-digit mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!followChecked) {
      toast.error('Please confirm you follow us on social media');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
        email: formData.email.trim(),
        preferredLocation: formData.preferredLocation,
        wonOffer: prize,
        campaignName: 'New Year New Resolution Spin',
        paymentMode: 'Pay at Gym',
        timestamp: new Date().toISOString(),
        source: 'Spin Wheel Campaign',
      };

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('✅ Your entry has been successfully recorded!');
        onSuccess();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-gradient-to-b from-card to-background rounded-2xl p-6 md:p-8 max-w-lg w-full neon-border my-8"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Claim Your Prize! 🎁
              </h2>
              <p className="text-primary font-semibold text-lg">{prize}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="form-input"
                  maxLength={100}
                />
                {errors.fullName && (
                  <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  WhatsApp Mobile Number *
                </label>
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  placeholder="Enter your 10-digit number"
                  className="form-input"
                  maxLength={10}
                />
                {errors.whatsappNumber && (
                  <p className="text-destructive text-sm mt-1">{errors.whatsappNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email address"
                  className="form-input"
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value="Nellore"
                  disabled
                  className="form-input cursor-not-allowed bg-muted/20 text-muted-foreground"
                />
              </div>

              {/* Follow checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="follow"
                  checked={followChecked}
                  onChange={(e) => setFollowChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-primary rounded cursor-pointer"
                />
                <label htmlFor="follow" className="text-sm text-muted-foreground cursor-pointer">
                  I follow Future Fitness Gym on{' '}
                  <a
                    href="https://www.facebook.com/FutureFitnessFamilyGYM/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Facebook
                  </a>{' '}
                  &{' '}
                  <a
                    href="https://www.instagram.com/futurefitnessgym_nellore/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Instagram
                  </a>
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="spin-button w-full mt-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Entry'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationForm;

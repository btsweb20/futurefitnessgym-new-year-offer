import React from 'react';

const GymLogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Future Fitness Gym Text Logo */}
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-black tracking-tight">
          <span className="text-primary">FUTURE</span>
          <span className="text-foreground"> FITNESS</span>
        </div>
        <div className="text-lg md:text-xl font-bold text-primary tracking-widest">
          GYM
        </div>
      </div>
      {/* Dumbbell Icon */}
      <svg 
        viewBox="0 0 100 40" 
        className="w-16 h-6 mt-1"
        fill="none"
      >
        {/* Left weight */}
        <rect x="5" y="10" width="8" height="20" rx="2" className="fill-primary" />
        <rect x="15" y="5" width="6" height="30" rx="1" className="fill-primary" />
        {/* Bar */}
        <rect x="21" y="17" width="58" height="6" rx="1" className="fill-foreground" />
        {/* Right weight */}
        <rect x="79" y="5" width="6" height="30" rx="1" className="fill-primary" />
        <rect x="87" y="10" width="8" height="20" rx="2" className="fill-primary" />
      </svg>
    </div>
  );
};

export default GymLogo;

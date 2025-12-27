import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Segment {
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  weight: number;
}

interface SpinWheelProps {
  onSpinComplete: (segment: Segment, index: number) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  disabled?: boolean;
}

const segments: Segment[] = [
  { label: 'JACKPOT – 1 Year FREE', shortLabel: 'JACKPOT\n1 Year FREE', icon: '🎯', color: '#00CED1', weight: 0.5 },
  { label: '₹4,999 / Year', shortLabel: '₹4,999/Year', icon: '⚡', color: '#FF8C00', weight: 1 },
  { label: '₹5,999 / Year', shortLabel: '₹5,999/Year', icon: '🔥', color: '#FF6B6B', weight: 2 },
  { label: '₹6,999 / Year', shortLabel: '₹6,999/Year', icon: '⭐', color: '#FFD700', weight: 96 },
  { label: '₹7,999 / Year', shortLabel: '₹7,999/Year', icon: '💎', color: '#9B59B6', weight: 0.5 },
  { label: 'Bonus – Badminton + 1 Month', shortLabel: 'Badminton +\nFree Shoe', icon: '🏸', color: '#2ECC71', weight: 0 },
];

const SEGMENT_ANGLE = 360 / segments.length;
const LOGO_URL = 'https://futurefitnessgymnellore.com/static/media/logo.2f698da7dd4e6a5054ac.png';

const SpinWheel: React.FC<SpinWheelProps> = ({ onSpinComplete, isSpinning, setIsSpinning, disabled = false }) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const getWeightedRandomSegment = (): number => {
    const totalWeight = segments.reduce((sum, seg) => sum + seg.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < segments.length; i++) {
      random -= segments[i].weight;
      if (random <= 0) {
        return i;
      }
    }
    return 3;
  };

  const spin = () => {
    if (isSpinning || disabled) return;
    
    setIsSpinning(true);
    
    const winningIndex = getWeightedRandomSegment();
    
    // Calculate target rotation so pointer (at top/270°) lands on middle of winning segment
    // Segment 0 starts at -90° (top), each segment is 60°
    const segmentMidAngle = winningIndex * SEGMENT_ANGLE + (SEGMENT_ANGLE / 2);
    
    // To land pointer on this segment, wheel needs to rotate so that segment is at top
    const targetAngle = 360 - segmentMidAngle;
    
    const fullRotations = 5 + Math.floor(Math.random() * 3);
    const finalRotation = (fullRotations * 360) + targetAngle;
    
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(segments[winningIndex], winningIndex);
    }, 6000);
  };

  return (
    <div className="wheel-container flex flex-col items-center gap-8">
      {/* Pointer */}
      <div className="pointer absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <polygon
            points="20,35 8,8 32,8"
            fill="hsl(110, 100%, 50%)"
            stroke="#000"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Wheel Container */}
      <div className="relative" style={{ width: '320px', height: '320px' }}>
        {/* Outer ring glow */}
        <div className="wheel-outer-ring" />
        
        {/* Spinning wheel */}
        <motion.div
          ref={wheelRef}
          className="relative w-full h-full"
          animate={{ rotate: rotation }}
          transition={{
            duration: 6,
            ease: [0.17, 0.67, 0.12, 0.99],
          }}
          style={{ transformOrigin: 'center center' }}
        >
          {/* SVG Wheel */}
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {segments.map((segment, index) => {
              const startAngle = index * SEGMENT_ANGLE - 90;
              const endAngle = startAngle + SEGMENT_ANGLE;
              
              const startRad = (startAngle) * (Math.PI / 180);
              const endRad = (endAngle) * (Math.PI / 180);
              
              const radius = 145;
              const centerX = 150;
              const centerY = 150;
              
              const x1 = centerX + radius * Math.cos(startRad);
              const y1 = centerY + radius * Math.sin(startRad);
              const x2 = centerX + radius * Math.cos(endRad);
              const y2 = centerY + radius * Math.sin(endRad);
              
              const largeArcFlag = SEGMENT_ANGLE > 180 ? 1 : 0;
              
              const pathData = `
                M ${centerX} ${centerY}
                L ${x1} ${y1}
                A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
                Z
              `;

              const midAngle = (startAngle + endAngle) / 2;
              const midRad = midAngle * (Math.PI / 180);
              
              const textRadius = radius * 0.7;
              const textX = centerX + textRadius * Math.cos(midRad);
              const textY = centerY + textRadius * Math.sin(midRad);
              
              const iconRadius = radius * 0.4;
              const iconX = centerX + iconRadius * Math.cos(midRad);
              const iconY = centerY + iconRadius * Math.sin(midRad);

              // Text rotation to make it radial (reading from center outward)
              const textRotation = midAngle + 90;

              return (
                <g key={index}>
                  <path
                    d={pathData}
                    fill={segment.color}
                    stroke="#1a1a1a"
                    strokeWidth="2"
                  />
                  {/* Segment text */}
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textRotation}, ${textX}, ${textY})`}
                    className="font-poppins font-bold"
                    style={{ fontSize: '11px', fill: '#000' }}
                  >
                    {segment.shortLabel.split('\n').map((line, i) => (
                      <tspan key={i} x={textX} dy={i === 0 ? -6 : 12}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                  {/* Icon */}
                  <text
                    x={iconX}
                    y={iconY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: '20px' }}
                  >
                    {segment.icon}
                  </text>
                </g>
              );
            })}
            
          {/* Center circle */}
          <circle
            cx="150"
            cy="150"
            r="42"
            fill="#0a0a0a"
            stroke="#39FF14"
            strokeWidth="3"
          />
        </svg>
      </motion.div>
        
      {/* Center logo (fixed, not rotating) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full overflow-hidden bg-black flex items-center justify-center z-10 border-2 border-primary"
        style={{ pointerEvents: 'none' }}
          >
        <img
          src={LOGO_URL}
          alt="Future Fitness"
          className="w-16 h-16 object-contain"
        />
      </div>
    </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || disabled}
        className={`spin-button text-lg md:text-xl ${disabled ? 'opacity-50 cursor-not-allowed' : 'animate-pulse-glow'}`}
      >
        {isSpinning ? 'SPINNING...' : disabled ? 'ALREADY SPUN' : 'SPIN NOW'}
      </button>
    </div>
  );
};

export default SpinWheel;

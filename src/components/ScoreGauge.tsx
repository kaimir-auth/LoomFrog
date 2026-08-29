import React, { useEffect, useState } from 'react';
import { getScoreColor } from '../services/scoringEngine';

interface ScoreGaugeProps {
  score: number;
  label: string;
  mathSymbol: string;
  description: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  label,
  mathSymbol,
  description,
  size = 'md',
  showPercentage = true
}) => {
  const [displayScore, setDisplayScore] = useState<number>(0);
  const colorInfo = getScoreColor(score);

  // Animated rolling counter effect
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 800; // ms
    const target = score;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(easedProgress * target * 10) / 10);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [score]);

  const radius = size === 'lg' ? 44 : size === 'md' ? 36 : 28;
  const strokeWidth = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2 + 8;

  return (
    <div className="flex flex-col items-center justify-center p-3.5 rounded-2xl neo-liquid-card relative overflow-hidden group">
      {/* Gauge Ring */}
      <div className="relative flex items-center justify-center p-1 rounded-full bg-[#02050f] shadow-[inset_2px_2px_8px_rgba(0,0,0,0.8)]">
        <svg
          width={svgSize}
          height={svgSize}
          className="transform -rotate-90 transition-all duration-700 ease-out"
        >
          {/* Background Track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="rgba(6, 182, 212, 0.12)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Fill */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={colorInfo.hex}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${colorInfo.hex}88)`
            }}
          />
        </svg>

        {/* Rolling Counter Number */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`font-mono font-bold tracking-tight text-white ${size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-base'}`}>
            {displayScore.toFixed(displayScore % 1 === 0 ? 0 : 1)}
            {showPercentage && <span className="text-xs text-slate-400 ml-0.5">%</span>}
          </span>
          <span className="text-[10px] font-mono text-cyan-400 -mt-0.5 font-semibold">{mathSymbol}</span>
        </div>
      </div>

      <div className="mt-2.5 text-center">
        <div className="text-xs font-semibold text-white">{label}</div>
        <div className="text-[10px] text-slate-400 line-clamp-1 max-w-[130px]">{description}</div>
      </div>
    </div>
  );
};

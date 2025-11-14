import React from 'react';

interface ProgressCircleProps {
  completed: number;
  total: number;
  progress: number; // 円グラフ描画用
  size?: number;
  strokeWidth?: number;
}

export function ProgressCircle({ completed, total, progress, size = 32, strokeWidth = 4 }: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute" width={size} height={size}>
        <circle
          className="text-gray-300"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-blue-600"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      <span className="absolute text-xs font-medium text-gray-700">{`${completed}/${total}`}</span>
    </div>
  );
}

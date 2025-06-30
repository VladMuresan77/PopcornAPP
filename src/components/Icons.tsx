import React from 'react';
import { forwardRef } from 'react';

export const FavoriteIcon = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? 'red' : 'none'}
    stroke="gray"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6 cursor-pointer ml-4 inline-block"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export const WatchedIcon = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 2 25 25"
    stroke={filled ? 'green' : 'gray'}
    strokeWidth={3}
    className="w-8 h-8 cursor-pointer ml-4 inline-block"
    
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
export const PlanToWatchIcon = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    fill={filled ? '#054169' : 'none'}   
    stroke={filled ? '#2563eb' : 'gray'}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7 cursor-pointer ml-4 inline-block"
    viewBox="0 0 24 24"
  >
    <path d="M12 2C10.343 2 9 3.343 9 5c0 2.5 3 7 3 7s3-4.5 3-7c0-1.657-1.343-3-3-3z" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 12v8" />
    <path d="M10 20h4" />
  </svg>
);

type StarProps = {
  filled: boolean;
  onClick: () => void;
};
export const Star = ({ filled, onClick }: StarProps) => (
  <svg
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill={filled ? '#facc15' : '#6b7280'}
    className="w-8 h-8 cursor-pointer transition-colors duration-150"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.286 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.176 0l-3.385 2.46c-.784.57-1.838-.197-1.539-1.118l1.286-3.966a1 1 0 00-.364-1.118L2.045 9.393c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.966z" />
  </svg>
);
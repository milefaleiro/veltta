import React from 'react';

const VelttaLogo = ({ className }) => {
  return (
    <svg 
      className={className}
      width="40" 
      height="35" 
      viewBox="0 0 40 35" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M2.5 2.5L20 27.5L37.5 2.5" 
        stroke="url(#paint0_linear_148_3)" 
        strokeWidth="10" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="paint0_linear_148_3" x1="2.5" y1="2.5" x2="37.5" y2="2.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6A1B9A"/>
          <stop offset="1" stopColor="#8E24AA"/>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default VelttaLogo;
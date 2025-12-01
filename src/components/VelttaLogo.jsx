import React from 'react';

const VelttaLogo = ({ className }) => {
  return (
    <img 
      src="/logo.png" 
      alt="Veltta Logo" 
      className={className}
      style={{ height: '35px', width: 'auto' }}
    />
  );
};

export default VelttaLogo;
import React from 'react';

const ScrollIndicator: React.FC = () => {
  return (
    <div className="absolute bottom-10 right-10 z-30 text-white animate-pulse">
      <div className="text-xs uppercase tracking-[0.2em] font-medium">
        Scroll
      </div>
    </div>
  );
};

export default ScrollIndicator;
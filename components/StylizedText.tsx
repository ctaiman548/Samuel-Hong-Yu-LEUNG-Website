import React from 'react';

interface StylizedTextProps {
  text: string;
  className?: string;
}

const StylizedText: React.FC<StylizedTextProps> = ({ text, className = "" }) => {
  // Logic: Previously italicized vowels. Now simplified to return normal text as requested,
  // but using dangerouslySetInnerHTML to support HTML tags like <sup>.
  return (
    <span 
      className={`tracking-wide ${className}`} 
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default StylizedText;
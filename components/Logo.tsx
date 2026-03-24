import React from 'react';
import { ArrowLeft } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ArrowLeft size={16} strokeWidth={3} className="hidden sm:block" />
      <span className="uppercase tracking-[0.2em] font-medium text-sm hidden sm:block">Samuel Hong-Yu LEUNG</span>
    </div>
  );
};

export default Logo;
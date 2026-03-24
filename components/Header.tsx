
import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onMenuClick: () => void;
  onLogoClick?: () => void;
  onNameClick?: () => void;
  isDarkTheme?: boolean;
  headerMode?: 'default' | 'works' | 'upcomings' | 'about';
  upcomingsMode?: 'Upcomings' | 'Past Events';
  onUpcomingsModeChange?: (mode: 'Upcomings' | 'Past Events') => void;
  selectedYear?: string;
  onYearChange?: (year: string) => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  listenAvailable?: boolean;
  onListenAvailableChange?: (available: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onMenuClick, 
    onLogoClick, 
    onNameClick,
    isDarkTheme = false, 
    headerMode = 'default',
    upcomingsMode = 'Upcomings',
    onUpcomingsModeChange,
    selectedYear = 'All Years',
    onYearChange,
    activeFilter = 'Featured',
    onFilterChange,
    listenAvailable = false,
    onListenAvailableChange
}) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOptionsOpen) {
        setIsOptionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOptionsOpen]);

  const handleFilterClick = (filter: string) => {
    if (onFilterChange) onFilterChange(filter);
    // On touch devices, we don't close automatically
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
      setIsOptionsOpen(false);
    }
  };

  const handleListenAvailableToggle = () => {
    if (onListenAvailableChange) onListenAvailableChange(!listenAvailable);
    // On touch devices, we don't close automatically
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
      setIsOptionsOpen(false);
    }
  };

  return (
    <header className={`w-full p-6 lg:p-10 transition-colors duration-500 pointer-events-none ${isDarkTheme ? 'text-white' : 'text-off-black'}`}>
      <div className="flex justify-between items-center relative">
        <div className="flex-1 flex justify-start items-center lg:gap-4">
            <button 
                onClick={onLogoClick}
                onTouchEnd={(e) => { e.preventDefault(); onLogoClick?.(); }}
                className="hidden lg:block relative before:absolute before:-inset-3 before:content-[''] hover:opacity-70 transition-opacity text-left focus:outline-none pointer-events-auto cursor-pointer"
            >
                <Logo />
            </button>
            <button
                onClick={onNameClick}
                onTouchEnd={(e) => { e.preventDefault(); onNameClick?.(); }}
                className="lg:hidden text-[13px] sm:text-sm whitespace-nowrap uppercase tracking-[0.2em] font-medium hover:opacity-70 active:scale-[1.02] active:opacity-70 transition-all duration-200 pointer-events-auto cursor-pointer"
            >
                SAMUEL HONG-YU LEUNG
            </button>
        </div>

        {headerMode === 'works' && (
            <div className="absolute left-1/2 -translate-x-1/2 flex justify-center pointer-events-auto">
                <nav className="hidden lg:flex items-center gap-2 text-[11px] tracking-[0.2em] font-medium">
                    {['Featured', 'Solo', 'Chamber', 'Large Ensemble'].map((filter) => (
                        <button 
                            key={filter}
                            onClick={() => handleFilterClick(filter)}
                            onTouchEnd={(e) => { e.preventDefault(); handleFilterClick(filter); }}
                            className={`relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer border border-transparent hover:border-black ${activeFilter === filter ? 'bg-[#333333] text-white' : 'hover:bg-gray-100 hover:text-off-black text-off-black'}`}
                        >
                            {filter}
                        </button>
                    ))}

                    <div className="relative ml-2" ref={optionsRef}>
                        <button 
                            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                            onTouchEnd={(e) => { e.preventDefault(); setIsOptionsOpen(!isOptionsOpen); }}
                            className={`relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] transition-colors duration-200 ease-in-out flex items-center gap-1 whitespace-nowrap cursor-pointer border ${isOptionsOpen ? 'border-black' : 'border-transparent hover:border-black'} ${activeFilter === 'Show All Works' || activeFilter === 'With Electronics/ Installations' || listenAvailable ? 'bg-[#333333] text-white' : 'hover:bg-gray-100 hover:text-off-black text-off-black'}`}
                        >
                            Options <span className="text-[10px] leading-none">▾</span>
                        </button>
                        
                        <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-1 transition-all duration-200 z-50 ${isOptionsOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <div className="bg-white shadow-lg rounded-[3px] border border-gray-100 flex flex-col min-w-[160px] overflow-hidden py-1 text-off-black">
                                <button
                                    onClick={handleListenAvailableToggle}
                                    onTouchEnd={(e) => { e.preventDefault(); handleListenAvailableToggle(); }}
                                    className="px-4 py-2.5 text-left transition-colors duration-200 ease-in-out whitespace-nowrap flex items-center gap-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className={`w-3 h-3 border rounded-[2px] flex items-center justify-center transition-colors ${listenAvailable ? 'bg-[#333333] border-[#333333]' : 'border-gray-400'}`}>
                                        {listenAvailable && (
                                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    Listen Available
                                </button>
                                
                                <div className="h-[1px] bg-gray-100 my-1 w-full"></div>
                                
                                <div className="px-3 py-2 flex flex-col gap-1">
                                    <button
                                        onClick={() => handleFilterClick('Show All Works')}
                                        onTouchEnd={(e) => { e.preventDefault(); handleFilterClick('Show All Works'); }}
                                        className={`px-3 py-2.5 rounded-[3px] text-left transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer border border-transparent hover:border-black ${activeFilter === 'Show All Works' ? 'bg-[#333333] text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        Show All Works
                                    </button>
                                    
                                    <button
                                        onClick={() => handleFilterClick('With Electronics/ Installations')}
                                        onTouchEnd={(e) => { e.preventDefault(); handleFilterClick('With Electronics/ Installations'); }}
                                        className={`px-3 py-2.5 rounded-[3px] text-left transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer border border-transparent hover:border-black ${activeFilter === 'With Electronics/ Installations' ? 'bg-[#333333] text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        With Electronics/ Installations
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        )}

        {headerMode === 'upcomings' && (
            <div className="absolute left-1/2 -translate-x-1/2 flex justify-center pointer-events-auto">
                <nav className="hidden lg:flex items-center gap-2 text-[11px] tracking-[0.2em] font-medium">
                    {['Upcomings', 'Past Events'].map((mode) => (
                        <button 
                            key={mode}
                            onClick={() => onUpcomingsModeChange?.(mode as 'Upcomings' | 'Past Events')}
                            onTouchEnd={(e) => { e.preventDefault(); onUpcomingsModeChange?.(mode as 'Upcomings' | 'Past Events'); }}
                            className={`relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer border border-transparent hover:border-black ${upcomingsMode === mode ? 'bg-[#333333] text-white' : 'hover:bg-gray-100 hover:text-off-black text-off-black'}`}
                        >
                            {mode}
                        </button>
                    ))}
                </nav>
            </div>
        )}

        <div className="flex-1 flex justify-end">
            <button
              onClick={onMenuClick}
              onTouchStart={() => setIsPressed(true)}
              onTouchEnd={(e) => { e.preventDefault(); setIsPressed(false); onMenuClick?.(); }}
              className={`
                relative z-0
                before:absolute before:-inset-3 before:content-['']
                after:absolute after:-z-10 after:inset-[-8px] after:rounded-full
                ${headerMode === 'about' ? 'after:bg-gray-500' : 'after:bg-gray-200'}
                after:opacity-0
                hover:after:opacity-100
                after:transition-opacity after:duration-200
                transition-all duration-200 focus:outline-none pointer-events-auto cursor-pointer
                ${isPressed ? 'scale-125' : 'scale-100'}
              `}             
              >
              <Menu size={24} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

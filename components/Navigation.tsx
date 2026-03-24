
import React, { useEffect, useRef, useState } from 'react';
import { MENU_ITEMS, SECTIONS } from '../constants';
import StylizedText from './StylizedText';
import Logo from './Logo';
import { X } from 'lucide-react';

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'home' | 'works' | 'upcomings' | 'about', href: string, skipTransition?: boolean) => void;
  currentView?: 'home' | 'works' | 'upcomings' | 'about';
}

const Navigation: React.FC<NavigationProps> = ({ isOpen, onClose, onNavigate, currentView = 'home' }) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [isPressed, setIsPressed] = useState(false);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  
  // Track the view to display as active.
  // We initialize with currentView but only update it when the menu is effectively open.
  const [displayedView, setDisplayedView] = useState(currentView);

  const [isNavigating, setIsNavigating] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // Sync displayedView with currentView only when menu is open.
  // This prevents the bold styling from jumping to the new page while the menu is closing.
  useEffect(() => {
    if (isOpen) {
      setDisplayedView(currentView);
      setIsNavigating(false);
    }
  }, [isOpen, currentView]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setHoveredSectionId(null);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleLinkClick = (e: React.MouseEvent | React.TouchEvent, item: typeof MENU_ITEMS[0]) => {
      e.preventDefault();
      if (isNavigating) return;

      const sectionId = item.href.replace('/#', '').replace('#', '');
      
      // Map navigation items to their preview images in SECTIONS
      let hoverId = sectionId;
      if (item.view === 'works') hoverId = 'works-preview';
      if (item.view === 'upcomings') hoverId = 'upcomings-preview';
      if (item.view === 'about') hoverId = 'about';

      // 1. Update visual states immediately for feedback
      setDisplayedView(item.view || 'home');
      setHoveredSectionId(hoverId);
      setIsNavigating(true);

      // 2. Wait 0.3s to let user see the change, then navigate
      setTimeout(() => {
          onNavigate(item.view || 'home', item.href, true);
          onClose();
      }, 300);
  };

  return (
    <div
      id="navigation-menu"
      ref={navRef}
      className={`fixed inset-0 z-[100] text-black transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Background Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Base Background */}
          <div className="absolute inset-0 bg-[#fdfdfd]"></div>

          {/* Section Images - Only show for home sections that exist in SECTIONS */}
          {SECTIONS.map((section) => (
              <div 
                  key={section.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${hoveredSectionId === section.id ? 'opacity-100' : 'opacity-0'}`}
              >
                  <img src={section.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
          ))}

          {/* White Overlay to make images faint */}
          <div className="absolute inset-0 bg-[#fdfdfd] opacity-70"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col">
          <div className="absolute top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-center">
            <div className="flex items-center lg:gap-4">
                <button 
                    onClick={() => {
                        onNavigate('home', '/#hero', true);
                        onClose();
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        onNavigate('home', '/#hero', true);
                        onClose();
                    }}
                    className={`hidden lg:block relative before:absolute before:-inset-3 before:content-[''] ${!isTouchDevice ? 'hover:opacity-70' : ''} transition-opacity focus:outline-none cursor-pointer`}
                >
                    <Logo className="text-off-black" />
                </button>
                <button
                    onClick={() => {
                        onNavigate('home', '/#hero', true);
                        onClose();
                    }}
                    onTouchEnd={(e) => {
                        e.preventDefault();
                        onNavigate('home', '/#hero', true);
                        onClose();
                    }}
                    className="lg:hidden text-[13px] sm:text-sm whitespace-nowrap uppercase tracking-[0.2em] font-medium hover:opacity-70 active:scale-[1.02] active:opacity-70 transition-all duration-200 pointer-events-auto cursor-pointer text-off-black"
                >
                    SAMUEL HONG-YU LEUNG
                </button>
            </div>
            <button 
                onClick={onClose} 
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={(e) => { e.preventDefault(); setIsPressed(false); onClose(); }}
                onTouchCancel={() => setIsPressed(false)}
                className={`relative before:absolute before:-inset-3 before:content-[''] group flex items-center justify-center w-10 h-10 rounded-full ${!isTouchDevice ? 'hover:bg-gray-100' : ''} transition-all duration-200 cursor-pointer ${isPressed ? 'scale-125' : 'scale-100'}`}
                aria-label="Close menu"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="h-full flex items-center justify-center p-4">
            <ul className="flex flex-col items-center space-y-4 lg:space-y-6">
              {MENU_ITEMS.map((item, index) => {
                const sectionId = item.href.replace('/#', '').replace('#', '');
                
                // Map navigation items to their preview images in SECTIONS
                let hoverId = sectionId;
                if (item.view === 'works') hoverId = 'works-preview';
                if (item.view === 'upcomings') hoverId = 'upcomings-preview';
                if (item.view === 'about') hoverId = 'about';

                const isActive = item.view === displayedView;

                return (
                    <li 
                        key={index} 
                        className="group relative overflow-hidden"
                        onMouseEnter={() => !isTouchDevice && setHoveredSectionId(hoverId)}
                        onMouseLeave={() => !isTouchDevice && setHoveredSectionId(null)}
                    >
                      <a
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item)}
                        onTouchEnd={(e) => handleLinkClick(e, item)}
                        className={`block text-4xl lg:text-6xl font-serif uppercase tracking-wider transition-all duration-300 ${!isTouchDevice ? 'group-hover:-translate-y-1' : ''} ${isActive ? 'font-bold' : 'font-light'}`}
                      >
                        <div className="relative">
                            <StylizedText text={item.label} />
                            {/* Hover line effect: If active, keeps line. If inactive, shows on hover. */}
                            <span className={`absolute left-0 -bottom-2 w-full h-[1px] bg-current transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : `scale-x-0 ${!isTouchDevice ? 'group-hover:scale-x-100' : ''}`}`} />
                        </div>
                      </a>
                    </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Social links placeholder at bottom */}
          <div className="absolute bottom-10 left-0 w-full flex justify-center space-x-6 text-sm tracking-widest uppercase">
              <a href="https://youtube.com/@samuelhong-yuleung?si=Vj_hFZwcAnon-01n" target="_blank" rel="noopener noreferrer" className={`${!isTouchDevice ? 'hover:opacity-50' : ''} transition-opacity`}>Youtube</a>
              <a href="https://on.soundcloud.com/jeobtc4FWzwmdkowxD" target="_blank" rel="noopener noreferrer" className={`${!isTouchDevice ? 'hover:opacity-50' : ''} transition-opacity`}>Soundcloud</a>
              <a href="https://www.instagram.com/samuel_leung1216/" target="_blank" rel="noopener noreferrer" className={`${!isTouchDevice ? 'hover:opacity-50' : ''} transition-opacity`}>Instagram</a>
          </div>
      </div>
    </div>
  );
};

export default Navigation;

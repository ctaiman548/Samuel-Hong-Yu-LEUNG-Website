

import React, { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { MoveLeft, Hand } from 'lucide-react';
import { WORKS, SECTIONS } from '../constants';
import ContentSection from './ContentSection';
import StylizedText from './StylizedText';
import ScrollHintCursor from './ScrollHintCursor';
import Footer from './Footer';
import { SectionData } from '../types';

interface WorksPageProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  listenAvailable: boolean;
  onListenAvailableChange: (available: boolean) => void;
}

const WorksPage: React.FC<WorksPageProps> = ({ filter, onFilterChange, listenAvailable, onListenAvailableChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollState = useRef({ target: 0, current: 0 });
  const requestRef = useRef<number | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const [showSwipeOverlay, setShowSwipeOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState<'swipe' | 'scroll'>('swipe');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1025);
      setIsPhone(window.innerWidth < 1025);
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleFilterClick = (newFilter: string) => {
    onFilterChange(newFilter);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      setIsOptionsOpen(false);
    }
  };

  const handleListenAvailableToggle = () => {
    onListenAvailableChange(!listenAvailable);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) {
      setIsOptionsOpen(false);
    }
  };

  useEffect(() => {
    const isIPad = typeof window !== 'undefined' && /iPad|Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 0;
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const isHorizontalLayout = window.innerWidth >= 1025;
    
    // Initial load overlay
    if (isTouchDevice && isHorizontalLayout) {
      const hasSeenOverlay = sessionStorage.getItem('hasSeenWorksOverlay');
      if (!hasSeenOverlay) {
        setOverlayType('swipe');
        setShowSwipeOverlay(true);
        sessionStorage.setItem('hasSeenWorksOverlay', 'true');
        setTimeout(() => {
          setShowSwipeOverlay(false);
        }, 2000);
      }
    }

    // iPad orientation change overlay
    if (isIPad) {
      let lastOrientation = window.innerWidth >= 1025 ? 'horizontal' : 'vertical';
      let timeoutId: NodeJS.Timeout;

      const handleOrientationChange = () => {
        const currentIsHorizontal = window.innerWidth >= 1025;
        const currentOrientation = currentIsHorizontal ? 'horizontal' : 'vertical';

        if (lastOrientation !== currentOrientation) {
          if (currentOrientation === 'horizontal') {
            setOverlayType('swipe');
          } else {
            setOverlayType('scroll');
          }
          setShowSwipeOverlay(true);
          
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setShowSwipeOverlay(false);
          }, 2000);
        }
        lastOrientation = currentOrientation;
      };

      window.addEventListener('resize', handleOrientationChange);
      return () => {
        window.removeEventListener('resize', handleOrientationChange);
        clearTimeout(timeoutId);
      };
    }
  }, []);

  // Global state for overlays to ensure only one is open at a time
  const [activeOverlayState, setActiveOverlayState] = useState<{workId: string, type: 'remarks' | 'performances' | 'notes'} | null>(null);

  // Find the background image from the "Works" section (id: works-preview)
  const bgImage = SECTIONS.find(s => s.id === 'works-preview')?.imageUrl || '';

  const filteredWorks = React.useMemo(() => {
    let result = WORKS;

    if (filter !== 'Show All Works') {
      result = result.filter(work => work.categories?.includes(filter));
    }

    if (listenAvailable) {
      result = result.filter(work => !!work.listenUrl && work.listenUrl !== '#' && work.listenUrl !== '');
    }

    // Custom sorting based on filter
    if (filter === 'Featured') {
      const featuredOrder = [
        "Excursion II",
        "Variations",
        "Tastaturlust",
        "19 sets of sound object(s)",
        "it is Coming III",
        "盼 Finding The Light"
      ];
      result = [...result].sort((a, b) => {
        const indexA = featuredOrder.indexOf(a.title);
        const indexB = featuredOrder.indexOf(b.title);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    } else if (filter === 'Solo') {
      const soloOrder = [
        "Tastaturlust",
        "Sui Ergastulum",
        "Rabbit Hole",
        "Unity and Contrast",
        "Quotation of Moments",
        "it is Coming II",
        "it is Coming I"
      ];
      result = [...result].sort((a, b) => {
        const indexA = soloOrder.indexOf(a.title);
        const indexB = soloOrder.indexOf(b.title);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    } else if (filter === 'Chamber') {
      const chamberOrder = [
        "Excursion II",
        "Flux",
        "Dialogue X",
        "19 sets of sound object(s)",
        "Variations",
        "Capturing",
        "it is Coming III",
        "Excursion",
        "Echoes of Spring",
        "Oasis from the City – Medley of Terrance Lam’s Cantonese Song (arr.)",
        "Anechoic Scream",
        "Deadline Jitters"
      ];
      result = [...result].sort((a, b) => {
        const indexA = chamberOrder.indexOf(a.title);
        const indexB = chamberOrder.indexOf(b.title);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    } else if (filter === 'Large Ensemble') {
      const largeEnsembleOrder = [
        "...then, \"he wrapped his face in his mantle\"",
        "Melt メルト (arr.)",
        "Time Tunnel 2",
        "Time Tunnel",
        "聽風 (arr.)",
        "盼 Finding The Light",
        "城變 the Ever-changing City",
        "夜醒憶飛 Night Thoughts"
      ];
      result = [...result].sort((a, b) => {
        const indexA = largeEnsembleOrder.indexOf(a.title);
        const indexB = largeEnsembleOrder.indexOf(b.title);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    } else if (filter === 'With Electronics/ Installations') {
      const electronicsOrder = [
        "Rabbit Hole",
        "Unity and Contrast",
        "it is Coming II",
        "it is Coming I"
      ];
      result = [...result].sort((a, b) => {
        const indexA = electronicsOrder.indexOf(a.title);
        const indexB = electronicsOrder.indexOf(b.title);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    return result;
  }, [filter, listenAvailable]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Reset scroll when filter or listenAvailable changes
    container.scrollLeft = 0;
    container.scrollTop = 0;
    scrollState.current.current = 0;
    scrollState.current.target = 0;
    setScrollX(0);
    
    // Clear any previous animation frame
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
    }

    const getMaxScroll = () => container.scrollWidth - container.clientWidth;

    const updateScroll = () => {
      if (!container) return;
      const { target, current } = scrollState.current;
      const ease = 0.08;
      const diff = target - current;

      if (Math.abs(diff) > 0.5) {
        const newCurrent = current + diff * ease;
        scrollState.current.current = newCurrent;
        container.scrollLeft = newCurrent;
        setScrollX(newCurrent);
        requestRef.current = requestAnimationFrame(updateScroll);
      } else {
        scrollState.current.current = target;
        container.scrollLeft = target;
        setScrollX(target);
        requestRef.current = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Check if the target or any of its parents is a vertically scrollable element
      let target = e.target as HTMLElement | null;
      
      if (window.innerWidth < 1025) return; // Let browser handle vertical scroll on mobile/tablet
      
      while (target && target !== container) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        
        if ((overflowY === 'auto' || overflowY === 'scroll') && target.scrollHeight > target.clientHeight) {
          // If the user is scrolling vertically (mostly)
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            const isScrollingUp = e.deltaY < 0;
            const isScrollingDown = e.deltaY > 0;
            const isAtTop = target.scrollTop === 0;
            const isAtBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1;
            
            // If at the edge of the scrollable element, prevent default to avoid browser bounce/overscroll
            if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
              e.preventDefault();
            }
            // Return early to prevent the horizontal scroll logic from running
            return;
          }
        }
        target = target.parentElement;
      }

      e.preventDefault();
      const multiplier = 2.0; 
      const delta = e.deltaY + e.deltaX;
      
      scrollState.current.target += delta * multiplier;
      const maxScroll = getMaxScroll();
      scrollState.current.target = Math.max(0, Math.min(scrollState.current.target, maxScroll));

      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(updateScroll);
      }
    };

    const handleScroll = () => {
      if (!requestRef.current && container) {
        setScrollX(container.scrollLeft);
        scrollState.current.current = container.scrollLeft;
        scrollState.current.target = container.scrollLeft;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    let touchStartY = 0;
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth < 1025) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.innerWidth < 1025) return;
      
      const touchY = e.touches[0].clientY;
      const touchX = e.touches[0].clientX;
      const deltaY = touchStartY - touchY;
      const deltaX = touchStartX - touchX;
      
      // Check if the target or any of its parents is a vertically scrollable element
      let target = e.target as HTMLElement | null;
      while (target && target !== container) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        
        if ((overflowY === 'auto' || overflowY === 'scroll') && target.scrollHeight > target.clientHeight) {
          // If swiping vertically more than horizontally
          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            const isScrollingUp = deltaY < 0;
            const isScrollingDown = deltaY > 0;
            const isAtTop = target.scrollTop === 0;
            const isAtBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1;
            
            if ((isScrollingUp && isAtTop) || (isScrollingDown && isAtBottom)) {
              e.preventDefault();
            }
            touchStartY = touchY;
            touchStartX = touchX;
            return;
          }
        }
        target = target.parentElement;
      }

      touchStartY = touchY;
      touchStartX = touchX;

      // If swiping vertically more than horizontally, translate to horizontal scroll
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        e.preventDefault();
        scrollState.current.target += deltaY * 1.5;
        const maxScroll = getMaxScroll();
        scrollState.current.target = Math.max(0, Math.min(scrollState.current.target, maxScroll));
        
        if (!requestRef.current) {
          requestRef.current = requestAnimationFrame(updateScroll);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [filter, listenAvailable]);

  // Determine subtitle based on filter
  const getSubtitle = () => {
    switch (filter) {
      case 'Featured':
        return 'A selection of compositions and collaborations';
      case 'Solo':
        return 'Solo works';
      case 'Chamber':
        return 'Chamber works';
      case 'Large Ensemble':
        return 'Large ensembles, orchestras, wind bands';
      case 'Show All Works':
        return 'All works';
      case 'With Electronics/ Installations':
        return 'Works with electronics and/or installations';
      default:
        return 'A selection of compositions and collaborations';
    }
  };

  // Parallax factors: Title moves slow (0.2), Description moves faster (0.5)
  // This creates a depth effect where title feels further away/heavier.
  return (
    <>
    <div className="relative h-full w-full bg-off-white overflow-hidden">
        <ScrollHintCursor />
        
        {/* Fixed Background Layer (Pale) 
            This sits at Z-0. It is the "default" look for the Title and gaps.
        */}
        <div 
            className="absolute inset-0 z-0 pointer-events-none grayscale"
            style={{ clipPath: 'inset(0)', WebkitClipPath: 'inset(0)' }}
        >
            <div 
                className="fixed inset-0 w-screen h-[100dvh]"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
             {/* The Pale Overlay - Matches the hover state overlay in ContentSection */}
            <div className="fixed inset-0 bg-[#fdfdfd]/80" />
        </div>

        {/* Scroll Container */}
        <div 
            ref={containerRef}
            className="relative z-10 h-full w-full flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden lg:overflow-x-auto lg:overflow-y-hidden no-scrollbar"
            style={{ 
                scrollBehavior: 'auto',
                ...(isPhone ? {
                    maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 120px)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 120px)'
                } : {})
            }}
        >
            {/* Sticky Title Section 
                Z-10: Sits above the background, but below the scrollable content (Z-20).
                Transparent background to let the "Pale" global background show through.
                Updated Width: Dynamic width to fit title (md:w-auto) with padding
            */}
            <div className={`shrink-0 w-full lg:w-auto h-auto lg:h-[100dvh] lg:min-w-[50vw] relative lg:sticky lg:left-0 flex flex-col justify-center p-12 ${isPhone ? 'pt-32' : 'pt-24'} lg:pt-12 lg:pr-32 border-b lg:border-b-0 lg:border-r border-gray-900/10 ${isOptionsOpen ? 'z-[30]' : 'z-10'} ${isMobile ? 'overflow-visible' : 'overflow-hidden'}`}>
                <div style={{ transform: `translateX(-${scrollX * 0.2}px)`, willChange: 'transform' }}>
                    <h1 className="text-4xl lg:text-6xl xl:text-8xl font-serif text-off-black uppercase leading-[0.9]">
                        <StylizedText text="Compositions" />
                    </h1>
                </div>
                
                <div style={{ transform: `translateX(-${scrollX * 0.5}px)`, willChange: 'transform' }}>
                    <p className="hidden lg:block mt-6 text-sm uppercase tracking-widest text-gray-500 max-w-xs leading-relaxed">
                        {getSubtitle()}
                    </p>
                </div>
                
                <div style={{ transform: `translateX(-${scrollX * 0.5}px)`, willChange: 'transform' }}>
                    <div className="mt-12 w-12 h-[1px] bg-off-black"></div>
                </div>

                {/* Mobile Filters */}
                <div className="mt-6 lg:hidden flex flex-wrap items-center gap-2 text-[11px] tracking-[0.2em] font-medium uppercase">
                    {['Featured'].map((f) => (
                        <button 
                            key={f}
                            onClick={() => handleFilterClick(f)}
                            onTouchEnd={(e) => { e.preventDefault(); handleFilterClick(f); }}
                            className={`group px-3 py-1.5 rounded-[3px] border transition-all duration-200 whitespace-nowrap cursor-pointer ${filter === f ? 'bg-[#333333] text-white border-[#333333]' : 'border-black text-off-black hover:bg-gray-100'}`}
                        >
                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>{f}</span>
                        </button>
                    ))}
                    <div className="relative" ref={optionsRef}>
                        <button 
                            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                            onTouchEnd={(e) => { e.preventDefault(); setIsOptionsOpen(!isOptionsOpen); }}
                            className={`group px-3 py-1.5 rounded-[3px] border transition-all duration-200 flex items-center gap-1 whitespace-nowrap cursor-pointer ${filter !== 'Featured' || listenAvailable ? 'bg-[#333333] text-white border-[#333333]' : 'border-black text-off-black hover:bg-gray-100'}`}
                        >
                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>Other Works</span> <span className="text-[8px] leading-none">▾</span>
                        </button>
                        
                        {isOptionsOpen && (
                            <div className="absolute left-0 top-full mt-2 z-50 bg-white shadow-xl rounded-[3px] border border-gray-100 flex flex-col min-w-[220px] p-2 text-off-black uppercase tracking-[0.2em] gap-2">
                                <button
                                    onClick={() => handleListenAvailableToggle()}
                                    onTouchEnd={(e) => { e.preventDefault(); handleListenAvailableToggle(); }}
                                    className="group px-4 py-3 text-left transition-colors duration-200 flex items-center gap-3 hover:bg-gray-50"
                                >
                                    <div className={`shrink-0 w-4 h-4 border rounded-[2px] flex items-center justify-center transition-colors ${listenAvailable ? 'bg-black border-black' : 'border-gray-300'}`}>
                                        {listenAvailable && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block text-[11px] font-medium`}>Listen Available</span>
                                </button>
                                
                                <div className="h-[1px] bg-gray-100 mx-2"></div>

                                {['Solo', 'Chamber', 'Large Ensemble', 'With Electronics/ Installations', 'Show All Works'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => handleFilterClick(f)}
                                        onTouchEnd={(e) => { e.preventDefault(); handleFilterClick(f); }}
                                        className={`group px-4 py-3 text-left text-[11px] font-medium transition-all duration-200 border border-black rounded-[3px] ${filter === f ? 'bg-[#333333] text-white' : 'bg-white hover:bg-gray-50'}`}
                                    >
                                        <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>{f}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Works List using ContentSection (ForWorks Variant) 
                Z-20: Allows these sections to scroll visually *over* the sticky Title section.
                We pass the bgImage so they can render the "Vibrant" version of the background.
            */}
            <div className="shrink-0 relative z-20 flex flex-col lg:flex-row">
                {filteredWorks.map((work, index) => {
                    const sectionData: SectionData = {
                        id: work.id,
                        title: work.title,
                        subtitle: `${work.year} — ${work.instrumentation}`,
                        imageUrl: '', 
                        type: 'full', 
                        theme: 'light'
                    };

                    const isActive = activeOverlayState?.workId === work.id;
                    const activeOverlayType = isActive ? activeOverlayState.type : null;

                    return (
                        <div key={work.id} className="shrink-0 relative z-20">
                            <ContentSection 
                                data={sectionData}
                                workData={work} // Pass the full work object
                                variant="forworks"
                                actionLabel="Listen"
                                backgroundImage={bgImage} 
                                activeOverlay={activeOverlayType}
                                onOpenOverlay={(type) => setActiveOverlayState({ workId: work.id, type })}
                                onCloseOverlay={() => setActiveOverlayState(null)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* End Spacer */}
            <div className="shrink-0 w-full h-auto lg:h-auto lg:w-[20vw] flex items-center justify-center relative z-20">
                <div className="block lg:hidden w-full">
                    <Footer />
                </div>
                <span className="hidden lg:block text-xs uppercase tracking-widest text-gray-400 transform lg:-rotate-90">End</span>
            </div>
        </div>
    </div>
    
    {/* Swipe Overlay for iPad Horizontal */}
    {createPortal(
      <div className={`fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ease-in-out ${showSwipeOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className="flex flex-col items-center gap-6">
              <div className="relative w-32 h-12 flex items-center justify-center">
                  {overlayType === 'swipe' ? (
                      <Hand size={32} className="text-white absolute right-0 animate-swipe-left" />
                  ) : (
                      <div className="flex flex-col items-center animate-bounce">
                          <Hand size={32} className="text-white" />
                          <div className="w-1 h-4 bg-white/50 rounded-full mt-2" />
                      </div>
                  )}
              </div>
              <span className="text-white text-sm uppercase tracking-[0.2em] font-medium">
                  {overlayType === 'swipe' ? 'Swipe to explore' : 'Scroll to explore'}
              </span>
          </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default WorksPage;
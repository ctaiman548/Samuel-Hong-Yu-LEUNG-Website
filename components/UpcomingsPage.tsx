import React, { useRef, useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Hand } from 'lucide-react';
import { getAllEvents, SECTIONS } from '../constants';
import ContentSection from './ContentSection';
import StylizedText from './StylizedText';
import ScrollHintCursor from './ScrollHintCursor';
import Footer from './Footer';
import { SectionData } from '../types';

interface UpcomingsPageProps {
  mode?: 'Upcomings' | 'Past Events';
  onModeChange?: (mode: 'Upcomings' | 'Past Events') => void;
  year?: string;
}

const UpcomingsPage: React.FC<UpcomingsPageProps> = ({ mode = 'Upcomings', onModeChange, year = 'All Years' }) => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1025 : false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showSwipeOverlay, setShowSwipeOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState<'swipe' | 'scroll'>('swipe');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1025);
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const isIPad = typeof window !== 'undefined' && /iPad|Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 0;
    
    if (isIPad && mode === 'Upcomings') {
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
  }, [mode]);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollState = useRef({ target: 0, current: 0 });
  const requestRef = useRef<number | null>(null);
  const [scrollX, setScrollX] = useState(0);
  const [vScroll, setVScroll] = useState(0);
  const vContainerRef = useRef<HTMLDivElement>(null);
  const eventsListRef = useRef<HTMLDivElement>(null);
  const [eventsListHeight, setEventsListHeight] = useState(0);
  const [yearOffsets, setYearOffsets] = useState<{year: number, offset: number}[]>([]);
  const updateScrollRef = useRef<(() => void) | null>(null);
  const [clickedYear, setClickedYear] = useState<number | null>(null);
  const isScrollingToYear = useRef(false);
  const yearButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const isPastEventsDesktop = mode === 'Past Events' && !isMobile;

  // Find the background image from the "Upcomings" preview section, or fallback
  const bgImage = SECTIONS.find(s => s.id === 'upcomings-preview')?.imageUrl || SECTIONS[0].imageUrl;

  const allEvents = useMemo(() => getAllEvents(), []);
  
  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filtered = allEvents.filter(event => {
      // Extract date for comparison (handle ranges like "18-20 JUN 2026")
      const cleaned = event.date.replace(/(\d+)-\d+\s/, '$1 ');
      const eventDate = new Date(cleaned);
      eventDate.setHours(0, 0, 0, 0);
      
      if (mode === 'Upcomings') {
        return eventDate >= today;
      } else {
        // Past Events
        if (eventDate >= today) return false;
        if (year === 'All Years') return true;
        return eventDate.getFullYear().toString() === year;
      }
    });

    if (mode === 'Upcomings') {
      // Sort ascending for Upcomings (closest first)
      return filtered.sort((a, b) => {
        const parseDate = (dateStr: string) => {
          const cleaned = dateStr.replace(/^(\d+)-\d+\s/, '$1 ');
          const parsed = new Date(cleaned).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };
        return parseDate(a.date) - parseDate(b.date);
      });
    } else {
      // Sort descending for Past Events (newest first)
      return filtered.sort((a, b) => {
        const parseDate = (dateStr: string) => {
          const cleaned = dateStr.replace(/^(\d+)-\d+\s/, '$1 ');
          const parsed = new Date(cleaned).getTime();
          return isNaN(parsed) ? 0 : parsed;
        };
        return parseDate(b.date) - parseDate(a.date);
      });
    }
  }, [allEvents, mode, year]);

  useEffect(() => {
    const container = !isPastEventsDesktop ? containerRef.current : vContainerRef.current;
    if (!container) return;

    // Reset scroll state on mode/year change
    if (!isPastEventsDesktop) {
        container.scrollLeft = 0;
    } else {
        container.scrollTop = 0;
    }
    scrollState.current.current = 0;
    scrollState.current.target = 0;
    setScrollX(0);
    setVScroll(0);
    
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
    }

    const getMaxScroll = () => {
        if (!isPastEventsDesktop) {
            return container.scrollWidth - container.clientWidth;
        } else {
            // For Past Events, it's just a direct vertical scroll of the list
            return Math.max(0, eventsListHeight - window.innerHeight);
        }
    };

    const updateScroll = () => {
      const { target, current } = scrollState.current;
      const ease = 0.08;
      const diff = target - current;

      if (Math.abs(diff) > 0.5) {
        const newCurrent = current + diff * ease;
        scrollState.current.current = newCurrent;
        
        if (!isPastEventsDesktop) {
            if (containerRef.current) containerRef.current.scrollLeft = newCurrent;
            setScrollX(newCurrent);
        } else {
            setVScroll(newCurrent);
        }
        
        requestRef.current = requestAnimationFrame(updateScroll);
      } else {
        scrollState.current.current = target;
        if (!isPastEventsDesktop) {
            if (containerRef.current) containerRef.current.scrollLeft = target;
            setScrollX(target);
        } else {
            setVScroll(target);
            if (isScrollingToYear.current) {
                isScrollingToYear.current = false;
                setClickedYear(null);
            }
        }
        requestRef.current = null;
      }
    };
    updateScrollRef.current = updateScroll;

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
      
      if (isScrollingToYear.current) {
          isScrollingToYear.current = false;
          setClickedYear(null);
      }
      
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
        scrollState.current.target += deltaY * 3.0;
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
  }, [mode, year, filteredEvents, eventsListHeight, isPastEventsDesktop]); // Re-run scroll setup when mode/year/events/height change

  // Measure events list height
  useEffect(() => {
    if (!isPastEventsDesktop || !eventsListRef.current) return;

    const updateMeasurements = () => {
        if (!eventsListRef.current) return;
        
        setEventsListHeight(eventsListRef.current.scrollHeight);
        
        const containerRect = eventsListRef.current.getBoundingClientRect();
        const children = Array.from(eventsListRef.current.children) as HTMLElement[];
        const offsets: {year: number, offset: number}[] = [];
        let currentYear = -1;
        
        children.forEach((child) => {
            const yearAttr = child.getAttribute('data-year');
            if (yearAttr) {
                const year = parseInt(yearAttr);
                if (year !== currentYear) {
                    const childRect = child.getBoundingClientRect();
                    offsets.push({ year, offset: childRect.top - containerRect.top });
                    currentYear = year;
                }
            }
        });
        
        setYearOffsets(prev => {
            if (prev.length !== offsets.length) return offsets;
            const isDifferent = prev.some((p, i) => p.year !== offsets[i].year || Math.abs(p.offset - offsets[i].offset) > 1);
            return isDifferent ? offsets : prev;
        });
    };

    const resizeObserver = new ResizeObserver(() => {
        updateMeasurements();
    });
    
    resizeObserver.observe(eventsListRef.current);

    const timer1 = setTimeout(updateMeasurements, 100);
    const timer2 = setTimeout(updateMeasurements, 500);
    const timer3 = setTimeout(updateMeasurements, 1000);

    return () => {
        resizeObserver.disconnect();
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
    };
  }, [mode, filteredEvents, year, isPastEventsDesktop]);

  if (isPastEventsDesktop) {
    // Direct vertical scroll
    const verticalScroll = vScroll;

    if (filteredEvents.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-off-white">
                <p className="text-sm uppercase tracking-widest text-gray-500">No events found.</p>
            </div>
        );
    }

    const years = Array.from(new Set(filteredEvents.map(e => {
        const cleaned = e.date.replace(/(\d+)-\d+\s/, '$1 ');
        return new Date(cleaned).getFullYear();
    }))) as number[];

    let activeYear = clickedYear !== null ? clickedYear : (years.length > 0 ? years[0] : new Date().getFullYear());
    if (clickedYear === null) {
        const contentPadding = typeof window !== 'undefined' && window.innerWidth < 30 ? 80 : 96;
        for (let i = yearOffsets.length - 1; i >= 0; i--) {
            const y = yearOffsets[i].year;
            const btn = yearButtonRefs.current.get(y);
            if (btn) {
                const yearTop = btn.offsetTop;
                // The year becomes active when its first event's date passes its sidebar position
                if (vScroll >= yearOffsets[i].offset + contentPadding - yearTop - 20) {
                    activeYear = y;
                    break;
                }
            }
        }
    }

    const scrollToYear = (targetYear: number) => {
        const btn = yearButtonRefs.current.get(targetYear);
        if (btn && eventsListRef.current) {
            isScrollingToYear.current = true;
            setClickedYear(targetYear);

            const children = Array.from(eventsListRef.current.children) as HTMLElement[];
            const targetElement = children.find(child => child.getAttribute('data-year') === targetYear.toString());
            
            if (targetElement) {
                const containerRect = eventsListRef.current.getBoundingClientRect();
                const childRect = targetElement.getBoundingClientRect();
                const exactOffset = childRect.top - containerRect.top;

                // Padding for scrollable content when selected the Year
                const contentPadding = -30;
                let targetScroll = exactOffset + contentPadding;

                const maxScroll = Math.max(0, eventsListRef.current.scrollHeight - window.innerHeight);
                targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));
                
                scrollState.current.target = targetScroll;
                if (!requestRef.current && updateScrollRef.current) {
                    requestRef.current = requestAnimationFrame(updateScrollRef.current);
                }
            }
        }
    };

    return (
        <div ref={vContainerRef} className="relative h-full w-full bg-off-white overflow-hidden no-scrollbar">
            <ScrollHintCursor />
            
            {/* Total height = Vertical Content (eventsListHeight) */}
            <div style={{ height: `${eventsListHeight}px` }} className="relative">
                
                {/* Sticky Wrapper */}
                <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
                    
                    {/* Fixed Background Layer */}
                    <div 
                        className="absolute inset-0 z-0 pointer-events-none"
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
                        <div className="fixed inset-0 bg-[#fdfdfd]/80" />
                    </div>

                    {/* Total Events Frame (Direct vertical scroll) */}
                    <div 
                        className="absolute inset-0 z-20 w-screen h-[100dvh]"
                        style={{
                            maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 85px, black 120px)',
                            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 85px, black 120px)'
                        }}
                    >
                        {/* Timeline Sidebar */}
                        <div 
                            className="absolute left-0 top-0 bottom-0 w-24 lg:w-32 xl:w-48 z-30 flex flex-col items-end justify-start pt-[160px] lg:pt-[126px] pr-4 lg:pr-8 pointer-events-none h-full"
                        >
                            <div className="flex flex-col items-end space-y-2 pointer-events-auto">
                                {years.map(y => (
                                    <button 
                                        key={y}
                                        ref={el => { if (el) yearButtonRefs.current.set(y, el); else yearButtonRefs.current.delete(y); }}
                                        onClick={() => scrollToYear(y)}
                                        className={`group transition-all duration-500 font-sans cursor-pointer tracking-widest font-light ${activeYear === y ? 'text-2xl lg:text-3xl xl:text-4xl text-black translate-x-2' : 'text-sm lg:text-base xl:text-lg text-gray-500 hover:text-gray-700'}`}
                                    >
                                        <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>{y}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Inner Scrollable Content */}
                        <div 
                            ref={eventsListRef}
                            className="flex flex-col w-full pt-[30px] lg:pt-[30px] pl-24 lg:pl-32 xl:pl-48 min-h-[100dvh]"
                            style={{ 
                                transform: `translateY(-${verticalScroll}px)`,
                                willChange: 'transform'
                            }}
                        >
                            {filteredEvents.map((event) => (
                                <div key={event.id} className="w-full shrink-0 border-b border-gray-200 last:border-b-0" data-year={new Date(event.date.replace(/(\d+)-\d+\s/, '$1 ')).getFullYear()}>
                                    <ContentSection 
                                        data={{ 
                                            id: event.id, 
                                            title: event.occasion, 
                                            subtitle: event.date, 
                                            imageUrl: '', 
                                            type: 'full', 
                                            theme: 'light' 
                                        }}
                                        upcomingData={event}
                                        variant="forupcomings"
                                        backgroundImage={bgImage}
                                        isFullWidth={true}
                                        isAutoHeight={true}
                                        isPastEventsPage={true}
                                    />
                                </div>
                            ))}
                            
                            {/* End Spacer */}
                            <div className="h-auto lg:h-[50vh] w-[100vw] -ml-24 lg:-ml-32 xl:-ml-48 flex items-center justify-center border-t border-gray-900/10">
                                <div className="block lg:hidden w-full">
                                    <Footer />
                                </div>
                                <span className="hidden lg:block text-xs uppercase tracking-widest text-gray-400">End of Past Events</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <>
    <div className="relative h-full w-full bg-off-white overflow-hidden">
        <ScrollHintCursor />

        {/* Fixed Background Layer */}
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
            <div className="fixed inset-0 bg-[#fdfdfd]/80" />
        </div>

        {/* Scroll Container */}
        <div 
            ref={containerRef}
            className="relative z-10 h-full w-full flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden lg:overflow-x-auto lg:overflow-y-hidden no-scrollbar"
            style={{ 
                scrollBehavior: 'auto',
                ...(isMobile ? {
                    maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 120px)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 120px)'
                } : {})
            }}
        >
            {/* Sticky Title Section - Updated for auto width */}
            <div className="shrink-0 w-full lg:w-auto h-auto lg:h-[100dvh] lg:min-w-[50vw] relative lg:sticky lg:left-0 z-10 flex flex-col justify-center p-12 pt-32 lg:pt-12 lg:pr-32 border-b lg:border-b-0 lg:border-r border-gray-900/10 overflow-hidden">
                <div style={{ transform: `translateX(-${scrollX * 0.2}px)`, willChange: 'transform' }}>
                    <h1 className="text-4xl lg:text-6xl xl:text-8xl font-serif text-off-black uppercase leading-[0.9]">
                        <StylizedText text={mode === 'Upcomings' ? 'Upcomings' : 'Past Events'} />
                    </h1>
                </div>
                
                <div style={{ transform: `translateX(-${scrollX * 0.5}px)`, willChange: 'transform' }}>
                    <p className="hidden lg:block mt-6 text-sm uppercase tracking-widest text-gray-500 max-w-xs leading-relaxed">
                        {mode === 'Upcomings' 
                            ? 'Upcoming concerts, performances, and events featuring my works.'
                            : year === 'All Years'
                                ? 'Past concerts, performances, and events.'
                                : `Past concerts, performances, and events from ${year}.`
                        }
                    </p>
                </div>
                
                <div style={{ transform: `translateX(-${scrollX * 0.5}px)`, willChange: 'transform' }}>
                    <div className="mt-12 w-12 h-[1px] bg-off-black"></div>
                </div>

                {/* Mobile Filters */}
                <div className="mt-6 lg:hidden flex flex-wrap items-center gap-2 text-[11px] tracking-[0.2em] font-medium uppercase">
                    {['Upcomings', 'Past Events'].map((m) => (
                        <button 
                            key={m}
                            onClick={() => onModeChange?.(m as 'Upcomings' | 'Past Events')}
                            onTouchEnd={(e) => { e.preventDefault(); onModeChange?.(m as 'Upcomings' | 'Past Events'); }}
                            className={`group px-3 py-1.5 rounded-[3px] border transition-all duration-200 whitespace-nowrap cursor-pointer ${mode === m ? 'bg-[#333333] text-white border-[#333333]' : 'border-black text-off-black hover:bg-gray-100'}`}
                        >
                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>{m}</span>
                        </button>
                    ))}
                </div>
            </div>


            {/* Events List using ContentSection (ForUpcomings Variant) */}
            <div className="shrink-0 relative z-20 flex flex-col lg:flex-row">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => {
                        const sectionData: SectionData = {
                            id: event.id,
                            title: event.occasion,
                            subtitle: event.date, // Not used in detailed view but needed for type
                            imageUrl: '', 
                            type: 'full', 
                            theme: 'light'
                        };

                        return (
                            <div key={event.id} className="shrink-0 relative z-20">
                                <ContentSection 
                                    data={sectionData}
                                    upcomingData={event}
                                    variant="forupcomings"
                                    backgroundImage={bgImage} 
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="shrink-0 w-[50vw] flex items-center justify-center relative z-20">
                        <p className="text-sm uppercase tracking-widest text-gray-500">No events found.</p>
                    </div>
                )}
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

export default UpcomingsPage;
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'motion/react';
import { SectionData, Work, UpcomingEvent } from '../types';
import StylizedText from './StylizedText';
import { ChevronRight, X, Ear, Ticket, MapPin, FileText, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ListenVideoOverlay from './ListenVideoOverlay';

// FormattedPerformer component to handle text in parentheses
const FormattedPerformer = ({ text }: { text: string }) => {
  const parts = text.split(/(\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('(') && part.endsWith(')')) {
          return (
            <span key={i} className="font-medium italic text-xs text-gray-500">
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

interface ContentSectionProps {
  data: SectionData;
  workData?: Work;
  upcomingData?: UpcomingEvent;
  onClick?: () => void;
  actionLabel?: string;
  variant?: 'default' | 'forworks' | 'forupcomings';
  backgroundImage?: string;
  isFullWidth?: boolean;
  isAutoHeight?: boolean;
  isPastEventsPage?: boolean;
  // Controlled Overlay Props
  activeOverlay?: 'remarks' | 'performances' | 'notes' | null;
  onOpenOverlay?: (type: 'remarks' | 'performances' | 'notes') => void;
  onCloseOverlay?: () => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
    data, 
    workData,
    upcomingData,
    onClick, 
    actionLabel = "Explore",
    variant = 'default',
    backgroundImage,
    isFullWidth = false,
    isAutoHeight = false,
    activeOverlay,
    onOpenOverlay,
    onCloseOverlay,
    isPastEventsPage = false
}) => {
  const isImageTop = data.type === 'image-top';
  const isForWorks = variant === 'forworks';
  const isForUpcomings = variant === 'forupcomings';
  const isDetailed = isForWorks || isForUpcomings;
  
  // State to persist content during exit animation
  const [persistedType, setPersistedType] = useState(activeOverlay);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 1025 : false);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [isMobileNotesOpen, setIsMobileNotesOpen] = useState(false);
  const [isVideoOverlayOpen, setIsVideoOverlayOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const extractVideoId = (url: string) => {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/))([^?&]+)/);
      return match ? match[1] : null;
  };

  const handleListenClick = (e: React.MouseEvent, url: string) => {
      e.stopPropagation();
      e.preventDefault();
      const videoId = extractVideoId(url);
      if (videoId) {
          setCurrentVideoId(videoId);
          setIsVideoOverlayOpen(true);
      } else {
          // Fallback if not a YouTube URL
          window.open(url, '_blank', 'noopener,noreferrer');
      }
  };

  const [sheetTranslateY, setSheetTranslateY] = useState(0);
  const sheetContentRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartScrollY = useRef(0);

  // Notes Overlay Touch State
  const [notesTranslate, setNotesTranslate] = useState({ x: 0, y: 0 });
  const notesContentRef = useRef<HTMLDivElement>(null);
  const notesTouchStart = useRef({ x: 0, y: 0, scrollY: 0 });

  const handleNotesTouchStart = (e: React.TouchEvent) => {
      notesTouchStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          scrollY: notesContentRef.current?.scrollTop || 0
      };
  };

  const handleNotesTouchMove = (e: React.TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - notesTouchStart.current.y;

      if (notesTouchStart.current.scrollY <= 0 && deltaY > 0) {
          setNotesTranslate({ x: 0, y: deltaY });
      }
  };

  const handleNotesTouchEnd = () => {
      if (notesTranslate.y > 100) {
          setIsMobileNotesOpen(false);
      }
      setNotesTranslate({ x: 0, y: 0 });
  };

  const handleSheetTouchStart = (e: React.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartScrollY.current = sheetContentRef.current?.scrollTop || 0;
  };

  const handleSheetTouchMove = (e: React.TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - touchStartY.current;
      if (touchStartScrollY.current <= 0 && deltaY > 0) {
          setSheetTranslateY(deltaY);
      }
  };

  const handleSheetTouchEnd = () => {
      if (sheetTranslateY > 100) {
          setIsBottomSheetOpen(false);
          setIsMobileNotesOpen(false);
      }
      setSheetTranslateY(0);
  };

  useEffect(() => {
    const checkTouch = () => {
      return (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches));
    };
    setIsTouchDevice(checkTouch());

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1025);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isPerformancesExpanded, setIsPerformancesExpanded] = useState(false);
  const [isPerformancesAnimationDone, setIsPerformancesAnimationDone] = useState(false);
  const performancesScrollRef = useRef<HTMLDivElement>(null);
  const overlayScrollRef = useRef<HTMLDivElement>(null);

  const [sectionRef, isIntersecting] = useIntersectionObserver({
    rootMargin: '200% 200%', // Render when it's near the viewport vertically or horizontally
  });

  // Track if the section is near the center of the viewport
  const [isCentered, setIsCentered] = useState(false);

  useEffect(() => {
    if (!isDetailed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCentered(entry.isIntersecting);
      },
      {
        root: null, // viewport
        rootMargin: '0px -50% 0px -49.9%', // Trigger only when intersecting the exact center of the screen
        threshold: 0,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isDetailed, sectionRef]);

  // Update persisted type only when we have a valid active overlay
  useEffect(() => {
    if (activeOverlay) {
        setPersistedType(activeOverlay);
        // Reset overlay scroll position when opened
        if (overlayScrollRef.current) {
            overlayScrollRef.current.scrollTop = 0;
        }
    }
  }, [activeOverlay]);

  // Effect to reset scroll position when performances accordion is opened
  useEffect(() => {
      if (isPerformancesExpanded && performancesScrollRef.current) {
          performancesScrollRef.current.scrollTop = 0;
      }
  }, [isPerformancesExpanded]);

  // Effect to handle scrollbar visibility after animation
  useEffect(() => {
      let timeoutId: NodeJS.Timeout;
      if (isPerformancesExpanded) {
          timeoutId = setTimeout(() => {
              setIsPerformancesAnimationDone(true);
          }, 500); // 500ms delay
      } else {
          setIsPerformancesAnimationDone(false);
      }
      return () => clearTimeout(timeoutId);
  }, [isPerformancesExpanded]);

  useEffect(() => {
    if (!isMobile || isDetailed || isPastEventsPage) return;

    const container = document.querySelector('main');
    if (!container) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = (sectionRef.current as HTMLElement).getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      
      // Reduced movement (0.05x) relative to the center
      setParallaxOffset((viewportCenter - sectionCenter) * 0.05);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile, isDetailed, isPastEventsPage, sectionRef]);

  // Effect to prevent horizontal page scroll when scrolling inside the performances accordion
  useEffect(() => {
      const el = performancesScrollRef.current;
      if (!el) return;
      
      const handleWheel = (e: WheelEvent) => {
          e.stopPropagation();
      };
      
      el.addEventListener('wheel', handleWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // We use absolute positioning with background-attachment: fixed to create the "window" effect.
  // This avoids Safari compositing bugs associated with clip-path and position: fixed.

  // Helper to get overlay title and content
  const getOverlayContent = (type: string | null | undefined) => {
      if (!workData || !type) return null;
      
      let title = '';
      let content: React.ReactNode = null;
      const contentClass = "font-light text-[15px] normal-case tracking-wide leading-relaxed text-gray-200";

      switch (type) {
          case 'performances':
              title = 'Other Performances';
              content = (
                  <div className={`space-y-6 ${contentClass}`}>
                      {workData.otherPerformances?.map((perf, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                              <span>{perf.date}</span>
                              <span className="uppercase" dangerouslySetInnerHTML={{ __html: perf.occasion }}></span>
                              <span className="text-gray-400">{perf.venue}</span>
                              <span className="text-gray-400">{perf.location}</span>
                              <span className="text-gray-400 whitespace-pre-wrap"><FormattedPerformer text={perf.performer} /></span>
                          </div>
                      ))}
                  </div>
              );
              break;
          case 'notes':
              title = 'Programme Notes';
              content = <div className="space-y-4 font-light">
                {workData.programmeNotes.split("\n\n").map((p, i) => (<p key={i} dangerouslySetInnerHTML={{ __html: p }} />))}
                        </div>;
              break;
      }

      return { title, content };
  };

  const overlayData = getOverlayContent(persistedType);

  const handleOpen = (e: React.MouseEvent, type: 'remarks' | 'performances' | 'notes') => {
      e.stopPropagation();
      if (onOpenOverlay) onOpenOverlay(type);
  };

  const renderOverlay = () => {
    if (!isForWorks || !workData) return null;

    return createPortal(
        <div className={`fixed inset-0 z-[100] flex justify-end overflow-hidden ${activeOverlay ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div 
                className={`absolute inset-0 bg-off-black/60 backdrop-blur-sm transition-opacity duration-500 ${activeOverlay ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onCloseOverlay) onCloseOverlay();
                }}
            />
            <div 
                className={`
                    flex flex-col
                    relative h-full w-auto min-w-[320px] max-w-[90%] lg:max-w-[40vw]
                    bg-[#111111]/80 backdrop-blur-md text-off-white shadow-2xl
                    transform transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]
                    border-l border-white/10
                    ${activeOverlay ? 'translate-x-0' : 'translate-x-[150%]'}
                `}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="flex-shrink-0 relative z-20 px-8 lg:px-12 pt-10 pb-0">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onCloseOverlay) onCloseOverlay();
                        }}
                        className="absolute top-8 right-8 p-2 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer z-50"
                    >
                        <X size={20} strokeWidth={1.5} />
                    </button>

                    {overlayData && (
                        <div className="animate-[fadeIn_0.3s_ease-out]">
                             <h2 className="font-sans font-light text-xs tracking-[0.2em] uppercase text-gray-500 mb-2">
                                <StylizedText text={workData.title} />
                             </h2>
                             <h3 className="capitalize font-medium tracking-wide text-[13px] text-white mb-5">
                                {overlayData.title}
                             </h3>
                             <div className="w-full h-px bg-white/20 mb-0"></div>
                        </div>
                    )}
                </div>

                <div 
                    ref={overlayScrollRef}
                    className="flex-1 overflow-y-auto px-8 lg:px-12 pt-8 pb-24 no-scrollbar relative z-10"
                    style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black 32px)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 32px)'
                    }}
                >
                    {overlayData && (
                        <div className="animate-[fadeIn_0.5s_ease-out]">
                            {overlayData.content}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (isPerformancesExpanded) {
      setIsPerformancesExpanded(false);
    }
  };

  const renderBottomSheet = () => {
      if (!isMobile || !isForWorks || !workData) return null;

      return createPortal(
          <div 
              className={`fixed inset-0 z-[200] flex flex-col justify-end transition-opacity duration-500 ${isBottomSheetOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          >
              <div 
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={(e) => { e.stopPropagation(); setIsBottomSheetOpen(false); setIsMobileNotesOpen(false); }}
              />
              <div 
                  className={`relative w-full bg-[#fdfdfd] rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isBottomSheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
                  style={{ transform: isBottomSheetOpen ? `translateY(${sheetTranslateY}px)` : 'translateY(100%)', transition: sheetTranslateY > 0 ? 'none' : undefined }}
                  onClick={(e) => e.stopPropagation()}
              >
                  {/* Header / Grabber */}
                  <div 
                      className="w-full flex justify-center items-center pt-4 pb-2 shrink-0 touch-none"
                      onTouchStart={handleSheetTouchStart}
                      onTouchMove={handleSheetTouchMove}
                      onTouchEnd={handleSheetTouchEnd}
                  >
                      <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                  </div>
                  
                  <button 
                      onClick={(e) => { e.stopPropagation(); setIsBottomSheetOpen(false); setIsMobileNotesOpen(false); }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 z-10"
                  >
                      <X size={18} strokeWidth={2} />
                  </button>

                  {/* Fixed Title */}
                  <div className="px-6 pt-2 pb-4 shrink-0">
                      <h2 className="text-3xl font-sans font-normal tracking-tight text-off-black leading-none break-words pr-8">
                          {workData.title}
                      </h2>
                  </div>

                  {/* Relative container for Main Content and Notes Overlay */}
                  <div className="relative flex-1 overflow-hidden flex flex-col">
                      {/* Scrollable Content */}
                      <div 
                          ref={sheetContentRef}
                          className="flex-1 overflow-y-auto px-6 pb-12"
                          onTouchStart={handleSheetTouchStart}
                          onTouchMove={handleSheetTouchMove}
                          onTouchEnd={handleSheetTouchEnd}
                      >
                          {/* Listen & Year/Inst */}
                          <div className="flex flex-col gap-6 mb-8 mt-2">
                          {workData.listenUrl && workData.listenUrl !== '#' ? (
                              <a 
                                  href={workData.listenUrl} 
                                  onClick={(e) => handleListenClick(e, workData.listenUrl!)}
                                  className="inline-flex items-center w-fit rounded-full border border-gray-400 px-4 py-2 active:bg-off-black active:text-white transition-colors"
                              >
                                  <span className="text-xs uppercase tracking-widest font-medium mr-3">{workData.duration}</span>
                                  <Ear size={14} strokeWidth={1.5} className="mr-2" />
                                  <span className="text-[11px] capitalize tracking-widest font-medium">Listen</span>
                              </a>
                          ) : (
                              <span className="text-xs uppercase tracking-widest font-medium text-off-black">
                                  {workData.duration}
                              </span>
                          )}

                          <div className="flex flex-row items-start gap-2 text-xs uppercase tracking-[0.25em] text-gray-500 font-medium">
                              <span>{workData.year}</span>
                              <div className="w-[1.8px] bg-off-black opacity-10 mx-1 self-stretch"></div>
                              <span>{workData.instrumentation}</span>
                          </div>
                      </div>

                      {/* Remarks */}
                      {workData.remarks && (
                          <div className="mb-8">
                              <p 
                                  className="font-sans italic text-sm text-gray-500 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: workData.remarks }}
                              />
                          </div>
                      )}

                      {/* Programme Notes Button */}
                      {workData.programmeNotes && (
                          <div className="mb-10">
                              <button 
                                  onClick={(e) => { e.stopPropagation(); setIsMobileNotesOpen(true); }}
                                  className="flex items-center justify-center gap-3 px-6 py-3 rounded-[2rem] border border-gray-400/50 text-xs tracking-[0.2em] uppercase font-medium w-full active:bg-off-black active:text-white transition-colors"
                              >
                                  <FileText size={16} strokeWidth={1.5} />
                                  <span>Programme Notes</span>
                              </button>
                          </div>
                      )}

                      {/* Performances (Fully Expanded) */}
                      {(workData.premiere || (workData.otherPerformances && workData.otherPerformances.length > 0)) && (
                          <div className="flex flex-col">
                              <h3 className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold border-b border-gray-300/70 pb-4 mb-6">Performance(s)</h3>
                              
                              <div className="flex flex-col gap-8">
                                  {workData.premiere && (
                                      <div className="flex flex-col gap-3">
                                          <span className="text-sm font-medium text-off-black">Première</span>
                                          <div className="pl-4 border-l-2 border-gray-300/50 ml-1 flex flex-col gap-4">
                                              <div className="flex flex-col gap-1">
                                                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Date</span>
                                                  <span className="text-sm font-medium text-off-black">{workData.premiere.date}</span>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Occasion</span>
                                                  <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: workData.premiere.occasion }}></span>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Venue</span>
                                                  <span className="text-sm text-gray-700">{workData.premiere.venue}</span>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Location</span>
                                                  <span className="text-sm text-gray-700">{workData.premiere.location}</span>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Performer(s)</span>
                                                  <span className="text-sm text-gray-700 whitespace-pre-wrap"><FormattedPerformer text={workData.premiere.performer} /></span>
                                              </div>
                                          </div>
                                      </div>
                                  )}

                                  {workData.otherPerformances && workData.otherPerformances.length > 0 && (
                                      <div className="flex flex-col gap-3">
                                          <span className="text-sm font-medium text-off-black">Other Performance(s)</span>
                                          <div className="flex flex-col gap-8">
                                              {workData.otherPerformances.map((perf, idx) => (
                                                  <div key={idx} className="pl-4 border-l-2 border-gray-300/50 ml-1 flex flex-col gap-4">
                                                      <div className="flex flex-col gap-1">
                                                          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Date</span>
                                                          <span className="text-sm font-medium text-off-black">{perf.date}</span>
                                                      </div>
                                                      <div className="flex flex-col gap-1">
                                                          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Occasion</span>
                                                          <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: perf.occasion }}></span>
                                                      </div>
                                                      <div className="flex flex-col gap-1">
                                                          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Venue</span>
                                                          <span className="text-sm text-gray-700">{perf.venue}</span>
                                                      </div>
                                                      <div className="flex flex-col gap-1">
                                                          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Location</span>
                                                          <span className="text-sm text-gray-700">{perf.location}</span>
                                                      </div>
                                                      {perf.performer && (
                                                          <div className="flex flex-col gap-1">
                                                              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Performer(s)</span>
                                                              <span className="text-sm text-gray-700 whitespace-pre-wrap"><FormattedPerformer text={perf.performer} /></span>
                                                          </div>
                                                      )}
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Programme Notes Mobile Overlay */}
                  <div 
                      className={`absolute inset-0 bg-[#111111]/95 backdrop-blur-md text-off-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col z-50 ${!isMobileNotesOpen ? 'pointer-events-none' : ''}`}
                      style={{
                          transform: isMobileNotesOpen 
                              ? (notesTranslate.y > 0 
                                  ? `translateY(${notesTranslate.y}px)` 
                                  : 'translate3d(0, 0, 0)') 
                              : 'translate3d(0, 100%, 0)',
                          transition: notesTranslate.y > 0 ? 'none' : undefined
                      }}
                  >
                      <div 
                          className="shrink-0 pt-4 pb-2 px-6 flex justify-between items-center touch-none"
                          onTouchStart={handleNotesTouchStart}
                          onTouchMove={handleNotesTouchMove}
                          onTouchEnd={handleNotesTouchEnd}
                      >
                          <span className="text-white font-medium text-sm tracking-widest uppercase">Programme Notes</span>
                          <button onClick={(e) => { e.stopPropagation(); setIsMobileNotesOpen(false); }} className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors text-white">
                              <ChevronDown size={24} strokeWidth={1.5} />
                          </button>
                      </div>
                      <div 
                          ref={notesContentRef}
                          className="flex-1 overflow-y-auto px-6 pb-12 no-scrollbar"
                          onTouchStart={handleNotesTouchStart}
                          onTouchMove={handleNotesTouchMove}
                          onTouchEnd={handleNotesTouchEnd}
                      >
                          <div className="space-y-4 font-light text-[15px] normal-case tracking-wide leading-relaxed text-gray-200 text-justify">
                              {workData.programmeNotes?.split("\n\n").map((p, i) => (<p key={i} dangerouslySetInnerHTML={{ __html: p }} />))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>,
      document.body
  );
};

  const renderDetailedContent = () => {
      // 1. FOR WORKS
      if (isForWorks && workData) {
          return (
            <div 
                onClick={(e) => {
                    if (isMobile) {
                        e.stopPropagation();
                        setIsBottomSheetOpen(true);
                    } else {
                        handleBackgroundClick(e);
                    }
                }}
                className={`${isAutoHeight ? 'relative h-auto justify-start gap-0' : 'relative h-auto justify-start gap-0 lg:absolute lg:inset-0 lg:h-full lg:overflow-hidden lg:justify-between'} z-10 w-full px-8 lg:px-12 xl:px-16 pb-12 pt-10 lg:pt-40 flex flex-col ${isMobile ? 'active:opacity-50 transition-opacity duration-200 cursor-pointer' : ''}`}
            >
                <div className={`flex flex-col items-start transition-transform duration-500 shrink-0 ${isCentered ? 'max-lg:translate-x-2' : ''} group-hover:translate-x-2`}>
                    <h2 className="text-3xl lg:text-4xl xl:text-5xl font-sans font-normal tracking-tight text-off-black leading-none mb-2 break-words max-w-full">
                        {workData.title}
                    </h2>

                    <div className={`flex items-center pl-8 -ml-8 transition-all duration-500 ease-in-out overflow-hidden ${isPerformancesExpanded ? 'max-h-0 opacity-0 mb-0' : 'max-h-20 opacity-100 mb-8'}`}>
                        {workData.listenUrl && workData.listenUrl !== '#' ? (
                            <a 
                                href={workData.listenUrl} 
                                onClick={(e) => handleListenClick(e, workData.listenUrl!)}
                                 className={`group/listen inline-flex items-center relative z-20 cursor-pointer rounded-full border transition-all duration-500 px-4 py-2 ${isTouchDevice ? 'border-gray-400 -ml-1.5 active:bg-off-black active:border-off-black' : 'border-transparent group-hover:border-off-black hover:!bg-off-black hover:!border-off-black -ml-4 group-hover:-ml-1.5'}`}
                            >
                                <span className={`text-xs uppercase tracking-widest font-medium transition-colors duration-500 relative z-10 ${isTouchDevice ? 'text-off-black group-active/listen:text-white' : 'text-off-black group-hover/listen:text-white'}`}>
                                    {workData.duration}
                                </span>
                                
                                <div className="flex items-center ml-3">
                                    <span className={`block h-px transition-all duration-500 ease-out mr-3 ${isTouchDevice ? 'bg-off-black w-12 group-active/listen:bg-white' : 'bg-off-black w-3 group-hover:w-6 group-hover/listen:!w-12 group-hover/listen:!bg-white'}`}></span>
                                    <div className={`flex items-center gap-2 transition-all duration-500 ease-out ${isTouchDevice ? 'text-off-black group-active/listen:text-white' : 'text-off-black group-hover/listen:text-white group-hover/listen:translate-x-1'}`}>
                                        <Ear size={14} strokeWidth={1.5} className="flex-shrink-0" />
                                        <span className="text-[11px] capitalize tracking-widest font-medium whitespace-nowrap">Listen</span>
                                    </div>
                                </div>
                            </a>
                        ) : (
                            <span className="text-xs uppercase tracking-widest font-medium text-off-black relative z-10">
                                {workData.duration}
                            </span>
                        )}
                    </div>

                    <div className={`flex flex-row items-start gap-2 text-xs lg:text-sm uppercase tracking-[0.25em] text-gray-500 font-medium max-w-full transition-all duration-500 ease-in-out overflow-hidden ${isPerformancesExpanded ? 'max-h-0 opacity-0 mb-0' : 'max-h-20 opacity-100'}`}>
                        <span className="block whitespace-nowrap leading-relaxed">{workData.year}</span>
                        <div className="self-stretch w-[1.8px] bg-off-black shrink-0 opacity-10 mx-1"></div>
                        <span className="block leading-relaxed">{workData.instrumentation}</span>
                    </div>
                </div>

                <div className={`shrink min-h-0 basis-12 lg:basis-0 lg:flex-grow transition-all duration-500 ${isPerformancesExpanded ? 'basis-0' : ''}`}></div>
                <div className={`w-full flex flex-col transition-transform duration-500 delay-75 shrink min-h-0 lg:mt-auto ${isCentered ? 'max-lg:translate-x-2' : ''} group-hover:translate-x-2`}>
                    {!isMobile ? (
                        <>
                            {workData.remarks && (
                                <div className={`shrink-0 transition-all duration-500 ease-in-out overflow-hidden ${isPerformancesExpanded ? 'max-h-0 opacity-0 mb-0' : 'max-h-40 opacity-100 mb-6'}`}>
                                    <p 
                                        className="font-sans italic text-sm lg:text-base text-gray-500 max-w-full leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: workData.remarks }}
                                    />
                                </div>
                            )}

                            {workData.programmeNotes && (
                                <div className={`shrink-0 transition-all duration-500 ease-in-out overflow-hidden ${isPerformancesExpanded ? 'max-h-0 opacity-0 mb-0' : 'max-h-20 opacity-100 mb-8'}`}>
                                    <button 
                                        onClick={(e) => handleOpen(e, 'notes')}
                                        className={`flex items-center justify-center lg:justify-start gap-3 px-6 py-3 rounded-[2rem] border border-gray-400/50 transition-colors duration-300 text-xs tracking-[0.2em] uppercase font-medium w-full lg:w-fit cursor-pointer ${
                                            isTouchDevice 
                                                ? 'bg-transparent text-off-black border-gray-300 active:bg-off-black active:text-white active:border-off-black' 
                                                : 'bg-transparent text-off-black hover:bg-off-black hover:text-white'
                                        }`}
                                    >
                                        <FileText size={16} strokeWidth={1.5} />
                                        <span>Programme Notes</span>
                                    </button>
                                </div>
                            )}
                            
                            {(workData.premiere || (workData.otherPerformances && workData.otherPerformances.length > 0)) && (
                                <>
                                    <div className="w-full h-px bg-gray-300/70 mb-2 shrink-0"></div>
                                    <div className="flex flex-col shrink min-h-0">
                                        <div className={`border-b shrink-0 transition-colors duration-500 ${isPerformancesExpanded ? 'border-transparent' : 'border-gray-300/70'}`}>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setIsPerformancesExpanded(!isPerformancesExpanded); }}
                                                className={`flex items-center justify-between w-full py-4 text-left group/acc cursor-pointer transition-colors duration-300 px-2 -mx-2 rounded-lg ${isTouchDevice ? 'active:bg-off-black/5' : ''}`}
                                            >
                                                <span className="text-[11px] uppercase tracking-[0.2em] text-gray-500 font-semibold transition-colors duration-300 group-hover/acc:text-off-black">Performance(s)</span>
                                                {isPerformancesExpanded ? (
                                                    <ChevronDown 
                                                        size={20} 
                                                        strokeWidth={1.5}
                                                        className="text-gray-500 transition-colors duration-500 group-hover/acc:text-off-black" 
                                                    />
                                                ) : (
                                                    <ChevronUp 
                                                        size={20} 
                                                        strokeWidth={1.5}
                                                        className="text-gray-500 transition-colors duration-500 group-hover/acc:text-off-black" 
                                                    />
                                                )}
                                            </button>
                                        </div>
                                        <div 
                                            className={`grid transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] shrink min-h-0 ${isPerformancesExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                        >
                                            <div 
                                                onClick={(e) => e.stopPropagation()}
                                                className="overflow-hidden min-h-0 flex flex-col cursor-default"
                                            >
                                                <div className="pb-6 pt-2 flex flex-col min-h-0">
                                                    <div 
                                                        ref={performancesScrollRef}
                                                        className={`flex flex-col gap-8 pr-2 min-h-0 overflow-y-scroll ${isPerformancesAnimationDone ? 'always-visible-scrollbar' : 'transparent-scrollbar'}`}
                                                    >
                                                        {workData.premiere && (
                                                            <div className="flex flex-col gap-3">
                                                                <span className="text-sm font-medium text-off-black">Première</span>
                                                                <div className="pl-4 border-l-2 border-gray-300/50 ml-1 flex flex-col gap-4">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Date</span>
                                                                        <span className="text-sm font-medium text-off-black">{workData.premiere.date}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Occasion</span>
                                                                        <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: workData.premiere.occasion }}></span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Venue</span>
                                                                        <span className="text-sm text-gray-700">{workData.premiere.venue}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Location</span>
                                                                        <span className="text-sm text-gray-700">{workData.premiere.location}</span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Performer(s)</span>
                                                                        <span className="text-sm text-gray-700 whitespace-pre-wrap"><FormattedPerformer text={workData.premiere.performer} /></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {workData.otherPerformances && workData.otherPerformances.length > 0 && (
                                                            <div className="flex flex-col gap-3">
                                                                <span className="text-sm font-medium text-off-black">Other Performance(s)</span>
                                                                <div className="flex flex-col gap-8">
                                                                    {workData.otherPerformances.map((perf, idx) => (
                                                                        <div key={idx} className="pl-4 border-l-2 border-gray-300/50 ml-1 flex flex-col gap-4">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Date</span>
                                                                                <span className="text-sm font-medium text-off-black">{perf.date}</span>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Occasion</span>
                                                                                <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: perf.occasion }}></span>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Venue</span>
                                                                                <span className="text-sm text-gray-700">{perf.venue}</span>
                                                                            </div>
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Location</span>
                                                                                <span className="text-sm text-gray-700">{perf.location}</span>
                                                                            </div>
                                                                            {perf.performer && (
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-semibold">Performer(s)</span>
                                                                                    <span className="text-sm text-gray-700 whitespace-pre-wrap"><FormattedPerformer text={perf.performer} /></span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="mt-2 flex justify-end w-full pr-4">
                            <div className="inline-flex items-center gap-1 text-off-black">
                                <span className="text-xs lowercase font-medium tracking-wide">more</span>
                                <ChevronRight size={14} strokeWidth={2} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
          );
      }

      // 2. FOR UPCOMINGS
      if (isForUpcomings && upcomingData) {
        const dateParts = upcomingData.date.split(' ');
        const day = dateParts[0] || '';
        const month = dateParts[1] || '';
        const year = dateParts[2] || '';

        return (
            <div className={`${isAutoHeight ? 'relative h-auto justify-start gap-0' : 'relative h-auto justify-start gap-0 lg:absolute lg:inset-0 lg:h-full lg:overflow-hidden lg:justify-between'} z-10 w-full px-8 lg:px-12 xl:px-16 pb-8 lg:pb-12 pt-8 lg:pt-24 flex flex-col`}>
                <div className={`flex flex-col items-start transition-transform duration-500 w-full ${isCentered ? 'max-lg:translate-x-2' : ''} group-hover:translate-x-2`}>
                    
                    {isMobile ? (
                        <>
                            {/* Mobile: Date in one line */}
                            <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-lg font-light text-off-black uppercase tracking-wide">
                                    {day} {month} {year}
                                </span>
                            </div>

                            {/* Title */}
                            <div className="flex flex-col mb-2">
                                {upcomingData.occasionRemarks && (
                                    <div className="text-lg font-normal text-off-black leading-tight">
                                        {upcomingData.occasionRemarks}
                                    </div>
                                )}
                                <h2 
                                    className={`${isPastEventsPage ? 'text-2xl lg:text-3xl xl:text-4xl' : 'text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl'} font-sans font-normal tracking-tight text-off-black leading-none break-words max-w-full`}
                                    dangerouslySetInnerHTML={{ __html: upcomingData.occasion }}
                                />
                            </div>

                            {/* Location Block - Mobile: Below Title */}
                            {upcomingData.mapUrl ? (
                                <a 
                                    href={upcomingData.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex flex-col items-start text-left gap-1 mt-2"
                                >
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-[0.25em]">
                                        <MapPin size={18} strokeWidth={1.5} className="shrink-0" />
                                        <span>{upcomingData.location}</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 pb-0.5">
                                        <span>{upcomingData.venue}</span>
                                    </div>
                                </a>
                            ) : (
                                <div className="flex flex-col items-start text-left gap-1 mt-2">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-[0.25em]">
                                        <MapPin size={18} strokeWidth={1.5} className="shrink-0" />
                                        <span>{upcomingData.location}</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-500 pb-0.5">
                                        <span>{upcomingData.venue}</span>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Desktop/iPad: Top Row: Date & Location */}
                            <div className="flex flex-row justify-start items-end gap-12 lg:gap-16 w-full mb-6 lg:mb-8">
                                {/* Date Block */}
                                <div className="flex flex-col shrink-0">
                                    <span className={`${isPastEventsPage ? 'text-4xl lg:text-5xl' : 'text-5xl lg:text-6xl'} font-sans font-light text-off-black leading-none tracking-tighter`}>
                                        {day}
                                    </span>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className={`${isPastEventsPage ? 'text-base' : 'text-lg'} font-medium uppercase tracking-widest text-off-black pl-2`}>
                                            {month}
                                        </span>
                                        <span className={`${isPastEventsPage ? 'text-base' : 'text-lg'} font-medium text-off-black`}>
                                            {year}
                                        </span>
                                    </div>
                                </div>

                                {/* Location Block */}
                                {upcomingData.mapUrl ? (
                                    <a 
                                        href={upcomingData.mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex flex-col items-start text-left gap-1 group/map transition-colors duration-300"
                                    >
                                        <div className="flex items-center gap-2 text-xs lg:text-xs font-semibold text-gray-500 uppercase tracking-[0.25em] group-hover/map:text-red-900 transition-colors duration-300">
                                            <MapPin size={18} strokeWidth={1.5} className="shrink-0" />
                                            <span>{upcomingData.location}</span>
                                        </div>
                                        <div className="text-sm lg:text-base font-medium text-gray-500 group-hover/map:text-red-900 transition-colors duration-300 pb-0.5">
                                            <span>{upcomingData.venue}</span>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex flex-col items-start text-left gap-1">
                                        <div className="flex items-center gap-2 text-xs lg:text-xs font-semibold text-gray-500 uppercase tracking-[0.25em]">
                                            <MapPin size={18} strokeWidth={1.5} className="shrink-0" />
                                            <span>{upcomingData.location}</span>
                                        </div>
                                        <div className="text-sm lg:text-base font-medium text-gray-500 pb-0.5">
                                            <span>{upcomingData.venue}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Title */}
                            <div className="flex flex-col mb-2">
                                {upcomingData.occasionRemarks && (
                                    <div className={`${isPastEventsPage ? 'text-lg lg:text-xl xl:text-2xl' : 'text-lg lg:text-xl xl:text-xl 2xl:text-2xl'} font-light text-off-black leading-tight`}>
                                        {upcomingData.occasionRemarks}
                                    </div>
                                )}
                                <h2 
                                    className={`${isPastEventsPage ? 'text-2xl lg:text-3xl xl:text-4xl' : 'text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl'} font-sans font-normal tracking-tight text-off-black leading-none break-words max-w-full`}
                                    dangerouslySetInnerHTML={{ __html: upcomingData.occasion }}
                                />
                            </div>
                        </>
                    )}

                    {/* Go To Site Button */}
                    {upcomingData.ticketUrl && upcomingData.ticketUrl !== '#' && (
                        <div className="flex items-center h-8 mt-4 lg:mt-6 relative z-20">
                            <a 
                                href={upcomingData.ticketUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`group/ticket inline-flex items-center relative z-20 cursor-pointer rounded-full border transition-all duration-500 px-4 py-2 ${isTouchDevice ? 'border-gray-400 -ml-1.5 active:bg-off-black active:border-off-black' : 'border-transparent group-hover:border-off-black hover:!bg-off-black hover:!border-off-black -ml-4 group-hover:-ml-1.5'}`}
                            >
                                <div className="flex items-center">
                                    <span className={`block h-px transition-all duration-500 ease-out mr-3 ${isTouchDevice ? 'bg-off-black w-12 group-active/ticket:bg-white' : 'bg-off-black w-3 group-hover:w-6 group-hover/ticket:!w-12 group-hover/ticket:!bg-white'}`}></span>
                                    <div className={`flex items-center gap-2 transition-all duration-500 ease-out ${isTouchDevice ? 'text-off-black group-active/ticket:text-white' : 'text-off-black group-hover/ticket:text-white group-hover/ticket:translate-x-1'}`}>
                                        <Ticket size={14} strokeWidth={1.5} className="flex-shrink-0" />
                                        <span className="text-[11px] capitalize tracking-widest font-medium whitespace-nowrap">Go to Site</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    )}
                </div>

                <div className={`shrink min-h-0 ${isPastEventsPage ? 'basis-6 lg:basis-8 xl:basis-4' : 'basis-12 lg:basis-16 xl:basis-8'} transition-all duration-500`}></div>
                {/* Bottom Part: Performed By and Samuel Hong-Yu LEUNG */}
                <div className={`w-full transition-transform duration-500 delay-75 shrink-0 lg:mt-auto ${isCentered ? 'max-lg:translate-x-2' : ''} group-hover:translate-x-2`}>
                     {!isPastEventsPage && <div className="w-full h-px bg-gray-200 mb-4 lg:mb-6"></div>}
                     <div className="flex flex-col gap-6 lg:gap-4">
                        {/* Performed By -> "with" */}
                        <div className="flex flex-col gap-2 lg:gap-0.5">
                           <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">with</span>
                           <span className="text-lg lg:text-2lg font-light text-off-black leading-relaxed max-w-full whitespace-pre-wrap">
                               <FormattedPerformer text={upcomingData.performers} />
                           </span>
                        </div>

                        {/* Featuring -> "Samuel Hong-Yu Leung:" */}
                        <div className="flex flex-col gap-2 lg:gap-0.5">
                           <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500">Samuel Hong-Yu Leung:</span>
                           <span className="text-lg lg:text-2lg font-light text-off-black uppercase leading-relaxed max-w-full">
                               {upcomingData.program}
                           </span>
                        </div>
                     </div>
                </div>
            </div>
        );
      }
      return null;
  };

  return (
    <section 
        ref={sectionRef as React.RefObject<HTMLElement>}
        id={data.id}
        onClick={onClick}
        onTouchStart={() => isTouchDevice && !isDetailed && setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
        className={`
            group relative z-20 flex-shrink-0 flex flex-col transition-colors duration-300 overflow-hidden lg:overflow-visible
            ${isTouchDevice && isDetailed && !isPastEventsPage ? 'mb-1 lg:mb-0 lg:mr-1' : '-ml-[1px]'}
            ${isAutoHeight ? 'h-auto' : 'h-auto lg:h-[100dvh]'}
            ${isFullWidth ? 'w-full min-w-full' : 'w-screen lg:w-[45vw] min-w-[100vw] lg:min-w-[45vw]'}
            ${isDetailed 
                ? `bg-transparent ${isTouchDevice && !isPastEventsPage ? '' : 'border-r border-white/10'}` 
                : 'bg-transparent lg:bg-off-white border-r border-gray-100'}
        `}
    >
        {renderOverlay()}
        {renderBottomSheet()}

        {/* Mobile Background for Home Page Cards */}
        {!isDetailed && !isPastEventsPage && (
            <div className="absolute -top-[50%] -bottom-[50%] left-0 right-0 z-0 lg:hidden pointer-events-none overflow-hidden">
                <img 
                    src={data.imageUrl} 
                    alt="" 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`}
                    style={{ 
                        transform: isMobile 
                            ? `scale(${isPressed ? 1.3 : 1.2}) translateY(${parallaxOffset * 0.5}px)` 
                            : (isPressed ? 'scale-110' : 'scale-100')
                    }}
                />
                <div className="absolute inset-0 bg-white/70" />
            </div>
        )}

        {/* Background Layer for the "window" effect */}
        {isDetailed && backgroundImage && (isMobile || isIntersecting) && !isPastEventsPage && (
            <div 
                className="absolute inset-0 z-[-1] pointer-events-none"
                style={{ clipPath: 'inset(0)', WebkitClipPath: 'inset(0)' }}
            >
                <div 
                    className="fixed inset-0 w-screen h-[100dvh]"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </div>
        )}

        {/* Video Overlay */}
        <AnimatePresence>
            {isVideoOverlayOpen && currentVideoId && (
                <ListenVideoOverlay 
                    key="listen-video-overlay"
                    videoId={currentVideoId} 
                    title={(data as Work).title || (data as UpcomingEvent).occasion || ''} 
                    onClose={() => setIsVideoOverlayOpen(false)} 
                />
            )}
        </AnimatePresence>

        {/* Detailed Variant Overlay (On the card itself) */}
        {isDetailed && (
            <div className={`absolute inset-0 bg-[#fdfdfd] transition-opacity duration-700 z-0 ${
                activeOverlay ? 'opacity-95' : 
                isPastEventsPage ? `opacity-0` :
                (isMobile || isTouchDevice) ? 'opacity-90' : `opacity-60 group-hover:opacity-90 ${isCentered ? 'max-lg:opacity-90' : ''}`
            }`}></div>
        )}

      {isDetailed ? (
          renderDetailedContent()
      ) : (
        /* Default Layout for non-works items */
        <div className={`flex-1 flex flex-col relative z-10 cursor-pointer ${isImageTop ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative w-full h-[55%] overflow-hidden ${isImageTop ? 'order-1' : 'order-2'}`}>
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                <img 
                    src={data.imageUrl} 
                    alt={data.title}
                    className={`absolute -top-[20%] -bottom-[20%] left-0 right-0 w-full h-[140%] object-cover transition-transform duration-[1500ms] ease-out ${!isMobile && isTouchDevice && isPressed ? 'scale-110' : (!isMobile ? 'group-hover:scale-105' : '')} ${isTouchDevice ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                    style={{ 
                        transform: isMobile 
                            ? `scale(${isPressed ? 1.3 : 1.2}) translateY(${parallaxOffset * 0.5}px)` 
                            : undefined
                    }}
                    loading="lazy"
                />
            </div>

            <div className={`
                relative p-8 lg:p-12 flex flex-col justify-center
                flex-1
                ${isImageTop ? 'order-2' : 'order-1'}
            `}>
                <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-2 flex flex-col">
                    <span className="block text-xs font-sans uppercase tracking-[0.15em] text-gray-600 lg:text-gray-400 font-medium order-2 lg:order-1 mb-6 lg:mb-3">
                        {data.subtitle}
                    </span>
                    <h2 className="text-4xl lg:text-6xl font-serif uppercase text-off-black leading-none order-1 lg:order-2 mb-2 lg:mb-6">
                        <StylizedText text={data.title} />
                    </h2>
                    
                    <div className="inline-flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] order-3">
                        <span className="h-px w-8 bg-off-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                        <span className="text-xs uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">{actionLabel}</span>
                    </div>
                </div>

                <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 text-[12rem] font-serif text-gray-50 opacity-20 select-none pointer-events-none mix-blend-multiply">
                    {data.title.charAt(0)}
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default ContentSection;
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoveLeft, MoveUp, Hand } from 'lucide-react';
import StylizedText from './StylizedText';

interface HeroProps {
  scrollX: number;
  onIntroComplete?: () => void;
  onScrollClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollX, onIntroComplete, onScrollClick }) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const samuelRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  
  // Track if mouse has hasMoved to prevent cursor appearing at 0,0
  const hasMoved = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);
  
  // Animation Styles State
  const [samuelStyle, setSamuelStyle] = useState<React.CSSProperties>({ opacity: 0 });
  const [composerStyle, setComposerStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [showSwipeOverlay, setShowSwipeOverlay] = useState(false);
  const [overlayType, setOverlayType] = useState<'swipe' | 'scroll'>('swipe');

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const isIPad = typeof window !== 'undefined' && /iPad|Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 0;
    
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

  const isHorizontalLayout = windowWidth >= 1025;
  const isMobile = windowWidth < 1025;
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const isIPad = typeof window !== 'undefined' && /iPad|Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 0;

  const handleScrollHintClick = () => {
    if (isHorizontalLayout) {
        if (onScrollClick) onScrollClick();
        setOverlayType('swipe');
        setShowSwipeOverlay(true);
        setTimeout(() => {
            setShowSwipeOverlay(false);
        }, 1500);
    } else {
        if (onScrollClick) onScrollClick();
    }
  };

  // 1. FLIP Animation Setup
  useLayoutEffect(() => {
    // Wait for fonts to be ready to ensure correct measurements
    document.fonts.ready.then(() => {
        if (!samuelRef.current || !composerRef.current) return;

        // A. Measure Final Positions (where they naturally sit in the layout)
        const samuelRect = samuelRef.current.getBoundingClientRect();
        const composerRect = composerRef.current.getBoundingClientRect();
        
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // B. Calculate Deltas to force them to Center
        const samuelDeltaX = centerX - (samuelRect.left + samuelRect.width / 2);
        const samuelDeltaY = centerY - (samuelRect.top + samuelRect.height / 2);

        const composerDeltaX = centerX - (composerRect.left + composerRect.width / 2);
        const composerDeltaY = centerY - (composerRect.top + composerRect.height / 2);
        
        // Adjust vertical spacing so they don't overlap perfectly in the center
        const offsetY = 12; 

        // C. Calculate Scale for Composer
        let currentFontSize = 16;
        const composerSpan = composerRef.current.querySelector('span');
        if (composerSpan) {
            currentFontSize = parseFloat(window.getComputedStyle(composerSpan).fontSize);
        }
        
        let targetSmallSize = 13;
        const samuelSpan = samuelRef.current.querySelector('span');
        if (samuelSpan) {
            targetSmallSize = parseFloat(window.getComputedStyle(samuelSpan).fontSize);
        }
        
        const scale = targetSmallSize / currentFontSize;

        // D. Apply Initial State (Centered, Blurred, Invisible)
        setSamuelStyle({
            transform: `translate3d(${samuelDeltaX}px, ${samuelDeltaY - offsetY}px, 0)`,
            opacity: 0, 
            filter: 'blur(10px)',
            transition: 'none'
        });

        setComposerStyle({
            transform: `translate3d(${composerDeltaX}px, ${composerDeltaY + offsetY}px, 0) scale(${scale})`,
            transformOrigin: 'center center', 
            opacity: 0,
            filter: 'blur(50px)',
            transition: 'none'
        });

        // E. Trigger Animation Sequence
        // Step 1: Appear (Blur to Clear) - 0.5s duration
        setTimeout(() => {
            const appearTransition = 'opacity 0.5s ease-out, filter 0.5s ease-out';
            
            setSamuelStyle(prev => ({
                ...prev,
                opacity: 1,
                filter: 'blur(0px)',
                transition: appearTransition
            }));

            setComposerStyle(prev => ({
                ...prev,
                opacity: 0.5, 
                filter: 'blur(0px)',
                transition: appearTransition
            }));

            // Step 2: Move (FLIP) - Wait 1.5s after appearance
            setTimeout(() => {
                // Ensure cursor is hidden when animation starts
                setIsHovering(false);
                setLoaded(true);
                
                // Define the smooth transition curve (2.5s)
                const moveTransition = 'transform 2.5s cubic-bezier(0.35, 0.3, 0.2, 1), opacity 2.5s ease-out';
                
                setSamuelStyle({
                    transform: 'translate3d(0, 0, 0)',
                    opacity: 1,
                    filter: 'blur(0px)',
                    transition: moveTransition
                });

                setComposerStyle({
                    transform: 'translate3d(0, 0, 0) scale(1)',
                    transformOrigin: 'center center',
                    opacity: 1, 
                    filter: 'blur(0px)',
                    transition: moveTransition
                });

                if (onIntroComplete) {
                    setTimeout(onIntroComplete, 2500);
                }
            }, 1500); 

        }, 100); 
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only process mouse move if loaded
    if (!loaded) return;

    if (cursorRef.current) {
        // Center the cursor
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
    }
    
    // Mark that we have moved at least once
    hasMoved.current = true;
    
    if (!isHovering) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Parallax Calculations
  // Values: Composer = 0.3; Samuel Hong-yu LEUNG = 0.2; is a = 0.5; Description = 0.7
  const parallaxSamuel = loaded ? `translateX(-${scrollX * 0.2}px)` : 'none';
  const parallaxComposer = loaded ? `translateX(-${scrollX * 0.3}px)` : 'none';
  const parallaxIsA = loaded ? `translateX(-${scrollX * 0.5}px)` : 'none';
  const parallaxDesc = loaded ? `translateX(-${scrollX * 0.7}px)` : 'none';

  return (
    <section 
        className={`relative h-full w-full flex-shrink-0 flex items-end lg:items-center justify-center text-white overflow-hidden bg-black ${isTouchDevice ? '' : 'cursor-none'}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
      {/* Custom Cursor Element - strictly hidden until loaded AND moved */}
      {!isTouchDevice && (
        <div 
          ref={cursorRef}
          className={`pointer-events-none fixed top-0 left-0 z-50 transition-opacity duration-300 ease-out flex items-center justify-center ${isHovering && loaded && hasMoved.current ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
              willChange: 'transform',
              width: '120px',
              height: '120px'
          }}
        >
          {/* The Circle */}
          <div className="absolute inset-0 bg-white/70 rounded-full backdrop-blur-[2px]"></div>
          
          {/* The Text */}
          <span className="relative z-10 text-black font-bold text-xs tracking-[0.2em] uppercase">
              Scroll
          </span>
        </div>
      )}

      {/* Background Image: Starts black (opacity-0), then fades in with blur transition */}
      <div className={`absolute inset-0 z-0 transition-all duration-[2000ms] delay-500 ease-out ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}`}>
        <img 
            src="/photos/Hero2.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-80 object-right lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 p-8 pb-24 lg:p-10 max-w-4xl w-full lg:-mt-24">
        
        {/* Samuel Name Block - Parallax 0.2 */}
        <div 
            className="mb-2 lg:mb-12"
            style={{ transform: parallaxSamuel, willChange: 'transform' }}
        >
             <div 
                ref={samuelRef}
                style={samuelStyle}
                className="inline-block"
             >
                <span className="block text-xs lg:text-sm uppercase tracking-[0.3em] opacity-80 whitespace-nowrap">Samuel Hong-Yu LEUNG</span>
             </div>
        </div>

        {/* Title Block Wrapper */}
        <div className="mb-8 relative">
            <h1 className="relative flex items-baseline leading-tight">
                {/* "is a" - Parallax 0.5 */}
                {!isMobile && (
                    <div 
                        className="absolute left-0 bottom-8 lg:bottom-12"
                        style={{ transform: parallaxIsA, willChange: 'transform' }}
                    >
                        <span 
                            className={`block text-xs lg:text-sm uppercase tracking-[0.1em] font-normal whitespace-nowrap transition-opacity duration-[2000ms] delay-[1000ms] ${loaded ? 'opacity-70' : 'opacity-0'}`}
                        >
                            is a
                        </span>
                    </div>
                )}
                
                {/* Composer Text - Parallax 0.3 */}
                <div 
                    className={`${isMobile ? 'ml-0' : 'ml-[3.5rem]'} inline-block`}
                    style={{ transform: parallaxComposer, willChange: 'transform' }}
                >
                    <div ref={composerRef} style={composerStyle}>
                         <span className="block font-serif whitespace-nowrap text-[11vw] sm:text-5xl lg:text-7xl xl:text-8xl">
                            <StylizedText text="COMPOSER" />
                        </span>
                    </div>
                </div>
            </h1>
        </div>
        
        {/* Description - Parallax 0.7 */}
        {/* Outer div applies Parallax to avoid conflict with inner animation transform */}
        {!isMobile && (
            <div 
                style={{ transform: parallaxDesc, willChange: 'transform' }}
            >
                <div className={`flex flex-col items-start gap-6 transition-all duration-[2000ms] delay-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <p className="block text-xs lg:text-sm uppercase tracking-[0.1em] opacity-70 max-w-xl leading-loose">
                        who likes to explore musical form by arranging small, cell-like materials into quasi-improvisatory syntax that plays with the listener’s perception and anticipation
                    </p>
                </div>
            </div>
        )}
      </div>
      
      {/* Touch Device Scroll Hint */}
      {isTouchDevice && (
        <button
            onClick={handleScrollHintClick}
            className={`absolute z-20 transition-all duration-1000 ease-out flex items-center gap-3 border border-white/30 rounded-full px-6 py-3 hover:bg-white/10 backdrop-blur-sm
                ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                bottom-10 left-1/2 -translate-x-1/2
            `}
            style={{ transitionDelay: loaded ? (isMobile ? '2500ms' : '3000ms') : '0ms' }}
        >
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium whitespace-nowrap flex items-center gap-2">
                {isIPad && (isHorizontalLayout ? <MoveLeft size={12} /> : <MoveUp size={12} />)}
                {isIPad && !isHorizontalLayout ? 'Scroll' : (isHorizontalLayout ? 'Swipe' : 'Scroll')}
            </span>
        </button>
      )}

      {/* Swipe Overlay for iPad Horizontal */}
      {createPortal(
        <div className={`fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-500 ease-in-out ${showSwipeOverlay ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-12 flex items-center justify-center">
                    {overlayType === 'swipe' ? (
                        <Hand size={40} className="text-white absolute right-0 animate-swipe-left" />
                    ) : (
                        <div className="flex flex-col items-center animate-bounce">
                            <Hand size={40} className="text-white" />
                            <div className="w-1 h-4 bg-white/50 rounded-full mt-2" />
                        </div>
                    )}
                </div>
                <span className="text-white text-sm tracking-[0.2em] uppercase font-medium">
                    {overlayType === 'swipe' ? 'Swipe Left to Explore' : 'Scroll to Explore'}
                </span>
            </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Hero;
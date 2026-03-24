import React, { useEffect, useRef, useState } from 'react';

const ScrollHintCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Controls the visibility of the custom cursor component
  const [isVisible, setIsVisible] = useState(false);
  
  // Check if the device is a touch device
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  // Refs to track internal state without triggering re-renders of the effect
  const activationState = useRef<'idle' | 'active' | 'expired'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isTouchDevice) return;

    // 1. On mount: Hide system cursor completely.
    // The requirement is "if user hasn't move the cursor, no cursor should be displayed"
    document.body.style.cursor = 'none';

    const handleMouseMove = (e: MouseEvent) => {
      // If we have finished the sequence, do nothing (let system cursor persist)
      if (activationState.current === 'expired') return;

      const target = e.target as Element;
      
      // Ignore events if hovering over the navigation menu (e.g. while it's closing)
      // We temporarily restore the system cursor so they can see it while the menu closes.
      if (target.closest('#navigation-menu')) {
        document.body.style.cursor = '';
        return;
      }

      const isHoveringClickable = target.closest && (target.closest('button') || target.closest('a') || target.closest('[role="button"]'));

      if (isHoveringClickable) {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsVisible(false);
        activationState.current = 'expired';
        document.body.style.cursor = '';
        return;
      }

      // Update position of the custom cursor
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // First movement detection
      if (activationState.current === 'idle') {
        activationState.current = 'active';
        document.body.style.cursor = 'none'; // Ensure system cursor is hidden
        setIsVisible(true); // Fade in custom cursor

        // Start the timer to revert to normal
        timerRef.current = setTimeout(() => {
          setIsVisible(false); // Fade out custom cursor
          activationState.current = 'expired';
          document.body.style.cursor = ''; // Restore system cursor
        }, 2000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timerRef.current) clearTimeout(timerRef.current);
      // Safety: Ensure system cursor is restored when unmounting (navigating away)
      document.body.style.cursor = '';
    };
  }, []);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 z-[60] pointer-events-none transition-opacity duration-500 ease-out flex items-center justify-center
            ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ 
            width: '120px',
            height: '120px',
            willChange: 'transform'
        }}
    >
        {/* The Circle - transparent 80% */}
        <div className="absolute inset-0 bg-white/80 rounded-full backdrop-blur-[2px]"></div>
        
        {/* The Text */}
        <span className="relative z-10 text-black font-bold text-xs tracking-[0.2em] uppercase">
            Scroll
        </span>
    </div>
  );
};

export default ScrollHintCursor;
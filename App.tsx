
import React, { useRef, useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ContentSection from './components/ContentSection';
import VideoSection from './components/VideoSection';
import WorksPage from './components/WorksPage';
import UpcomingsPage from './components/UpcomingsPage';
import AboutPage from './components/AboutPage';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import { SECTIONS } from './constants';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentScrollX, setCurrentScrollX] = useState(0);
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1025);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetView, setTargetView] = useState<'home' | 'works' | 'upcomings' | 'about'>('home');
  
  // Pre-load transition images
  useEffect(() => {
    const images = ['/photos/compositions.jpg', '/photos/upcoming.jpg', '/photos/about.jpg'];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  // Derive currentView from location.pathname
  const currentView = location.pathname === '/compositions' ? 'works' :
                      location.pathname === '/upcomings' ? 'upcomings' :
                      location.pathname === '/about' ? 'about' : 'home';

  // Upcomings State
  const [upcomingsMode, setUpcomingsMode] = useState<'Upcomings' | 'Past Events'>('Upcomings');
  const [selectedYear, setSelectedYear] = useState('All Years');

  // Works State
  const [worksFilter, setWorksFilter] = useState('Featured');
  const [listenAvailable, setListenAvailable] = useState(false);

  // Smooth Scrolling Logic Refs (Only active on Home view)
  const scrollState = useRef({
    target: 0,
    current: 0,
  });
  const requestRef = useRef<number | null>(null);

  // Handle View Navigation
  const handleNavigate = (view: 'home' | 'works' | 'upcomings' | 'about', href: string, skipTransition = false) => {
      const performNavigation = () => {
          // Reset page-specific states
          if (view === 'works') {
              setWorksFilter('Featured');
              setListenAvailable(false);
          } else if (view === 'upcomings') {
              setUpcomingsMode('Upcomings');
              setSelectedYear('All Years');
          }
          
          navigate(href);
          
          // If navigating to home with a hash, wait for render then scroll
          if (view === 'home' && href.includes('#')) {
              setTimeout(() => {
                  const id = href.split('#')[1];
                  const element = document.getElementById(id);
                  if (element && containerRef.current) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
                  }
              }, 100);
          } else {
              // If plain switching (e.g. clicking Logo or "Home"), reset scroll
              setCurrentScrollX(0);
              
              if (view === 'home' && containerRef.current) {
                  // Force scroll reset
                  containerRef.current.scrollLeft = 0;
                  scrollState.current.target = 0;
                  scrollState.current.current = 0;
              }
          }
      };

      if (skipTransition || location.pathname === href.split('#')[0]) {
          performNavigation();
      } else {
          setTargetView(view);
          setIsTransitioning(true);
          // Curtain goes down (0.5s) + stays (0.2s) = 0.7s
          setTimeout(() => {
              performNavigation();
              // Increased delay to let the new page settle before fading out the transition
              setTimeout(() => {
                  setIsTransitioning(false);
              }, 300);
          }, 700);
      }
  };

  // Smooth Scroll Implementation for Home View
  useEffect(() => {
    // Only run this custom scroll logic on Home view
    if (currentView !== 'home') return;

    const container = containerRef.current;
    if (!container) return;

    // Reset physics when switching back to home
    scrollState.current.current = container.scrollLeft;
    scrollState.current.target = container.scrollLeft;
    
    // Ensure requestRef is null to start fresh
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
    }

    const getMaxScroll = () => container.scrollWidth - container.clientWidth;

    const handleResize = () => {
       const max = getMaxScroll();
       if (scrollState.current.target > max) {
         scrollState.current.target = max;
         scrollState.current.current = max;
         container.scrollLeft = max;
       }
    };
    window.addEventListener('resize', handleResize);

    const updateScroll = () => {
      if (!container) return;

      const { target, current } = scrollState.current;
      const ease = 0.08; 
      const diff = target - current;

      if (Math.abs(diff) > 0.5) {
        const newCurrent = current + diff * ease;
        scrollState.current.current = newCurrent;
        container.scrollLeft = newCurrent;
        setCurrentScrollX(newCurrent);
        requestRef.current = requestAnimationFrame(updateScroll);
      } else {
        scrollState.current.current = target;
        container.scrollLeft = target;
        setCurrentScrollX(target);
        requestRef.current = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isMenuOpen) return;
      if (window.innerWidth < 1025) return; // Let browser handle vertical scroll on mobile/tablet
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
            setCurrentScrollX(container.scrollLeft);
            setCurrentScrollY(container.scrollTop);
            scrollState.current.current = container.scrollLeft;
            scrollState.current.target = container.scrollLeft;
        }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [isMenuOpen, currentView]);

  const handleHeroScrollClick = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const isDesktop = window.innerWidth >= 1025;
    const isMobile = window.innerWidth < 1025;
    const targetScroll = isDesktop ? window.innerWidth : (isMobile ? window.innerHeight * 0.6 : window.innerHeight);
    const startScroll = isDesktop ? container.scrollLeft : container.scrollTop;
    const distance = targetScroll - startScroll;
    const duration = 1500; // 1.5 seconds
    let startTime: number | null = null;

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Ease in out cubic
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentScroll = startScroll + distance * ease;
      
      if (isDesktop) {
        container.scrollLeft = currentScroll;
        scrollState.current.target = currentScroll;
        scrollState.current.current = currentScroll;
        setCurrentScrollX(currentScroll);
      } else {
        container.scrollTop = currentScroll;
        setCurrentScrollY(currentScroll);
      }

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div className="relative h-[100dvh] w-full bg-off-white text-off-black overflow-hidden font-sans selection:bg-black selection:text-white">
      
      <PageTransition isVisible={isTransitioning} targetView={targetView} />
      
      {/* Header */}
      {/* ADDED pointer-events-none to outer div to allow clicks to pass through to About Page controls */}
      <div className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 pointer-events-none ${currentView !== 'home' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}>
         {/* Container is pointer-events-none to let clicks pass through empty areas. Header buttons re-enable pointer-events. */}
         <div>
            <Header 
                onMenuClick={() => setIsMenuOpen(true)} 
                onLogoClick={() => handleNavigate('home', '/#works-preview')}
                onNameClick={() => handleNavigate('home', '/#hero')}
                isDarkTheme={(currentView === 'home' && (isMobile ? currentScrollY < window.innerHeight * 0.5 : currentScrollX < window.innerWidth * 0.5)) || currentView === 'about'} 
                headerMode={currentView === 'works' ? 'works' : currentView === 'upcomings' ? 'upcomings' : currentView === 'about' ? 'about' : 'default'}
                upcomingsMode={upcomingsMode}
                onUpcomingsModeChange={setUpcomingsMode}
                selectedYear={selectedYear}
                onYearChange={setSelectedYear}
                activeFilter={worksFilter}
                onFilterChange={setWorksFilter}
                listenAvailable={listenAvailable}
                onListenAvailableChange={setListenAvailable}
            />
         </div>
      </div>
      
      <Navigation 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* View Rendering */}
      <Routes>
        <Route path="/" element={
          <main 
            ref={containerRef}
            className="h-full w-full flex flex-col lg:flex-row overflow-y-auto overflow-x-hidden lg:overflow-x-auto lg:overflow-y-hidden no-scrollbar"
            style={{ scrollBehavior: 'auto' }} 
          >
            <div id="hero" className="shrink-0 sticky top-0 lg:left-0 z-0 w-full lg:w-[calc(100vw+1px)] h-[100dvh]">
                <Hero 
                    scrollX={currentScrollX} 
                    onScrollClick={handleHeroScrollClick}
                />
            </div>

            {SECTIONS.filter(s => s.id !== 'hero').slice(0, 2).map((section) => (
                <div key={section.id} className="shrink-0 relative z-10">
                    <ContentSection 
                        data={section} 
                        onClick={
                            section.id === 'works-preview' ? () => handleNavigate('works', '/compositions') : 
                            section.id === 'upcomings-preview' ? () => handleNavigate('upcomings', '/upcomings') : undefined
                        }
                    />
                </div>
            ))}

            <div className="shrink-0 relative z-10">
                <VideoSection 
                    videoId="lsXMEEnmyVk"
                    title="Excursion II"
                    subtitle="for Flute, Clarinet, Sheng (37-reed), Pipa, Piano, 2 Violins, Viola, Cello"
                />
            </div>

            <div className="shrink-0 relative z-10">
                <VideoSection 
                    videoId="3nKidgXXxl0"
                    title="it is Coming III"
                    subtitle="for Violin & Traditional Gaohu"
                />
            </div>

            {SECTIONS.filter(s => s.id !== 'hero').slice(2).map((section) => (
                <div key={section.id} className="shrink-0 relative z-10">
                    <ContentSection 
                        data={section}
                        onClick={
                            section.id === 'about' ? () => handleNavigate('about', '/about') : undefined
                        } 
                    />
                </div>
            ))}

            <div className="shrink-0 relative z-10 w-full lg:w-[40vw] -ml-[1px]">
                <Footer />
            </div>
          </main>
        } />

        <Route path="/compositions" element={
          <WorksPage 
            key={location.pathname} 
            filter={worksFilter} 
            listenAvailable={listenAvailable} 
            onFilterChange={setWorksFilter}
            onListenAvailableChange={setListenAvailable}
          />
        } />
        
        <Route path="/upcomings" element={
          <UpcomingsPage 
            key={location.pathname} 
            mode={upcomingsMode} 
            onModeChange={setUpcomingsMode}
            year={selectedYear} 
          />
        } />

        <Route path="/about" element={<AboutPage key={location.pathname} />} />
      </Routes>

    </div>
  );
}

export default App;

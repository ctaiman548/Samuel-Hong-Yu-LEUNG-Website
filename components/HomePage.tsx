
import React from 'react';
import Hero from './Hero';
import ContentSection from './ContentSection';
import VideoSection from './VideoSection';
import Footer from './Footer';
import { SECTIONS } from '../constants';

interface HomePageProps {
  containerRef: React.RefObject<HTMLDivElement>;
  currentScrollX: number;
  handleHeroScrollClick: () => void;
  handleNavigate: (view: 'home' | 'works' | 'upcomings' | 'about', href: string, skipTransition?: boolean) => void;
}

const HomePage: React.FC<HomePageProps> = ({ 
  containerRef, 
  currentScrollX, 
  handleHeroScrollClick, 
  handleNavigate 
}) => {
  return (
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
  );
};

export default HomePage;

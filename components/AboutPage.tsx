
import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import StylizedText from './StylizedText';
import ScrollHintCursor from './ScrollHintCursor';
import { SECTIONS } from '../constants';
import { Download } from 'lucide-react';
import Footer from './Footer';

type Tab = 'bio' | 'resume';
type Language = 'eng' | 'de' | 'chin';

const BIO_TEXT = {
  eng: [
    "Samuel Hong-Yu LEUNG is a Hong Kong-born composer pursuing a Master’s degree in composition with Fabien Lévy and Mauro Lanza at the Conservatoire of Music and Theatre »Felix Mendelssohn Bartholdy« Leipzig, Germany. He graduated from the Chinese University of Hong Kong (CUHK) with a first-class honours Bachelor of Arts in Music. His work Variations for string quartet was selected to the International Society for Contemporary Music (ISCM) World New Music Days 2025 (Portugal) to represent the Hong Kong sector; another work Excursion II was also selected to represent Hong Kong at the 70<sup>th</sup> International Rostrum of Composers (Lithuania) and is nominated as one of the five recommended works in the under-30 category. Remarkably, his piano solo Tastaturlust has already been performed three times at different festivals and competitions in Germany.",
    "Leung is a frequently featured young composer on the Hong Kong music scene: he was commissioned to write for the season’s opening concert (2021-22) of the Hong Kong Chinese Orchestra, commissioned for the “2022 Hong Kong Contemporary Music Festival: Global Delights” organized by the Hong Kong Composers’ Guild (HKCG), and invited to compose for “Transcending Music Legacy” to celebrate the 40th anniversary of HKCG (2023). He is also interested in participating in collaborative art projects. He joined “A Date with Dogs”, organized by the Leisure and Cultural Services Department (LCSD) & Make A Difference Institute (MaD), which created interactive sound installations and music for dogs with public performances and garden tours. He was also participants of Darmstadt Summer Course 2025 and the Lucerne Academy for Contemporary Music 2026.",
    "Leung’s works have been performed by various music groups such as the Dissolution Ensemble, Mivos Quartet, Metropolitana Soloist String Quartet, the Hong Kong Chinese Orchestra, and the Hong Kong New Music Ensemble (HKNME). He likes to explore musical form by arranging small, cell-like materials into quasi-improvisatory syntax that plays with the listener’s perception and anticipation."
  ],
  de: [
    "Samuel Hong-Yu LEUNG ist ein in Hongkong geborener Komponist und Masterstudent in Komposition bei Fabien Lévy und Mauro Lanza an der University of Music and Theatre »Felix Mendelssohn Bartholdy« Leipzig. Er schloss sein Studium an der Chinese University of Hong Kong (CUHK) mit einem Bachelor of Arts in Musik mit First-Class Honours ab. Kürzlich wurde sein Streichquartett Variations für die International Society for Contemporary Music (ISCM) World New Music Days 2025 (Portugal) ausgewählt, um den Hongkong-Sektor zu repräsentieren, und erhielt den ISCM Young Composers Award; ein weiteres Werk, Excursion II, wurde ebenfalls ausgewählt, um Hong Kong beim 70<sup>th</sup> International Rostrum of Composers (Lithuania) zu vertreten, und ist als eines der fünf empfohlenen Werke in der Kategorie unter 30 nominiert. Bemerkenswerterweise wurde sein Klaviersolo Tastaturlust bereits dreimal bei verschiedenen Festivals und Wettbewerben in Deutschland aufgeführt.",
    "Leung ist ein häufig vorgestellter junger Komponist auf der Musikszene in seiner Heimatstadt Hongkong: Er wurde beauftragt, für das Eröffnungskonzert der Saison (2021-22) des Hong Kong Chinese Orchestra zu komponieren, beauftragt für das „2022 Hong Kong Contemporary Music Festival: Global Delights“, organisiert vom Hong Kong Composers’ Guild (HKCG), und eingeladen, für „Transcending Music Legacy“ zum 40. Jubiläum des HKCG (2023) zu komponieren. Er ist auch an der Teilnahme an kollaborativen Kunstprojekten interessiert. Er nahm an „A Date with Dogs“ teil, organisiert vom Leisure and Cultural Services Department (LCSD) & Make A Difference Institute (MaD), das interaktive Klanginstallationen und Musik für Hunde schuf mit öffentlichen Aufführungen und Gartentouren. Er war auch Teilnehmer der Darmstädter Ferienkurse 2025 und der Akademie für zeitgenössische Musik Luzern 2026.",
    "Leungs Werke wurden von verschiedenen Musikgruppen aufgeführt, darunter das Dissolution Ensemble, Mivos Quartet, das Metropolitana Soloist String Quartet, das Hong Kong Chinese Orchestra und das Hong Kong New Music Ensemble (HKNME). Er erkundet gerne musikalische Form, indem er kleine, zellartige Materialien zu einer quasi-improvisatorischen Syntax anordnet, die mit der Wahrnehmung und Erwartung des Hörers spielt."
  ],
  chin: [
    "梁康裕是⾹港作曲家，現於德國萊⽐錫⾳樂及戲劇學院跟隨 Fabien Lévy 和 Mauro Lanza 攻讀作曲碩⼠學位。他以⼀級榮譽成績畢業於⾹港中⽂⼤學⾳樂⽂學⼠課程。",
    "最近，他的弦樂四重奏作品《Variations》獲選代表⾹港參加 2025 年在葡萄⽛舉⾏的國際現代⾳樂協會（ISCM）世界⾳樂⽇，並榮獲 ISCM Young Composers Award；另⼀作品《Excursion II》亦獲選代表⾹港參加在⽴陶宛舉⾏的第 70 屆 International Rostrum of Composers，並被提名為 30 歲以下類別中五部推薦作品之⼀。值得⼀提的是，他的鋼琴獨奏作品《Tastaturlust》已在德國不同的⾳樂節與⽐賽中三度演出。",
    "他的作品會在本地重要⾳樂場合中發表，包括為⾹港中樂團 2021-22 樂季開季⾳樂會創作委約作品，為⾹港作曲家聯會主辦的「2022 ⾹港現代⾳樂節：環宇薈萃」創作，以及受邀為慶祝 HKCG 成⽴四⼗週年的「傳承 ． 美樂之河」（2023）創作。他亦熱衷於參與跨界藝術合作項⽬，例如參與由康樂及⽂化事務署與 Make A Difference Institute（MaD）合辦的「A Date with Dogs」，為狗隻創作互動聲⾳裝置與⾳樂，並於多個公園中巡迴展出及舉辦公開演出。他亦活躍於各⼤現代⾳樂節，包括 Darmstadt 國際新⾳樂節 2025 與琉森現代⾳樂學院 2026。",
    "他的作品會由多個⾳樂團體演出，包括 Dissolution Ensemble、Mivos Quartet、Metropolitana Soloist String Quartet、⾹港中樂團及⾹港創樂團等。他熱衷於排列細⼩的⾳樂素材，形成⼀種聽似即興式的語法並建構其⾳樂曲式（form），藉此「玩弄」聽者的感知與預想。"
  ]
};

const RESUME_DATA = {
    eng: [
        {
            title: "Education",
            items: [
                "Master of Composition, Hochschule für Musik und Theater „Felix Mendelssohn Bartholdy“ Leipzig (09.2024 - Present)",
                "Bachelor of Arts, The Chinese University of Hong Kong (CUHK), First Class Honors (09.2019 - 07.2023)",
                "Associate of Trinity College London (ATCL) Violin Recital, Distinction (04.2019)"
            ]
        },
        {
            title: "Awards & Honors",
            items: [
                "International Society for Contemporary Music (ISCM) World New Music Days 2025 Selection",
                "70<sup>th</sup> International Rostrum of Composers (IRC) - Recommended Work (Under 30), (2024)",
                "CASH Scholarship 2022/23",
                "David Gwilt Composition Prize (06.2022)",
                "Talent Development Scholarship (05.2022)",
                "Winner in “New Generation 2020” (08.2021)"
            ]
        },
        {
             title: "Experience",
             items: [
                 "Research Assistant, The Chinese University of Hong Kong (CUHK), (09.2023 - 08.2025)",
                 "Teaching Assistant, The Chinese University of Hong Kong (CUHK), (09.2023 - 01.2024)",
                 "Private Violin/Music Theory Tutor (09.2019 - 03.2024)"
             ]
        },
    ],
    de: [
        {
            title: "Ausbildung",
            items: [
                "Master Komposition, HMT „Felix Mendelssohn Bartholdy“ Leipzig (09.2024 - Gegenwart)",
                "Bachelor of Arts, The Chinese University of Hong Kong (CUHK), First Class Honors (09.2019 - 07.2023)",
                "Associate of Trinity College London (ATCL) Violine, Auszeichnung (04.2019)"
            ]
        },
        {
            title: "Auszeichnungen",
            items: [
                "ISCM World New Music Days 2025 Auswahl (Portugal)",
                "70. International Rostrum of Composers - Empfohlenes Werk (U30), (2024)",
                "CASH Scholarship 2022/23",
                "David Gwilt Composition Prize (06.2022)",
                "Talent Development Scholarship (05.2022)",
                "Gewinner „New Generation 2020“ (08.2021)"
            ]
        },
        {
             title: "Berufserfahrung",
             items: [
                 "Forschungsassistent, The Chinese University of Hong Kong (CUHK), (09.2023 - 08.2025)",
                 "Teaching Assistant, The Chinese University of Hong Kong (CUHK), (09.2023 - 01.2024)",
                 "Privatlehrer für Violine/Musiktheorie (09.2019 - 03.2024)"
             ]
        },
    ]
};

const AboutPage: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const titleBlockRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsTouchDevice(typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0));
      setIsMobile(window.innerWidth < 1025);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Physics state for vertical scrolling
  const scrollState = useRef({ target: 0, current: 0 });
  const requestRef = useRef<number | null>(null);

  // Tracks visual scroll position to drive parallax effects
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [availableMovement, setAvailableMovement] = useState(0);

  const [activeTab, setActiveTab] = useState<Tab>('bio');
  const [activeLang, setActiveLang] = useState<Language>('eng');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (languageOptionsRef.current && !languageOptionsRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Background image from sections
  const bgImage = SECTIONS.find(s => s.id === 'about')?.imageUrl || SECTIONS[0].imageUrl;

  // Measure available vertical space for the Title to move without overlapping controls
  useLayoutEffect(() => {
    const measure = () => {
        if (titleBlockRef.current && controlsRef.current) {
            const titleRect = titleBlockRef.current.getBoundingClientRect();
            const controlsRect = controlsRef.current.getBoundingClientRect();
            
            // Calculate gap between bottom of title block and top of controls
            const gap = controlsRect.top - titleRect.bottom;
            
            // We want to leave some buffer
            setAvailableMovement(Math.max(0, gap - 48));
        }
    };
    
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTab, activeLang]);

  // Vertical Smooth Scroll Logic
  useEffect(() => {
    const container = contentRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    // Reset physics on tab/lang change
    scrollState.current.current = 0;
    scrollState.current.target = 0;
    container.scrollTop = 0;
    setScrollTop(0);
    setScrollProgress(0);
    
    if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
    }

    const getMaxScroll = () => container.scrollHeight - container.clientHeight;

    const updateScroll = () => {
      if (!container) return;
      const { target, current } = scrollState.current;
      const ease = 0.08;
      const diff = target - current;
      const maxScroll = getMaxScroll();

      if (Math.abs(diff) > 0.5) {
        const newCurrent = current + diff * ease;
        scrollState.current.current = newCurrent;
        container.scrollTop = newCurrent;
        setScrollTop(newCurrent);
        
        if (maxScroll > 0) {
            setScrollProgress(Math.min(1, Math.max(0, newCurrent / maxScroll)));
        } else {
            setScrollProgress(0);
        }

        requestRef.current = requestAnimationFrame(updateScroll);
      } else {
        scrollState.current.current = target;
        container.scrollTop = target;
        setScrollTop(target);
        
        if (maxScroll > 0) {
            setScrollProgress(Math.min(1, Math.max(0, target / maxScroll)));
        } else {
            setScrollProgress(0);
        }

        requestRef.current = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1025) return; // Let browser handle vertical scroll on mobile/tablet
      if (container.scrollHeight <= container.clientHeight) return;

      e.preventDefault();
      const multiplier = 1.5; 
      const delta = e.deltaY;
      
      scrollState.current.target += delta * multiplier;
      const maxScroll = getMaxScroll();
      scrollState.current.target = Math.max(0, Math.min(scrollState.current.target, maxScroll));

      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(updateScroll);
      }
    };

    const handleScroll = () => {
        if (!requestRef.current) {
            const current = container.scrollTop;
            const maxScroll = getMaxScroll();
            scrollState.current.current = current;
            scrollState.current.target = current;
            setScrollTop(current);
            if (maxScroll > 0) {
                setScrollProgress(Math.min(1, Math.max(0, current / maxScroll)));
            }
        }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      wrapper.removeEventListener('wheel', handleWheel);
      container.removeEventListener('scroll', handleScroll);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [activeTab, activeLang]);

  const handleTabChange = (tab: Tab) => {
      setActiveTab(tab);
      if (tab === 'resume' && activeLang === 'chin') {
          setActiveLang('eng');
      }
  };

  const getDownloadLabel = () => {
      if (activeTab === 'bio') {
          return 'Download Bio (PDF)';
      }
      return activeLang === 'de' ? 'Download Resumé [DE] (PDF)' : 'Download Resumé [ENG] (PDF)';
  };

  const getDownloadLink = () => {
      if (activeTab === 'bio') {
          return '/about/Bio Samuel Hong-Yu LEUNG.pdf';
      }
      return activeLang === 'de' 
        ? '/about/CV Samuel Hong-Yu LEUNG [Deutsch].pdf' 
        : '/about/CV Samuel Hong-Yu LEUNG [English].pdf';
  };

  const formatMixedText = (text: string) => {
    const parts = text.split(/([\x20-\x7E]+)/g);
    
    return parts.map((part, index) => {
        if (part.match(/^[\x20-\x7E]+$/)) {
            return <span key={index} className="font-sans font-light opacity-95">{part}</span>;
        }
        return <span key={index}>{part}</span>;
    });
  };

  const renderBioParagraph = (text: string, lang: Language) => {
      if (lang === 'chin') return formatMixedText(text);

      const nameToBold = "Samuel Hong-Yu LEUNG";
      if (text.includes(nameToBold)) {
          const parts = text.split(nameToBold);
          return (
              <>
                <span dangerouslySetInnerHTML={{ __html: parts[0] }} />
                <span className="font-semibold text-white">{nameToBold}</span>
                <span dangerouslySetInnerHTML={{ __html: parts.slice(1).join(nameToBold) }} />
              </>
          );
      }
      return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  const currentResumeData = activeLang === 'chin' 
    ? RESUME_DATA['eng'] 
    : RESUME_DATA[activeLang as 'eng' | 'de'];

  return (
    <div ref={wrapperRef} className="relative h-full w-full bg-black overflow-hidden">
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
            <div className="fixed inset-0 bg-black/60" />
        </div>

        {/* Split Layout Container */}
        <div 
            className="relative z-10 h-full w-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-y-hidden no-scrollbar"
            style={{ 
                scrollBehavior: 'auto',
                ...(isMobile ? {
                    maskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 120px)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, transparent 60px, black 120px)'
                } : {})
            }}
        >
             
             {/* Sidebar */}
             <div ref={sidebarRef} className="shrink-0 w-full lg:w-auto lg:min-w-[400px] h-auto lg:h-full relative lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-white/10 overflow-visible lg:overflow-y-auto bg-black/50 backdrop-blur-sm z-[100] touch-auto">
                 
                 <div className="flex flex-col justify-between min-h-0 lg:min-h-full p-12 pt-32 lg:pt-12 lg:pr-32">
                    <div className="flex-1 flex flex-col justify-center relative">
                        <div ref={titleBlockRef}>
                            <div style={{ transform: `translateY(${scrollProgress * availableMovement}px)`, transition: 'transform 0.1s ease-out', willChange: 'transform' }}>
                                 <h1 className="text-4xl lg:text-6xl xl:text-8xl font-serif text-white uppercase whitespace-nowrap">
                                    <StylizedText text="About" />
                                </h1>
                            </div>
                            
                            <div style={{ 
                                transform: `translate3d(-${scrollTop * 0.2}px, ${scrollTop * 0.2}px, 0)`, 
                                opacity: Math.max(0, 1 - scrollTop / 300),
                                willChange: 'transform, opacity' 
                            }}>
                                <p className="hidden lg:block mt-6 text-sm uppercase tracking-widest text-gray-300 max-w-xs leading-relaxed">
                                    Biography & Resumé
                                </p>
                            </div>

                            <div style={{ 
                                transform: `translate3d(-${scrollTop * 0.2}px, ${scrollTop * 0.2}px, 0)`,
                                opacity: Math.max(0, 1 - scrollTop / 300),
                                willChange: 'transform, opacity' 
                            }}>
                                <div className="mt-12 w-12 h-[1px] bg-white"></div>
                            </div>

                            {/* Mobile Controls */}
                            <div className="mt-8 lg:mt-2 lg:hidden flex flex-row items-end lg:flex-col lg:items-start gap-6 relative z-[100]">
                                {/* View Switch */}
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-semibold">View</span>
                                    <div className="flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => handleTabChange('bio')}
                                            onTouchEnd={(e) => { e.preventDefault(); handleTabChange('bio'); }}
                                            className={`group px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === 'bio' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                        >
                                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>Bio</span>
                                        </button>
                                        <button 
                                            onClick={() => handleTabChange('resume')}
                                            onTouchEnd={(e) => { e.preventDefault(); handleTabChange('resume'); }}
                                            className={`group px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 whitespace-nowrap ${activeTab === 'resume' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                        >
                                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>Resumé</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Language Switch */}
                                <div className="flex flex-col gap-3 relative" ref={languageOptionsRef}>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-semibold">Language</span>
                                    
                                    {/* Mobile Dropdown */}
                                    <div className="lg:hidden">
                                        <button 
                                            onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                            onTouchEnd={(e) => { e.preventDefault(); setIsLanguageOpen(!isLanguageOpen); }}
                                            className={`group px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 flex items-center gap-1 whitespace-nowrap cursor-pointer bg-[#333333] text-white border-white`}
                                        >
                                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>{activeLang.toUpperCase()}</span> <span className="text-[8px] leading-none">▾</span>
                                        </button>
                                        
                                        {isLanguageOpen && (
                                            <div className="absolute left-0 top-full mt-2 z-[100] bg-[#222222] shadow-2xl rounded-[3px] border border-white/20 flex flex-col min-w-[120px] p-2 text-white uppercase tracking-[0.2em] gap-2">
                                                {['eng', 'de', ...(activeTab === 'bio' ? ['chin'] : [])].map((lang) => (
                                                    <button
                                                        key={lang}
                                                        onClick={() => { setActiveLang(lang as Language); setIsLanguageOpen(false); }}
                                                        onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setActiveLang(lang as Language); setIsLanguageOpen(false); }}
                                                        className={`group px-4 py-3 text-left text-[11px] font-medium transition-all duration-200 border border-white/20 rounded-[3px] ${activeLang === lang ? 'bg-[#444444] text-white' : 'bg-[#222222] hover:bg-[#333333]'}`}
                                                    >
                                                        <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>{lang.toUpperCase()}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* iPad Buttons */}
                                    <div className="hidden lg:flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => setActiveLang('eng')}
                                            onTouchEnd={(e) => { e.preventDefault(); setActiveLang('eng'); }}
                                            className={`group px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 whitespace-nowrap ${activeLang === 'eng' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                        >
                                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>ENG</span>
                                        </button>
                                        <button 
                                            onClick={() => setActiveLang('de')}
                                            onTouchEnd={(e) => { e.preventDefault(); setActiveLang('de'); }}
                                            className={`group px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 whitespace-nowrap ${activeLang === 'de' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                        >
                                            <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>DE</span>
                                        </button>
                                        {activeTab === 'bio' && (
                                            <button 
                                                onClick={() => setActiveLang('chin')}
                                                onTouchEnd={(e) => { e.preventDefault(); setActiveLang('chin'); }}
                                                className={`group px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 whitespace-nowrap ${activeLang === 'chin' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                            >
                                                <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>CHIN</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="shrink-0 pt-0 lg:pt-6 pb-4">
                        <div className="flex flex-col gap-8 border-t border-gray-900/10 pt-8 w-full items-start">
                            <div className="mt-2">
                                 <a 
                                    href={getDownloadLink()} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onTouchEnd={(e) => { 
                                        // Allow default behavior for links so they open, but stop propagation
                                        e.stopPropagation(); 
                                    }}
                                    className={`group/download inline-flex items-center relative z-20 cursor-pointer rounded-full border transition-all duration-500 px-4 py-2 ${isTouchDevice ? 'border-white -ml-1.5' : 'border-white hover:!bg-white hover:!border-black -ml-4 group-hover:-ml-1.5'}`}
                                >
                                    <div className="flex items-center">
                                        <span className={`hidden lg:block h-px transition-all duration-500 ease-out mr-3 ${isTouchDevice ? 'bg-white w-12' : 'bg-white w-3 group-hover:w-6 group-hover/download:!w-12 group-hover/download:!bg-black'}`}></span>
                                        <div className={`flex items-center gap-2 transition-all duration-500 ease-out ${isTouchDevice ? 'text-white' : 'text-white group-hover/download:text-black group-hover/download:translate-x-1'}`}>
                                            <Download size={14} strokeWidth={1.5} className="flex-shrink-0" />
                                            <span className="text-[11px] uppercase tracking-widest font-normal whitespace-nowrap">{getDownloadLabel()}</span>
                                        </div>
                                    </div>
                                 </a>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>

             {/* Right Content Area Wrapper */}
             <div className="flex-1 h-full relative overflow-visible lg:overflow-hidden">
                
                {/* Header Controls - Absolute Positioned (No "Block" Background) */}
                <div 
                    ref={controlsRef}
                    className="hidden lg:block absolute top-0 left-0 w-full z-40 px-12 lg:px-20 xl:px-24 pt-6 lg:pt-10 pb-8 bg-transparent pointer-events-none"
                >
                     {/* Inner wrapper for pointer events on buttons only */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start pointer-events-auto">
                        {/* View Switch */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-semibold">View</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleTabChange('bio')}
                                    onTouchEnd={(e) => { e.preventDefault(); handleTabChange('bio'); }}
                                    className={`group relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer ${activeTab === 'bio' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                >
                                    <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>Bio</span>
                                </button>
                                <button 
                                    onClick={() => handleTabChange('resume')}
                                    onTouchEnd={(e) => { e.preventDefault(); handleTabChange('resume'); }}
                                    className={`group relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer ${activeTab === 'resume' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                >
                                    <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>Resumé</span>
                                </button>
                            </div>
                        </div>

                        {/* Language Switch */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-semibold">Language</span>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setActiveLang('eng')}
                                    onTouchEnd={(e) => { e.preventDefault(); setActiveLang('eng'); }}
                                    className={`group relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer ${activeLang === 'eng' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                >
                                    <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>ENG</span>
                                </button>
                                <button 
                                    onClick={() => setActiveLang('de')}
                                    onTouchEnd={(e) => { e.preventDefault(); setActiveLang('de'); }}
                                    className={`group relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer ${activeLang === 'de' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                >
                                    <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>DE</span>
                                </button>
                                {activeTab === 'bio' && (
                                    <button 
                                        onClick={() => setActiveLang('chin')}
                                        onTouchEnd={(e) => { e.preventDefault(); setActiveLang('chin'); }}
                                        className={`group relative before:absolute before:-inset-3 before:content-[''] px-3 py-1.5 rounded-[3px] border text-[11px] tracking-[0.2em] uppercase font-medium transition-colors duration-200 ease-in-out whitespace-nowrap cursor-pointer ${activeLang === 'chin' ? 'bg-[#333333] text-white border-white' : 'border-transparent text-white hover:bg-white/10 hover:border-white/30'}`}
                                    >
                                        <span className={`${isTouchDevice ? 'group-active:scale-110' : ''} transition-transform duration-200 inline-block`}>CHIN</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Container with Masking */}
                <div 
                    ref={contentRef} 
                    className="h-full relative lg:absolute inset-0 z-20 overflow-y-visible lg:overflow-y-auto no-scrollbar flex flex-col"
                    style={{
                        maskImage: isMobile ? 'none' : 'linear-gradient(to bottom, transparent 0px, transparent 100px, black 160px)',
                        WebkitMaskImage: isMobile ? 'none' : 'linear-gradient(to bottom, transparent 0px, transparent 100px, black 160px)'
                    }}
                >
                     {/* Increased Top Padding to clear header initially */}
                     <div className="flex-1 flex flex-col items-start min-h-full px-6 lg:px-12 xl:px-20 2xl:px-24 pt-12 lg:pt-44 pb-24 max-w-5xl w-full">
                          
                          <h2 className="mb-8 text-2xl font-medium text-white uppercase tracking-widest">
                            {activeTab === 'bio' ? (activeLang === 'chin' ? '簡介' : 'BIO') : 'RESUMÉ'}
                          </h2>
                          
                          {/* BIO CONTENT */}
                          {activeTab === 'bio' && (
                            <div className="animate-[fadeIn_0.5s_ease-out] flex-1 flex flex-col w-full">
                                 <div className="flex-1">
                                     {BIO_TEXT[activeLang].map((paragraph, index) => (
                                        <p 
                                            key={index} 
                                            className={`
                                                mb-8 font-light text-white leading-loose text-justify last:mb-0
                                                ${activeLang === 'chin' ? 'text-lg lg:text-xl font-serif' : 'text-base lg:text-lg'}
                                            `}
                                        >
                                            {renderBioParagraph(paragraph, activeLang)}
                                        </p>
                                    ))}
                                 </div>
                                 <div className="shrink-0 w-[calc(100%+3rem)] -ml-6 lg:w-[calc(100%+6rem)] lg:-ml-12 lg:w-full lg:ml-0 flex items-center justify-center pt-0 pb-0 lg:pt-20 lg:pb-10 mt-auto lg:mt-0 -mb-24 lg:mb-0">
                                     <div className="block lg:hidden w-full">
                                         <Footer />
                                     </div>
                                     <span className="hidden lg:block text-xs uppercase tracking-widest text-gray-300 opacity-30">End of Bio</span>
                                 </div>
                            </div>
                          )}

                          {/* RESUME CONTENT */}
                          {activeTab === 'resume' && (
                             <div className="w-full flex-1 flex flex-col">
                                <div className="flex-1">
                                    {currentResumeData.map((section, index) => (
                                         <div 
                                             key={index} 
                                             className="w-full mb-16 animate-[fadeIn_0.5s_ease-out]"
                                             style={{ animationDelay: `${index * 100}ms` }}
                                         >
                                             <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-gray-300 mb-8 border-b border-gray-200/30 pb-4">
                                                 {section.title}
                                             </h3>
                                             <ul className="space-y-6">
                                                 {section.items.map((item, i) => (
                                                     <li key={i} className="text-base font-light text-white leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                                                 ))}
                                             </ul>
                                         </div>
                                     ))}
                                </div>
                                 <div className="shrink-0 w-[calc(100%+3rem)] -ml-6 lg:w-[calc(100%+6rem)] lg:-ml-12 lg:w-full lg:ml-0 flex items-center justify-center pt-0 pb-0 lg:pt-20 lg:pb-10 mt-auto lg:mt-0 -mb-24 lg:mb-0">
                                     <div className="block lg:hidden w-full">
                                         <Footer />
                                     </div>
                                     <span className="hidden lg:block text-xs uppercase tracking-widest text-gray-300 opacity-30">End of Resumé</span>
                                 </div>
                             </div>
                          )}
                     </div>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default AboutPage;

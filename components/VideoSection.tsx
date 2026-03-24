import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';
import StylizedText from './StylizedText';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoSectionProps {
  videoId: string;
  title: string;
  subtitle: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ videoId, title, subtitle }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const playerRef = useRef<any>(null);

    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    useEffect(() => {
        const initPlayer = () => {
            if (!window.YT || !window.YT.Player) return;
            if (playerRef.current) return; // Prevent duplicate initialization
            
            playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    enablejsapi: 1
                },
                events: {
                    onReady: () => {
                        setIsPlayerReady(true);
                    }
                }
            });
        };

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            } else {
                document.head.appendChild(tag);
            }
            
            const prevCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prevCallback) prevCallback();
                initPlayer();
            };
        } else if (window.YT && window.YT.Player) {
            initPlayer();
        } else {
            const prevCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (prevCallback) prevCallback();
                initPlayer();
            };
        }

        return () => {
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [videoId]);

    const handlePlayClick = () => {
        setIsPlaying(true);
        if (isPlayerReady && playerRef.current && typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
        }
    };

    const handleCloseClick = () => {
        setIsPlaying(false);
        if (isPlayerReady && playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
        }
    };

    const handleOverlayClick = () => {
        if (!isPlayerReady || !playerRef.current || typeof playerRef.current.getPlayerState !== 'function') return;
        
        const state = playerRef.current.getPlayerState();
        // 1 = playing, 3 = buffering
        if (state === 1 || state === 3) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

  return (
    <section 
        onTouchStart={() => isTouchDevice && setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
        className="group relative h-auto lg:h-[100dvh] w-full lg:w-[80vw] min-w-full lg:min-w-[80vw] flex-shrink-0 bg-black text-white flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-gray-900"
    >
        
        {/* YouTube Player (Always rendered and opaque, layered behind cover) */}
        <div className={`absolute inset-0 z-10 bg-black transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="w-full h-full flex items-center justify-center bg-black relative">
                <div className="relative w-full max-w-6xl max-h-[80vh] aspect-video">
                    <div id={`youtube-player-${videoId}`} className="w-full h-full"></div>
                    {/* Transparent overlays to capture wheel events for horizontal scrolling and clicks for play/pause.
                        Leaves the bottom 60px exposed for native YouTube controls, and a 100x80px hole in the middle for the native play button. */}
                    <div className={`hidden md:block absolute top-0 left-0 right-0 h-[calc(50%-40px)] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                    <div className={`hidden md:block absolute top-[calc(50%+40px)] left-0 right-0 bottom-[60px] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                    <div className={`hidden md:block absolute top-[calc(50%-40px)] left-0 w-[calc(50%-50px)] h-[80px] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                    <div className={`hidden md:block absolute top-[calc(50%-40px)] right-0 w-[calc(50%-50px)] h-[80px] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                </div>
                <button 
                    onClick={handleCloseClick}
                    className={`absolute top-4 right-2 lg:top-8 lg:right-8 flex items-center gap-2 text-white uppercase tracking-widest text-xs bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 z-50 cursor-pointer shadow-lg ${isPlaying ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-4'}`}
                >
                    <X size={16} />
                    Close
                </button>
            </div>
        </div>

        {/* Cover Image (z-20, fades out and disables pointer events when playing) */}
        <div 
            className={`relative lg:absolute lg:inset-0 z-20 flex flex-col items-center justify-center bg-black transition-opacity duration-500 py-24 lg:py-0 w-full ${!isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} ${isTouchDevice ? 'cursor-pointer' : ''}`}
            onClick={isTouchDevice ? handlePlayClick : undefined}
        >
            <div className="absolute inset-0 z-0 opacity-60 transition-opacity duration-700 group-hover:opacity-90">
                 <img 
                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} 
                    alt={`${title} Video cover`} 
                    className={`w-full h-full object-cover transition-all duration-700 ${isTouchDevice && isPressed ? 'scale-110' : 'group-hover:scale-105'} ${typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} 
                />
            </div>
            <div className="relative lg:absolute lg:inset-0 z-10 flex flex-col items-center justify-center w-full">
                <button 
                    onClick={handlePlayClick}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white flex items-center justify-center hover:scale-110 transition-transform duration-300 hover:bg-white hover:text-black mb-8"
                >
                    <Play fill="currentColor" className="ml-1" />
                </button>
                <h2 className="text-4xl md:text-6xl font-sans text-center px-4">
                    <StylizedText text={title} />
                </h2>
                <p className="mt-4 text-sm md:text-base font-sans tracking-wide opacity-80 text-center px-4">
                    {subtitle}
                </p>
            </div>
        </div>
        
    </section>
  );
};

export default VideoSection;
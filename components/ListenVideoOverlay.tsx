import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { Play, X } from 'lucide-react';
import StylizedText from './StylizedText';

interface ListenVideoOverlayProps {
  videoId: string;
  title: string;
  onClose: () => void;
}

const ListenVideoOverlay: React.FC<ListenVideoOverlayProps> = ({ videoId, title, onClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const playerRef = useRef<any>(null);

    const [overlayY, setOverlayY] = useState(0);
    const [touchStartY, setTouchStartY] = useState(0);
    const [isClosing, setIsClosing] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isTouchDevice) return;
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isTouchDevice) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY;
        if (diff > 0) {
            setOverlayY(diff);
        }
    };

    const handleTouchEnd = () => {
        if (!isTouchDevice) return;
        if (overlayY > 150) {
            setIsClosing(true);
        } else {
            setOverlayY(0);
        }
    };

    useEffect(() => {
        const initPlayer = () => {
            if (!window.YT || !window.YT.Player) return;
            if (playerRef.current) return; // Prevent duplicate initialization
            
            playerRef.current = new window.YT.Player(`youtube-overlay-player-${videoId}`, {
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

    return createPortal(
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
                if (isClosing) onClose();
            }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
        >
            <div 
                ref={overlayRef}
                className="relative w-[95vw] h-[95vh] bg-black rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center group"
                style={{ 
                    transform: `translateY(${overlayY}px)`,
                    transition: overlayY === 0 ? 'transform 0.3s ease-out' : 'none'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                
                {/* YouTube Player (Always rendered and opaque, layered behind cover) */}
                <div className={`absolute inset-0 z-10 bg-black transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="w-full h-full flex items-center justify-center bg-black relative">
                        <div className="relative w-full h-full max-w-6xl max-h-[80vh] aspect-video">
                            <div id={`youtube-overlay-player-${videoId}`} className="w-full h-full"></div>
                            {/* Transparent overlays to capture wheel events for horizontal scrolling and clicks for play/pause.
                                Leaves the bottom 60px exposed for native YouTube controls, and a 100x80px hole in the middle for the native play button. */}
                            <div className={`hidden md:block absolute top-0 left-0 right-0 h-[calc(50%-40px)] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                            <div className={`hidden md:block absolute top-[calc(50%+40px)] left-0 right-0 bottom-[60px] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                            <div className={`hidden md:block absolute top-[calc(50%-40px)] left-0 w-[calc(50%-50px)] h-[80px] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                            <div className={`hidden md:block absolute top-[calc(50%-40px)] right-0 w-[calc(50%-50px)] h-[80px] z-10 ${isPlaying ? 'cursor-pointer' : ''}`} onClick={handleOverlayClick} />
                        </div>
                    </div>
                </div>

                {/* Cover Image (z-20, fades out and disables pointer events when playing) */}
                <div 
                    className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-black transition-opacity duration-500 w-full ${!isPlaying ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} ${isTouchDevice ? 'cursor-pointer' : ''}`}
                    onClick={isTouchDevice ? handlePlayClick : undefined}
                >
                    <div className="absolute inset-0 z-0 opacity-60 transition-opacity duration-700 group-hover:opacity-90">
                         <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt={`${title} Video cover`} className={`w-full h-full object-cover transition-all duration-700 ${isTouchDevice ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                    </div>
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center w-full">
                        <button 
                            onClick={handlePlayClick}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white bg-white text-black flex items-center justify-center hover:scale-110 transition-transform duration-300 mb-8"
                        >
                            <Play fill="currentColor" className="ml-1" />
                        </button>
                        <h2 className="text-3xl md:text-5xl font-sans text-center px-4 text-white">
                            <StylizedText text={title} />
                        </h2>
                    </div>
                </div>

                <button 
                    onClick={() => setIsClosing(true)}
                    className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2 text-white uppercase tracking-widest text-xs bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 z-50 cursor-pointer shadow-lg"
                >
                    <X size={16} />
                    Close
                </button>
            </div>
        </motion.div>,
        document.body
    );
};

export default ListenVideoOverlay;

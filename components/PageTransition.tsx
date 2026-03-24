import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionProps {
  isVisible: boolean;
  targetView: 'home' | 'works' | 'upcomings' | 'about';
}

const PageTransition: React.FC<PageTransitionProps> = ({ isVisible, targetView }) => {
  const getBackgroundImage = () => {
    switch (targetView) {
      case 'works':
        return '/photos/compositions.jpg';
      case 'upcomings':
        return '/photos/upcoming.jpg';
      case 'about':
        return '/photos/about.jpg';
      default:
        return null;
    }
  };

  const bgImage = getBackgroundImage();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          transition={{ 
            duration: 0.5, 
            ease: [0.76, 0, 0.24, 1], // Cubic bezier for smooth motion
          }}
          className="fixed inset-0 z-[9999] bg-[#CFCCC0] pointer-events-none overflow-hidden"
        >
          {bgImage && (
            <motion.div 
              initial={{ scale: 1.05, opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={bgImage} 
                alt="" 
                className="w-full h-full object-cover opacity-40"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#CFCCC0]/30" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;

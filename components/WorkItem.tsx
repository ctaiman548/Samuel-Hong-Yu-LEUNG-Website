

import React from 'react';
import { Work } from '../types';
import StylizedText from './StylizedText';
import { ChevronDown } from 'lucide-react';

interface WorkItemProps {
  work: Work;
}

const WorkItem: React.FC<WorkItemProps> = ({ work }) => {
  return (
    <div className="relative h-[100dvh] w-full lg:w-[50vw] min-w-full lg:min-w-[50vw] flex-shrink-0 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100 bg-off-white overflow-hidden group">
      
      {/* Background Image (Removed) */}
      <div className="absolute inset-0 z-0 bg-white">
        <div className="absolute inset-0 bg-white/90 z-10"></div>
      </div>

      {/* Content Card */}
      <div className="relative z-20 w-full max-w-md p-8 md:p-12">
        
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-sans font-light tracking-tight text-off-black mb-6">
          {work.title}
        </h2>

        {/* Listen Link */}
        <div className="flex items-center gap-4 mb-10">
            <span className="w-8 h-[1px] bg-off-black"></span>
            <a href={work.listenUrl} className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity">
                Listen
            </a>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-off-black mb-6"></div>

        {/* Metadata Grid */}
        <div className="space-y-6 text-sm">
            <div className="flex justify-between items-baseline">
                <span className="uppercase font-medium tracking-wide text-xs">Created</span>
                <span className="font-light">{work.year}</span>
            </div>
            
            <div className="w-full h-[1px] bg-gray-200"></div>

            <div className="flex justify-between items-baseline">
                <span className="uppercase font-medium tracking-wide text-xs">Instrumentation</span>
                <span className="font-light text-right uppercase">{work.instrumentation}</span>
            </div>

            <div className="w-full h-[1px] bg-gray-200"></div>

            <div className="flex justify-between items-baseline">
                <span className="uppercase font-medium tracking-wide text-xs">Duration</span>
                <span className="font-light">{work.duration}</span>
            </div>

            <div className="w-full h-[1px] bg-gray-200"></div>

            {work.premiere && (
                <div className="flex justify-between items-start">
                    <span className="uppercase font-medium tracking-wide text-xs pt-1">Première</span>
                    <div className="text-right font-light flex flex-col">
                        <span>{work.premiere.date}</span>
                        <span>{work.premiere.location}</span>
                        <span className="text-gray-500 mt-1">{work.premiere.performer}</span>
                    </div>
                </div>
            )}
             
             {work.premiere && <div className="w-full h-[1px] bg-gray-200"></div>}
        </div>

        {/* More Accordion / Link */}
        <button className="mt-10 flex items-center gap-2 text-xs uppercase tracking-widest hover:opacity-60 transition-opacity">
            More <ChevronDown size={14} />
        </button>

      </div>
    </div>
  );
};

export default WorkItem;
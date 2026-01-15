import React from 'react';
import { Story, Region } from '../types';
import { REGION_COLORS } from '../constants';
import { Globe, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface StoryCardProps {
  story: Story;
  onClick: (story: Story) => void;
  onLike: (e: React.MouseEvent, storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick, onLike }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onClick(story)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden cursor-pointer flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-slate-200">
        <motion.img 
          src={story.imageUrl} 
          alt={story.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide flex items-center gap-1 shadow-sm ${REGION_COLORS[story.region] || REGION_COLORS[Region.GLOBAL]}`}>
            <Globe className="w-3 h-3" />
            {story.region}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
           <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
             {story.sourceName}
           </span>
           <span className="text-slate-300">•</span>
           <span className="text-xs text-slate-400">
             {new Date(story.publishedAt).toLocaleDateString()}
           </span>
        </div>

        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {story.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {story.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {story.topics.slice(0, 2).map(topic => (
            <span key={topic} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
              #{topic}
            </span>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <button 
            onClick={(e) => onLike(e, story.id)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition-colors text-sm group/like"
          >
            <motion.div whileTap={{ scale: 1.2 }}>
              <Heart className={`w-4 h-4 ${story.likes > 0 ? 'fill-pink-50 text-pink-500' : ''} group-hover/like:fill-pink-100`} />
            </motion.div>
            <span>{story.likes}</span>
          </button>

          <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Read simplified
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

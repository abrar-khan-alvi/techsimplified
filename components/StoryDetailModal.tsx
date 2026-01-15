import React, { useState } from 'react';
import { Story, Language } from '../types';
import { X, ExternalLink, Globe, Heart, Loader2 } from 'lucide-react';
import { translateStorySummary } from '../services/geminiService';
import { motion } from 'framer-motion';

interface StoryDetailModalProps {
  story: Story;
  onClose: () => void;
  onUpdateStory: (updatedStory: Story) => void;
  onLike: (id: string) => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({ story, onClose, onUpdateStory, onLike }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.ENGLISH);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (currentLanguage === Language.ENGLISH) return;

    // Check cache first
    if (story.translations && story.translations[currentLanguage]) {
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const translatedText = await translateStorySummary(story.summary, currentLanguage);

      // Update local story object to cache the translation
      const updatedStory = {
        ...story,
        translations: {
          ...story.translations,
          [currentLanguage]: translatedText
        }
      };

      onUpdateStory(updatedStory);
    } catch (err) {
      setError("Oops! Couldn't translate right now.");
    } finally {
      setIsTranslating(false);
    }
  };

  const displayedSummary =
    currentLanguage === Language.ENGLISH
      ? story.summary
      : story.translations[currentLanguage] || story.summary;

  const isTranslationAvailable = currentLanguage === Language.ENGLISH || !!story.translations[currentLanguage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-0">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
      >

        {/* Header Image */}
        <div className="relative h-64 sm:h-80 flex-shrink-0">
          <img
            src={story.imageUrl}
            alt={story.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
            <div className="flex gap-2 mb-2">
              {story.topics.map(t => (
                <span key={t} className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white text-xs rounded-md border border-white/10">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {story.title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8 bg-white flex-grow">

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{story.sourceName}</p>
                <p className="text-xs text-slate-500">{story.region}</p>
              </div>
            </div>

            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium px-4 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Read Original
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Translation Controls */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Translate Summary
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.values(Language).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrentLanguage(lang);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentLanguage === lang
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Summary Text Area */}
          <div className="relative min-h-[150px]">
            {isTranslating ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                <p className="text-sm text-slate-500 font-medium">Translating for you...</p>
              </div>
            ) : null}

            {!isTranslationAvailable && !isTranslating ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-slate-600 mb-4">Click below to see this in {currentLanguage}.</p>
                <button
                  onClick={handleTranslate}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Translate Now
                </button>
              </div>
            ) : (
              <div className="prose prose-lg prose-indigo max-w-none">
                <p className="text-slate-700 leading-relaxed text-lg">
                  {displayedSummary}
                </p>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm mt-4 text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
              </p>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onLike(story.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
            >
              <Heart className={`w-5 h-5 ${story.likes > 0 ? 'fill-current' : ''}`} />
              <span className="font-semibold">{story.likes} Likes</span>
            </button>
            <p className="text-xs text-slate-400 italic">
              Summary generated by AI. Check source for full details.
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

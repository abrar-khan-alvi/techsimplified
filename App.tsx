import React, { useState, useMemo } from 'react';
import { Story, StoryStatus, Region } from './types';
import { INITIAL_STORIES, APP_NAME } from './constants';
import { StoryCard } from './components/StoryCard';
import { StoryDetailModal } from './components/StoryDetailModal';
import { AdminPanel } from './components/AdminPanel';
import { Search, Filter, Cpu, Lock } from 'lucide-react';

const App: React.FC = () => {
  // Global State
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<Region | 'All'>('All');

  // Derived State (Filtered Feed)
  const visibleStories = useMemo(() => {
    return stories.filter(story => {
      // 1. Must be approved
      if (story.status !== StoryStatus.APPROVED) return false;
      
      // 2. Search match
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            story.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 3. Region match
      const matchesRegion = regionFilter === 'All' || story.region === regionFilter;

      return matchesSearch && matchesRegion;
    });
  }, [stories, searchQuery, regionFilter]);

  // Handlers
  const handleLike = (e: React.MouseEvent | undefined, id: string) => {
    e?.stopPropagation();
    setStories(prev => prev.map(s => 
      s.id === id ? { ...s, likes: s.likes + 1 } : s
    ));
    
    // Update selected story if open
    if (selectedStory && selectedStory.id === id) {
      setSelectedStory(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    }
  };

  const handleUpdateStory = (updatedStory: Story) => {
    setStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
    setSelectedStory(updatedStory);
  };

  const handleAdminStatusUpdate = (id: string, status: StoryStatus) => {
    setStories(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleAdminAddStories = (newStories: Story[]) => {
    setStories(prev => [...newStories, ...prev]);
  };

  if (isAdminOpen) {
    return (
      <AdminPanel 
        stories={stories}
        onUpdateStatus={handleAdminStatusUpdate}
        onAddStories={handleAdminAddStories}
        onClose={() => setIsAdminOpen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen pb-20">
      
      {/* Top Banner / Disclaimer */}
      <div className="bg-indigo-900 text-indigo-100 px-4 py-2 text-center text-xs font-medium tracking-wide">
        Summaries are AI-generated for clarity. Always check original sources.
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{APP_NAME}</h1>
              <p className="text-xs text-slate-500 font-medium">Tech News for Everyone</p>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>
            
            <div className="relative group">
              <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              {/* Dropdown for Region (Simple implementation) */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1 hidden group-hover:block">
                 <button 
                    onClick={() => setRegionFilter('All')} 
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg ${regionFilter === 'All' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                 >
                   All Regions
                 </button>
                 {Object.values(Region).map(r => (
                   <button 
                      key={r}
                      onClick={() => setRegionFilter(r)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg ${regionFilter === r ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
                   >
                     {r}
                   </button>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Feed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Latest Stories</h2>
          <p className="text-slate-500">Global technology news, simplified.</p>
        </div>

        {visibleStories.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No stories found</h3>
            <p className="text-slate-500">Try adjusting your search or filters.</p>
            <button 
              onClick={() => { setSearchQuery(''); setRegionFilter('All'); }}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                onClick={setSelectedStory}
                onLike={(e) => handleLike(e, story.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">© 2024 TechSimplified. Built for clarity.</p>
          <div className="flex items-center gap-6">
            <button className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">About</button>
            <button className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">Privacy</button>
            <button 
              onClick={() => setIsAdminOpen(true)}
              className="text-sm text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              Admin
            </button>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedStory && (
        <StoryDetailModal 
          story={selectedStory} 
          onClose={() => setSelectedStory(null)} 
          onUpdateStory={handleUpdateStory}
          onLike={(id) => handleLike(undefined, id)}
        />
      )}

    </div>
  );
};

export default App;

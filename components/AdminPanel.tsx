import React, { useState } from 'react';
import { Story, StoryStatus } from '../types';
import { fetchNewStoriesBatch } from '../services/geminiService';
import { Check, X, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

interface AdminPanelProps {
  stories: Story[];
  onUpdateStatus: (id: string, status: StoryStatus) => void;
  onAddStories: (newStories: Story[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ stories, onUpdateStatus, onAddStories, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingStories = stories.filter(s => s.status === StoryStatus.PENDING);

  const handleFetchBatch = async () => {
    setLoading(true);
    setError(null);
    try {
      const newBatch = await fetchNewStoriesBatch();
      onAddStories(newBatch);
    } catch (err) {
      setError("Failed to fetch new stories. Please check API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500">Review & Approve Aggregated Stories</p>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800 font-medium">
          Exit Admin
        </button>
      </header>

      <main className="flex-grow p-6 overflow-y-auto max-w-5xl mx-auto w-full">
        
        {/* Actions */}
        <div className="mb-8 flex items-center justify-between bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
          <div>
             <h2 className="text-lg font-bold mb-1">Batch Aggregation</h2>
             <p className="text-indigo-200 text-sm">Trigger the AI to find and summarize new stories.</p>
          </div>
          <button 
            onClick={handleFetchBatch}
            disabled={loading}
            className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            {loading ? "Aggregating..." : "Run Daily Batch"}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Pending List */}
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          Pending Review 
          <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
            {pendingStories.length}
          </span>
        </h3>

        {pendingStories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">No pending stories. Run a batch to find new content.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingStories.map(story => (
              <div key={story.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                  <img src={story.imageUrl} alt="" className="w-full h-32 object-cover rounded-lg bg-slate-100" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-bold text-lg text-slate-900">{story.title}</h4>
                     <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{story.region}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{story.summary}</p>
                  <p className="text-xs text-slate-400">Source: {story.sourceName}</p>
                </div>
                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  <button 
                    onClick={() => onUpdateStatus(story.id, StoryStatus.APPROVED)}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button 
                    onClick={() => onUpdateStatus(story.id, StoryStatus.REJECTED)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-700 hover:bg-red-100 py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

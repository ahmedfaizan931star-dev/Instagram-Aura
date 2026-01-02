import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Profile from './components/Profile';
import CreatePost from './components/CreatePost';
import Explore from './components/Explore';
import { View } from './types';
import { Icons } from './components/Icons';
import { db } from './services/mockDb';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Intercept CREATE view to show modal instead of changing page
  const handleSetView = (newView: View) => {
    if (newView === View.CREATE) {
      setShowCreateModal(true);
    } else {
      setView(newView);
      window.scrollTo(0, 0);
    }
  };

  const handlePostSuccess = () => {
    setShowCreateModal(false);
    setView(View.HOME);
    // Force a reload of feed potentially, but React state update in db will handle it on re-render if we were using context.
    // Since we just switch view, fetching happens in Feed useEffect.
    // If we are already on HOME, we might need to trigger a refresh key.
    if (view === View.HOME) {
        window.location.reload(); // Simple brute force for this demo to refresh feed state
    }
  };

  return (
    <div className="min-h-screen bg-black text-ig-text font-sans">
      {/* Sidebar (Desktop) */}
      <Sidebar currentView={view} setView={handleSetView} />

      {/* Main Content Area */}
      <main className="md:ml-[72px] lg:ml-[245px] min-h-screen w-full md:w-[calc(100%-72px)] lg:w-[calc(100%-245px)]">
        {view === View.HOME && <Feed />}
        {view === View.SEARCH && <Explore />}
        {view === View.REELS && (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <Icons.Reels className="w-20 h-20 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Reels</h2>
                    <p className="text-ig-muted">Video content simulation coming soon.</p>
                </div>
            </div>
        )}
        {view === View.PROFILE && <Profile />}
      </main>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-black border-t border-ig-border md:hidden flex justify-around items-center z-50 px-4">
        <button onClick={() => handleSetView(View.HOME)} className="p-2">
            <Icons.Home className={`w-6 h-6 ${view === View.HOME ? 'stroke-[3px]' : ''}`} />
        </button>
        <button onClick={() => handleSetView(View.SEARCH)} className="p-2">
            <Icons.Search className={`w-6 h-6 ${view === View.SEARCH ? 'stroke-[3px]' : ''}`} />
        </button>
        <button onClick={() => setShowCreateModal(true)} className="p-2">
            <Icons.Create className="w-6 h-6" />
        </button>
        <button onClick={() => handleSetView(View.REELS)} className="p-2">
            <Icons.Reels className={`w-6 h-6 ${view === View.REELS ? 'stroke-[3px]' : ''}`} />
        </button>
        <button onClick={() => handleSetView(View.PROFILE)} className="p-2">
            <img src={db.currentUser.avatarUrl} alt="Profile" className={`w-6 h-6 rounded-full border ${view === View.PROFILE ? 'border-white' : 'border-transparent'}`} />
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePost 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={handlePostSuccess} 
        />
      )}
    </div>
  );
};

export default App;
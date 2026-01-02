import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { Story } from '../types';

const Stories: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    const loadStories = async () => {
      const data = await db.getStories();
      setStories(data);
    };
    loadStories();
  }, []);

  return (
    <div className="bg-ig-card/40 backdrop-blur-md sm:border sm:border-white/5 sm:rounded-xl mb-6 py-5 overflow-x-auto no-scrollbar w-full max-w-[470px] mx-auto shadow-lg">
      <div className="flex space-x-5 px-4">
        {/* Current User Story Add */}
        <div className="flex flex-col items-center space-y-2 min-w-[68px] cursor-pointer group">
          <div className="w-[68px] h-[68px] rounded-full p-[3px] relative">
            <img src={db.currentUser.avatarUrl} alt="Your Story" className="w-full h-full rounded-full border-2 border-ig-bg object-cover group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 right-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-ig-bg">
              <span className="text-white text-sm font-bold shadow-sm">+</span>
            </div>
          </div>
          <span className="text-xs text-ig-muted font-medium truncate w-16 text-center group-hover:text-white transition-colors">You</span>
        </div>

        {/* Other Users */}
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col items-center space-y-2 min-w-[68px] cursor-pointer group">
            {/* Gradient Ring */}
            <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] group-hover:scale-105 transition-transform duration-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <div className="bg-ig-bg p-[3px] rounded-full w-full h-full">
                <img src={story.user.avatarUrl} alt={story.user.username} className="w-full h-full rounded-full object-cover" />
              </div>
            </div>
            <span className="text-xs text-ig-text font-medium truncate w-16 text-center">{story.user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
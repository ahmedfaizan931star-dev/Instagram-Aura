import React from 'react';
import { View } from '../types';
import { Icons } from './Icons';
import { db } from '../services/mockDb';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.HOME, icon: Icons.Home, label: 'Home' },
    { id: View.SEARCH, icon: Icons.Search, label: 'Discover' },
    { id: View.REELS, icon: Icons.Reels, label: 'Moments' },
    { id: View.CREATE, icon: Icons.Create, label: 'Create' },
    { id: View.PROFILE, icon: null, label: 'Profile', isProfile: true },
  ];

  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-[72px] lg:w-[245px] border-r border-white/5 bg-black/40 backdrop-blur-xl z-50 px-3 pb-5 pt-8 shadow-2xl">
      {/* Logo */}
      <div className="mb-10 px-3 lg:px-4 cursor-pointer group" onClick={() => setView(View.HOME)}>
        <div className="hidden lg:flex items-center space-x-2">
            <Icons.Sparkles className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform duration-500" />
            <h1 className="text-3xl font-bold font-serif italic tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Aura
            </h1>
        </div>
        <div className="block lg:hidden text-center">
            <Icons.Sparkles className="w-8 h-8 mx-auto text-indigo-400" />
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 space-y-3">
        {navItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`
                flex items-center lg:space-x-4 p-3 rounded-xl cursor-pointer transition-all duration-300 group
                ${currentView === item.id 
                    ? 'bg-white/10 text-white font-medium shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                    : 'text-ig-muted hover:bg-white/5 hover:text-white hover:translate-x-1'}
            `}
          >
            <div className="relative group-hover:scale-110 transition-transform duration-300">
                {item.isProfile ? (
                     <img 
                        src={db.currentUser.avatarUrl} 
                        alt="Profile" 
                        className={`w-6 h-6 rounded-full border-2 ${currentView === View.PROFILE ? 'border-purple-500' : 'border-transparent'}`} 
                     />
                ) : (
                    item.icon && <item.icon className={`w-6 h-6 ${currentView === item.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                )}
            </div>
            <span className="hidden lg:block text-base tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>

      {/* More Options */}
      <div className="mt-auto px-3">
        <div className="flex items-center lg:space-x-4 p-3 rounded-xl cursor-pointer hover:bg-white/5 text-ig-muted hover:text-white transition-colors">
          <Icons.More className="w-6 h-6" />
          <span className="hidden lg:block text-base">More</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { Post, User } from '../types';
import { Icons } from './Icons';

const Profile: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const user = db.currentUser;

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await db.getUserPosts(user.id);
      setPosts(data);
    };
    fetchPosts();
  }, [user.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-4 md:pt-8 pb-20">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-24 mb-12">
        {/* Avatar */}
        <div className="flex-shrink-0 mb-6 md:mb-0">
          <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
            <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full border-4 border-black object-cover" />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col items-center md:items-start flex-1 space-y-4">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-4 md:space-y-0">
            <h2 className="text-xl md:text-2xl font-light">{user.username}</h2>
            <div className="flex space-x-2">
              <button className="bg-white text-black px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-gray-200">Edit profile</button>
              <button className="bg-ig-secondary px-4 py-1.5 rounded-lg font-semibold text-sm hover:bg-zinc-700">View archive</button>
            </div>
            <Icons.More className="w-6 h-6 cursor-pointer" />
          </div>

          <div className="flex space-x-8 md:space-x-12 text-sm md:text-base">
            <div><span className="font-bold">{posts.length}</span> posts</div>
            <div><span className="font-bold">1.2M</span> followers</div>
            <div><span className="font-bold">450</span> following</div>
          </div>

          <div className="text-center md:text-left text-sm md:text-base">
            <div className="font-bold">{user.fullName}</div>
            <div className="text-ig-muted">Digital Creator</div>
            <div>Building the future with AI 🤖</div>
            <div className="text-blue-200">github.com/senior-dev</div>
          </div>
        </div>
      </div>

      {/* Highlights (Mock) */}
      <div className="flex space-x-8 mb-12 overflow-x-auto no-scrollbar pb-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-2 cursor-pointer">
            <div className="w-16 h-16 rounded-full border border-ig-border bg-ig-secondary flex items-center justify-center">
              <Icons.Heart className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">Highlights</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="border-t border-ig-border flex justify-center space-x-12 mb-4">
        <div className="flex items-center space-x-2 py-4 border-t border-white -mt-[1px] cursor-pointer">
          <Icons.Create className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest">POSTS</span>
        </div>
        <div className="flex items-center space-x-2 py-4 text-ig-muted cursor-pointer hover:text-ig-text transition">
          <Icons.Save className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest">SAVED</span>
        </div>
        <div className="flex items-center space-x-2 py-4 text-ig-muted cursor-pointer hover:text-ig-text transition">
          <Icons.Reels className="w-4 h-4" />
          <span className="text-xs font-bold tracking-widest">TAGGED</span>
        </div>
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-ig-muted">
              <Icons.Create className="w-16 h-16 mb-4 stroke-1" />
              <h3 className="text-2xl font-bold text-ig-text">Share Photos</h3>
              <p>When you share photos, they will appear on your profile.</p>
          </div>
      ) : (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {posts.map((post) => (
              <div key={post.id} className="relative aspect-square group cursor-pointer bg-ig-secondary overflow-hidden">
                {post.mediaType === 'video' ? (
                  <video src={post.mediaUrl} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={post.mediaUrl} alt="Post" className="w-full h-full object-cover" />
                )}
                
                {/* Video Indicator */}
                {post.mediaType === 'video' && (
                  <div className="absolute top-2 right-2 text-white drop-shadow-md">
                    <Icons.Reels className="w-5 h-5" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white font-bold">
                  <div className="flex items-center space-x-1">
                    <Icons.Heart className="w-6 h-6 fill-white" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icons.Comment className="w-6 h-6 fill-white" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default Profile;

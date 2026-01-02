import React, { useEffect, useState } from 'react';
import { db } from '../services/mockDb';
import { Post as PostType } from '../types';
import Post from './Post';
import Stories from './Stories';
import { Icons } from './Icons';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      const data = await db.getFeed();
      setPosts(data);
      setLoading(false);
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Icons.Loader className="w-10 h-10 text-ig-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[630px] mx-auto pt-4 md:pt-8 pb-20">
      <Stories />
      <div className="flex flex-col items-center w-full">
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
        {posts.length === 0 && (
            <div className="text-center py-20 text-ig-muted">
                <p>No posts yet. Start following people!</p>
            </div>
        )}
        
        {/* End of Feed */}
        <div className="flex flex-col items-center justify-center py-10 space-y-4 text-ig-muted">
            <div className="w-24 h-24 rounded-full border-2 border-ig-separator flex items-center justify-center">
                <Icons.Sparkles className="w-12 h-12 text-ig-primary" />
            </div>
            <div className="text-xl text-ig-text">You're all caught up</div>
            <div className="text-sm">You've seen all new posts from the past 3 days.</div>
            <button className="text-blue-500 font-semibold text-sm">View older posts</button>
        </div>
      </div>
    </div>
  );
};

export default Feed;
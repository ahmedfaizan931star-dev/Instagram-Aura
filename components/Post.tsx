
import React, { useState, useRef } from 'react';
import { Post as PostType, Comment } from '../types';
import { Icons } from './Icons';
import { db } from '../services/mockDb';

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentText, setCommentText] = useState('');
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const lastClickRef = useRef<number>(0);

  const handleLike = async () => {
    // Optimistic update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1);
    setIsLikeAnimating(true);
    setTimeout(() => setIsLikeAnimating(false), 1000);

    try {
      await db.toggleLike(post.id);
    } catch (error) {
      // Revert if error
      setIsLiked(!newLikedState);
      setLikeCount(prev => !newLikedState ? prev + 1 : prev - 1);
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastClickRef.current < 300) {
      if (!isLiked) handleLike();
      setIsLikeAnimating(true);
      setTimeout(() => setIsLikeAnimating(false), 1000);
    }
    lastClickRef.current = now;
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const newComment = await db.addComment(post.id, commentText);
      setComments([...comments, newComment]);
      setCommentText('');
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  const formatCaption = (text: string) => {
    if (!text) return '';
    
    // 1. Escape HTML
    let formatted = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    // 2. Markdown Parsing
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<b class="font-bold text-white">$1</b>');
    formatted = formatted.replace(/\*(.*?)\*/g, '<i class="italic text-gray-200">$1</i>');
    formatted = formatted.replace(/~~(.*?)~~/g, '<s class="line-through opacity-60">$1</s>');
    
    // 3. Hashtags
    formatted = formatted.replace(/#(\w+)/g, '<span class="text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors">#$1</span>');

    // 4. Mentions
    formatted = formatted.replace(/@(\w+)/g, '<span class="text-purple-400 font-semibold cursor-pointer hover:text-purple-300 transition-colors">@$1</span>');

    // 5. Newlines
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
  };

  return (
    <div className="bg-ig-card/60 backdrop-blur-sm border-b border-white/5 sm:border sm:border-white/5 sm:rounded-xl mb-6 max-w-[470px] w-full mx-auto shadow-xl transition-all hover:shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3.5">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 p-[2px]">
            <img src={post.user.avatarUrl} alt={post.user.username} className="w-full h-full rounded-full border-2 border-ig-card object-cover" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="font-semibold text-sm text-white tracking-wide">{post.user.username}</span>
              {post.user.isVerified && (
                 <span className="ml-1 text-indigo-400">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                 </span>
              )}
              <span className="mx-1.5 text-ig-muted/50 text-xs">•</span>
              <span className="text-xs text-ig-muted">2h</span>
            </div>
            {post.location && <div className="text-xs text-ig-muted">{post.location}</div>}
          </div>
        </div>
        <button className="text-ig-text hover:text-white transition-colors">
          <Icons.More className="w-5 h-5" />
        </button>
      </div>

      {/* Media */}
      <div className="relative w-full aspect-square bg-ig-secondary overflow-hidden" onClick={handleDoubleTap}>
        {post.mediaType === 'video' ? (
          <video 
            src={post.mediaUrl} 
            className="w-full h-full object-cover" 
            controls={false} 
            autoPlay 
            muted 
            loop 
            playsInline
          />
        ) : (
          <img src={post.mediaUrl} alt="Post content" className="w-full h-full object-cover" />
        )}
        
        {isLikeAnimating && (
           <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300 pointer-events-none">
              <Icons.Heart className="w-24 h-24 text-white fill-white opacity-90 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]" />
           </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button onClick={handleLike} className="hover:scale-110 transition-transform active:scale-95">
              <Icons.Heart className={`w-7 h-7 transition-colors duration-300 ${isLiked ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-white hover:text-gray-300'}`} />
            </button>
            <button className="hover:opacity-70 transition-opacity hover:-translate-y-0.5 transform duration-200">
              <Icons.Comment className="w-7 h-7 text-white -scale-x-100" />
            </button>
            <button className="hover:opacity-70 transition-opacity hover:-translate-y-0.5 transform duration-200">
              <Icons.Share className="w-7 h-7 text-white" />
            </button>
          </div>
          <button className="hover:opacity-70 transition-opacity">
            <Icons.Save className="w-7 h-7 text-white" />
          </button>
        </div>

        {/* Likes Count */}
        <div className="font-semibold text-sm mb-2 text-white">{likeCount.toLocaleString()} likes</div>

        {/* Caption */}
        <div className="text-sm mb-2 leading-relaxed break-words text-gray-300">
          <span className="font-semibold mr-2 text-white">{post.user.username}</span>
          <span dangerouslySetInnerHTML={{ __html: formatCaption(post.caption) }} />
        </div>

        {/* Comments Link */}
        {comments.length > 2 && (
          <button className="text-ig-muted text-sm mb-2 hover:text-gray-300 transition-colors">View all {comments.length} comments</button>
        )}

        {/* Recent Comments */}
        <div className="space-y-1 mb-3">
          {comments.slice(-2).map((comment) => (
            <div key={comment.id} className="text-sm text-gray-400">
              <span className="font-semibold mr-2 text-gray-200">{comment.username}</span>
              <span>{comment.text}</span>
            </div>
          ))}
        </div>

        {/* Add Comment Input */}
        <form onSubmit={handleComment} className="flex items-center mt-3 pt-3 border-t border-white/5">
          <button type="button" className="pr-3 text-ig-muted hover:text-yellow-400 transition-colors">
            <Icons.Emoji className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder-ig-muted text-white"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          {commentText && (
            <button type="submit" className="text-indigo-400 text-sm font-semibold ml-2 hover:text-indigo-300">Post</button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Post;

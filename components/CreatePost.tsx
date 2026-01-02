
import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { db } from '../services/mockDb';
import { generateAICaption, generateAIImage } from '../services/geminiService';
import { View, MediaType } from '../types';

interface CreatePostProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose, onSuccess }) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  
  // Image Generation States
  const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('upload');
  const [prompt, setPrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        setMediaType(isVideo ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingImage(true);
    try {
      const generatedImage = await generateAIImage(prompt);
      if (generatedImage) {
        setMediaUrl(generatedImage);
        setMediaType('image');
      } else {
        alert("Failed to generate image. Please try again.");
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!mediaUrl || mediaType !== 'image') return;
    setIsGeneratingCaption(true);
    try {
      const aiCaption = await generateAICaption(mediaUrl);
      setCaption(aiCaption);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleShare = async () => {
    if (!mediaUrl) return;
    setIsPosting(true);
    try {
      await db.createPost(mediaUrl, caption, mediaType, location);
      onSuccess();
    } catch (e) {
      console.error(e);
      setIsPosting(false);
    }
  };

  const insertFormat = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = caption;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selected + suffix + after;
    setCaption(newText);
    
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
        <Icons.Close className="w-8 h-8" />
      </button>

      <div className="bg-ig-card w-full max-w-4xl h-[80vh] rounded-xl flex flex-col md:flex-row overflow-hidden border border-ig-border animate-in fade-in zoom-in duration-200 shadow-2xl">
        
        {/* Left Side: Media Preview / Upload / Generate */}
        <div className="flex-1 bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-ig-border">
          {mediaUrl ? (
            <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
                {mediaType === 'video' ? (
                   <video 
                    src={mediaUrl} 
                    className="max-w-full max-h-full object-contain" 
                    controls 
                    autoPlay 
                    muted 
                    loop 
                   />
                ) : (
                  <img src={mediaUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                )}
                 <button 
                   onClick={() => {
                     setMediaUrl(null);
                     setPrompt('');
                   }}
                   className="absolute top-4 left-4 bg-black/60 p-2 rounded-full hover:bg-black/80 text-white transition-colors backdrop-blur-sm z-20"
                 >
                    <Icons.Close className="w-5 h-5" />
                 </button>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
                {/* Tabs */}
                <div className="flex justify-center pt-8 pb-4 space-x-6">
                    <button 
                        onClick={() => setActiveTab('upload')}
                        className={`pb-2 text-sm font-semibold transition-colors ${activeTab === 'upload' ? 'text-white border-b-2 border-white' : 'text-ig-muted hover:text-white'}`}
                    >
                        Upload
                    </button>
                    <button 
                        onClick={() => setActiveTab('generate')}
                        className={`pb-2 text-sm font-semibold transition-colors flex items-center space-x-1 ${activeTab === 'generate' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-ig-muted hover:text-indigo-300'}`}
                    >
                        <Icons.Sparkles className="w-4 h-4" />
                        <span>Generate with AI</span>
                    </button>
                </div>

                <div className="flex-1 flex items-center justify-center p-6">
                    {activeTab === 'upload' ? (
                        <div className="flex flex-col items-center animate-in fade-in duration-300">
                          <div className="flex space-x-4 mb-4 opacity-50">
                            <Icons.Image className="w-16 h-16 text-ig-text" />
                            <Icons.Reels className="w-16 h-16 text-ig-text" />
                          </div>
                          <p className="text-xl font-light mb-6 text-center">Drag photos and videos here</p>
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-600 transition"
                          >
                            Select from computer
                          </button>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*,video/*" 
                            className="hidden" 
                          />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full max-w-md animate-in fade-in duration-300">
                             <div className="w-full relative mb-6">
                                <textarea
                                    className="w-full bg-ig-secondary/50 rounded-xl border border-ig-border p-4 text-white placeholder-ig-muted focus:outline-none focus:border-indigo-500 transition-colors resize-none h-32"
                                    placeholder="Describe your imagination... (e.g., 'A futuristic city in a glass sphere floating in space')"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <Icons.Sparkles className="absolute right-3 bottom-3 w-5 h-5 text-indigo-400 opacity-50" />
                             </div>
                             <button
                                onClick={handleGenerateImage}
                                disabled={!prompt.trim() || isGeneratingImage}
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
                             >
                                {isGeneratingImage ? (
                                    <>
                                        <Icons.Loader className="w-5 h-5 animate-spin" />
                                        <span>Dreaming...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icons.Sparkles className="w-5 h-5" />
                                        <span>Generate Image</span>
                                    </>
                                )}
                             </button>
                             <p className="mt-4 text-xs text-ig-muted text-center max-w-xs">
                                AI generation currently supports images. Upload your own videos to share moments.
                             </p>
                        </div>
                    )}
                </div>
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        {mediaUrl && (
          <div className="w-full md:w-[350px] flex flex-col bg-ig-card border-l border-ig-border">
            {/* Header */}
            <div className="border-b border-ig-separator p-3 flex justify-between items-center bg-ig-card z-10">
                <span className="font-semibold text-base">New {mediaType} post</span>
                <button 
                  onClick={handleShare}
                  disabled={isPosting}
                  className="text-blue-500 font-semibold hover:text-blue-400 disabled:opacity-50 text-sm"
                >
                  {isPosting ? 'Sharing...' : 'Share'}
                </button>
            </div>

            {/* User Info */}
            <div className="p-4 flex items-center space-x-3">
              <img src={db.currentUser.avatarUrl} alt="me" className="w-8 h-8 rounded-full ring-2 ring-ig-card" />
              <span className="font-semibold text-sm">{db.currentUser.username}</span>
            </div>

            {/* Caption Area */}
            <div className="px-4 flex-1 flex flex-col overflow-y-auto">
              {/* Formatting Toolbar */}
              <div className="flex items-center space-x-1 mb-2 border-b border-ig-separator pb-2 sticky top-0 bg-ig-card z-10 pt-1">
                <button 
                  onClick={() => insertFormat('**', '**')} 
                  className="p-1.5 hover:bg-ig-separator rounded text-ig-text hover:text-white transition-colors" 
                  title="Bold"
                >
                  <Icons.Bold className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => insertFormat('*', '*')} 
                  className="p-1.5 hover:bg-ig-separator rounded text-ig-text hover:text-white transition-colors" 
                  title="Italic"
                >
                  <Icons.Italic className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => insertFormat('~~', '~~')} 
                  className="p-1.5 hover:bg-ig-separator rounded text-ig-text hover:text-white transition-colors" 
                  title="Strikethrough"
                >
                  <Icons.Strike className="w-4 h-4" />
                </button>
                <div className="text-[10px] text-ig-muted ml-auto uppercase tracking-wider font-medium">Markdown</div>
              </div>

              <textarea 
                ref={textareaRef}
                className="w-full h-32 bg-transparent resize-none focus:outline-none text-sm leading-relaxed" 
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              ></textarea>
              
              {/* AI Button - Only for images */}
              {mediaType === 'image' && (
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={handleGenerateCaption}
                    disabled={isGeneratingCaption}
                    className="flex items-center space-x-2 text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-purple-500/20"
                  >
                      {isGeneratingCaption ? <Icons.Loader className="w-3 h-3 animate-spin" /> : <Icons.AI className="w-3 h-3" />}
                      <span>{isGeneratingCaption ? 'Magic working...' : 'AI Caption'}</span>
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center border-t border-ig-separator py-3 cursor-pointer hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                <span className="text-ig-muted text-sm">Add Location</span>
                <Icons.Location className="w-4 h-4 text-ig-muted" />
              </div>
              
              <div className="flex justify-between items-center border-t border-ig-separator py-3 cursor-pointer hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                <span className="text-ig-text text-sm">Accessibility</span>
                <Icons.More className="w-4 h-4 text-ig-muted" />
              </div>

              <div className="flex justify-between items-center border-t border-ig-separator py-3 cursor-pointer hover:bg-white/5 px-2 -mx-2 rounded transition-colors">
                <span className="text-ig-text text-sm">Advanced settings</span>
                <Icons.More className="w-4 h-4 text-ig-muted" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;

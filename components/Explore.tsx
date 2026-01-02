import React from 'react';
import { Icons } from './Icons';

const Explore: React.FC = () => {
  // Generate random grid items
  const items = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    image: `https://picsum.photos/seed/explore${i}/400/400`,
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    isLarge: i % 10 === 2 || i % 10 === 5 // Just a pattern for varied grid
  }));

  return (
    <div className="w-full max-w-5xl mx-auto pb-20">
        <div className="p-4 md:hidden">
            <div className="relative bg-ig-secondary rounded-lg">
                <Icons.Search className="absolute left-3 top-2.5 w-4 h-4 text-ig-muted" />
                <input type="text" placeholder="Search" className="w-full bg-transparent p-2 pl-10 text-sm focus:outline-none" />
            </div>
        </div>

        <div className="grid grid-cols-3 gap-1 md:gap-4 p-1 md:p-4">
            {items.map((item) => (
                <div 
                    key={item.id} 
                    className={`relative group cursor-pointer bg-ig-secondary overflow-hidden aspect-square ${item.isLarge ? 'row-span-2 col-span-2' : ''}`}
                >
                    <img src={item.image} alt="Explore" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white font-bold">
                        <div className="flex items-center space-x-1">
                            <Icons.Heart className="w-6 h-6 fill-white" />
                            <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Icons.Comment className="w-6 h-6 fill-white" />
                            <span>{item.comments}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Explore;
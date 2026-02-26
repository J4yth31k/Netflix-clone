import React from 'react';
import { Play, Plus } from 'lucide-react';
const Hero = ({ content, onAddToList }) => {
  if (!content) return null;
  return (
    <div className="relative h-screen">
      <img src={content.image} alt="Hero" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute bottom-1/4 left-4 md:left-12 max-w-xl">
        <h2 className="text-5xl md:text-6xl font-bold mb-4">{content.title}</h2>
        <p className="text-lg mb-6">{content.description}</p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded hover:bg-gray-200 transition font-semibold"><Play className="w-5 h-5" fill="currentColor" /> Play</button>
          <button onClick={() => onAddToList(content)} className="flex items-center gap-2 px-8 py-3 bg-gray-700 bg-opacity-80 rounded hover:bg-opacity-60 transition font-semibold"><Plus className="w-5 h-5" /> My List</button>
        </div>
      </div>
    </div>
  );
};
export default Hero;

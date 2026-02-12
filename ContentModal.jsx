import React from 'react';
import { Play, Plus } from 'lucide-react';

const ContentModal = ({ content, onClose, isInWatchlist, onAddToList, onRemoveFromList }) => {
  if (!content) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg max-w-3xl w-full overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-96">
          <img src={content.image} alt={content.title} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-70 rounded-full flex items-center justify-center hover:bg-opacity-90"
          >
            ✕
          </button>
        </div>
        <div className="p-8">
          <h3 className="text-3xl font-bold mb-4">{content.title}</h3>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-green-500 font-semibold">{content.rating} Match</span>
            <span className="text-gray-400">{content.genre}</span>
          </div>
          <p className="text-gray-300 mb-6">{content.description}</p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition font-semibold">
              <Play className="w-5 h-5" fill="currentColor" />
              Play
            </button>
            {isInWatchlist ? (
              <button
                onClick={() => onRemoveFromList(content.id)}
                className="px-6 py-3 border-2 border-gray-500 rounded hover:border-white transition font-semibold"
              >
                Remove from List
              </button>
            ) : (
              <button
                onClick={() => onAddToList(content)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-500 rounded hover:border-white transition font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add to List
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;

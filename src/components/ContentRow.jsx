import React from 'react';
const ContentRow = ({ title, items, onSelectContent }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 px-4 md:px-12">{title}</h3>
      <div className="relative px-4 md:px-12">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {items.map(item => (
            <div key={item.id} className="flex-shrink-0 w-72 group cursor-pointer" onClick={() => onSelectContent(item)}>
              <div className="relative rounded overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-300">{item.genre} • {item.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ContentRow;

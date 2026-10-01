export default function CategoryBar({ categories = [], selectedCategoryId, onSelectCategory }) {
  const getCategoryColor = (name) => {
    if (!name) return 'bg-[#2F5233]';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('soup') || lowerName.includes('dessert')) return 'bg-[#D9A441] hover:border-[#D9A441]';
    if (lowerName.includes('salad') || lowerName.includes('video')) return 'bg-[#A63446] hover:border-[#A63446]';
    if (lowerName.includes('braised')) return 'bg-[#6B6F63] hover:border-[#6B6F63]';
    return 'bg-[#2F5233] hover:border-[#2F5233]'; // default moss
  };

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button 
          onClick={() => onSelectCategory && onSelectCategory(null)}
          className={`flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border rounded-lg text-[14px] font-medium transition-colors whitespace-nowrap cursor-pointer ${selectedCategoryId === null ? 'border-[#2F5233] text-[#2F5233]' : 'border-[#DCE3D5] text-[#2B2A25] hover:border-[#2F5233] hover:bg-[#F3F6EE]'}`}
        >
          <span className={`w-[3px] h-4 rounded-full ${selectedCategoryId === null ? 'bg-[#2F5233]' : 'bg-[#6B6F63]'}`}></span>
          <span className="">all</span>
        </button>
        {categories.map(cat => {
          const colors = getCategoryColor(cat.name).split(' ');
          const bgColorClass = colors[0];
          const hoverBorderClass = colors[1] || 'hover:border-[#2F5233]';
          const isSelected = selectedCategoryId === cat.id;
          
          return (
            <button 
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border rounded-lg text-[14px] font-medium transition-colors whitespace-nowrap cursor-pointer ${isSelected ? 'border-[#2F5233] text-[#2F5233]' : `border-[#DCE3D5] text-[#2B2A25] ${hoverBorderClass} hover:bg-[#F3F6EE]`}`}
            >
              <span className={`w-[3px] h-4 rounded-full ${isSelected ? 'bg-[#2F5233]' : bgColorClass}`}></span>
              <span className="">{cat.name.toLowerCase()}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

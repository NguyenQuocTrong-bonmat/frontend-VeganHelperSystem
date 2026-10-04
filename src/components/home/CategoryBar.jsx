export default function CategoryBar({ categories = [], selectedCategoryId, onSelectCategory }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mb-10 -mt-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none snap-x px-2">
        <button 
          onClick={() => onSelectCategory && onSelectCategory(null)}
          className={`shrink-0 snap-start px-5 py-2.5 rounded-full text-[14px] font-dm-sans font-medium transition-all duration-300 shadow-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${selectedCategoryId === null ? 'bg-vh-forest text-white border-vh-forest' : 'bg-white/60 backdrop-blur-md text-vh-text-primary border-white/80 hover:bg-white hover:border-vh-sage'}`}
        >
          All Recipes
        </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            className={`shrink-0 snap-start flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-dm-sans font-medium transition-all duration-300 shadow-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vh-forest hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${selectedCategoryId === cat.id ? 'bg-vh-forest text-white border-vh-forest' : 'bg-white/60 backdrop-blur-md text-vh-text-primary border-white/80 hover:bg-white hover:border-vh-sage'}`}
          >
            <span className={`w-2 h-2 rounded-full transition-colors duration-300 ${selectedCategoryId === cat.id ? 'bg-vh-mint' : 'bg-vh-sage'}`}></span>
            {cat.name}
          </button>
        ))}
      </div>
    </section>
  );
}

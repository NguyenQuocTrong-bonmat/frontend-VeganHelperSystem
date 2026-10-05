import { useScrollReveal } from '../../hooks/useScrollReveal';
import imgAll from '../../assets/images/categories/category-all-recipes.jpg';
import imgBraised from '../../assets/images/categories/category-braised-dishes.jpg';
import imgStirFried from '../../assets/images/categories/category-stir-fried.jpg';
import imgSoups from '../../assets/images/categories/category-soups.jpg';
import imgHotPots from '../../assets/images/categories/category-hot-pots.jpg';
import imgPastries from '../../assets/images/categories/category-vegan-pastries.jpg';

const categoryImages = {
  'braised-dishes': imgBraised,
  'stir-fried-dishes': imgStirFried,
  'soups': imgSoups,
  'hot-pots': imgHotPots,
  'vegan-pastries': imgPastries,
  // Mapping other categories from DB to existing illustrations to avoid empty icons
  'nutritional-knowledge': imgSoups,
  'vegan-news': imgStirFried,
  'inspiring-stories': imgPastries,
  'vietnamese-vegan-foods': imgBraised,
  'western-vegan-foods': imgHotPots,
};

export default function CategoryBar({ categories = [], selectedCategoryId, onSelectCategory }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`mb-16 transform transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

      {/* Heading */}
      <div className="text-center mb-10 pt-8">
        <h2 className="font-dm-serif text-3xl md:text-4xl text-vh-text-primary mb-3">Explore by Category</h2>
        <p className="font-dm-sans text-vh-text-secondary text-base">Discover Vietnamese plant-based favorites.</p>
      </div>

      <div className="flex flex-wrap items-start justify-center gap-4 md:gap-8 px-4 w-full max-w-5xl mx-auto">
        {/* All Recipes */}
        <button
          onClick={() => onSelectCategory && onSelectCategory(null)}
          className={`shrink-0 flex flex-col items-center group focus-visible:outline-none w-[100px] md:w-[120px]`}
        >
          <div className={`w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full p-1.5 mb-3 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:transform-none ${selectedCategoryId === null ? 'border-2 border-vh-forest bg-vh-cream shadow-md ring-4 ring-vh-forest/10' : 'border-2 border-transparent bg-white shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-vh-sage/50'}`}>
            <img src={imgAll} alt="" aria-hidden="true" className="w-full h-full object-cover rounded-full mix-blend-multiply" />
          </div>
          <span className={`text-[14px] font-dm-sans text-center leading-tight transition-colors duration-300 ${selectedCategoryId === null ? 'text-vh-forest font-semibold' : 'text-vh-text-primary group-hover:text-vh-forest group-hover:font-medium'}`}>
            All Recipes
          </span>
        </button>

        {/* Dynamic Categories */}
        {categories.map(cat => {
          const isSelected = selectedCategoryId === cat.id;
          const slug = cat.slug || cat.name.toLowerCase().replace(/ /g, '-');
          const imgSrc = categoryImages[slug];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              className={`shrink-0 flex flex-col items-center group focus-visible:outline-none w-[100px] md:w-[120px]`}
            >
              <div className={`w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full p-1.5 mb-3 transition-all duration-300 ease-out motion-reduce:transition-none motion-reduce:hover:transform-none ${isSelected ? 'border-2 border-vh-forest bg-vh-cream shadow-md ring-4 ring-vh-forest/10' : 'border-2 border-transparent bg-white shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 group-hover:border-vh-sage/50'}`}>
                {imgSrc ? (
                  <img src={imgSrc} alt="" aria-hidden="true" className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                ) : (
                  <div className="w-full h-full rounded-full bg-vh-surface flex items-center justify-center text-vh-text-tertiary">
                    <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15"></path>
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-[14px] font-dm-sans text-center leading-tight transition-colors duration-300 ${isSelected ? 'text-vh-forest font-semibold' : 'text-vh-text-primary group-hover:text-vh-forest group-hover:font-medium'}`}>
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

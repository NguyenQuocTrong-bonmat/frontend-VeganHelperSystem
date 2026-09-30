export default function SearchBar() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 w-full">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
            </svg>
          </div>
          <input className="w-full h-12 pl-12 pr-4 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[15px] text-[#2B2A25] placeholder-[#6B6F63] focus:border-[#2F5233] focus:outline-none transition-colors" placeholder="Search recipes, video guides, vegan ingredients..." type="text" />
        </div>
        <button type="submit" className="h-12 px-6 bg-[#2F5233] hover:bg-[#25401F] text-white text-[15px] font-medium rounded-lg flex items-center gap-2 transition-colors shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
          </svg>
          <span className="">
            Search
          </span>
        </button>
      </div>
    </section>
  );
}

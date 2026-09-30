export default function CategoryBar() {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#2F5233] rounded-lg text-[14px] font-medium text-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
          <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
          <span>All</span>
        </button>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#2F5233] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
          <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
          <span>Main Dishes</span>
        </button>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
          <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
          <span>Soups</span>
        </button>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
          <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
          <span>Salads</span>
        </button>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#6B6F63] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
          <span className="w-[3px] h-4 bg-[#6B6F63] rounded-full"></span>
          <span>Braised Dishes</span>
        </button>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#D9A441] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
          <span className="w-[3px] h-4 bg-[#D9A441] rounded-full"></span>
          <span>Desserts</span>
        </button>
        <button className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFBF6] border border-[#DCE3D5] rounded-lg text-[14px] font-medium text-[#2B2A25] hover:border-[#A63446] hover:bg-[#F3F6EE] transition-colors whitespace-nowrap">
          <span className="w-[3px] h-4 bg-[#A63446] rounded-full"></span>
          <span>Cooking Videos</span>
        </button>
      </div>
    </section>
  );
}

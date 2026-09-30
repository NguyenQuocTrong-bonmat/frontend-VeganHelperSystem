import { Link } from 'react-router-dom';

export default function PostList() {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
          Newest Recipes & Videos
        </h2>
        <div className="flex items-center gap-2 text-[13px] text-[#6B6F63]">
          <span className="text-[#2F5233] font-semibold underline underline-offset-4">
            Newest
          </span>
          <span className="">•</span>
          <span className="hover:text-[#2F5233] cursor-pointer">
            Popular
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {/* Placeholder Post Items */}
        <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-4 md:p-5 flex flex-col md:flex-row gap-5 hover:border-[#2F5233] transition-colors cursor-pointer" to="/posts/1/guest">
          <div className="relative w-full md:w-56 h-40 bg-[#E9EFE6] border border-[#DCE3D5] rounded-lg shrink-0 overflow-hidden">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDT-KvT-D1TMUWu9DDm0e46qnf-2i9G84lzwDe3hVX34gW4xiLhkwq7dyQNr95cgiJW1mxaB6ehtiBpsCBtA52uPi51fgkitcMbZrBggtBivVpA8lWuy1OyRnf-UaYc38tbWDbJ_0nRz6aMmYjRmqo6cWZ6Bd5pweejuZCDwKmtY21QpXqKaebWfzBWbCQu22jVeDEvwhVZZNnOpuWtvYrNq_EeLCtaNKhgXuJUiPNz7zeWK-ZL_npb" alt="Crispy Lemongrass Tofu" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-[3px] h-3.5 bg-[#2F5233] rounded-full"></span>
                <span className="text-[13px] font-medium text-[#6B6F63]">Main Dishes</span>
                <span className="text-xs text-[#6B6F63]">•</span>
                <span className="text-[13px] text-[#6B6F63]">45 minutes ago</span>
              </div>
              <h3 className="font-vietnam text-[18px] md:text-[20px] font-semibold text-[#2B2A25] mb-2 leading-snug group-hover:text-[#2F5233]">
                Crispy Pan-Fried Lemongrass & Chili Tofu
              </h3>
              <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B6F63] line-clamp-2 mb-3">
                Crisp golden tofu cubes tossed with fragrant finely minced lemongrass, crushed bird's eye chili, and warm toasted sesame.
              </p>
            </div>
            <div className="pt-3 border-t border-[#DCE3D5] flex flex-wrap items-center justify-between text-[13px] text-[#6B6F63] gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                  </svg>
                </div>
                <span className="font-medium text-[#2B2A25]">Mai Linh</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Views: <strong className="font-semibold text-[#2B2A25]">185</strong></span>
              </div>
            </div>
          </div>
        </Link>
        {/* We will replace these with dynamic mapped items once API is connected */}
      </div>
      <div className="mt-8 flex justify-center">
        <button className="h-11 px-6 rounded-lg border-[1.5px] border-[#2F5233] bg-transparent text-[#2F5233] text-[14px] font-medium hover:bg-[#E9EFE6] transition-colors">
          View More Recipes & Posts
        </button>
      </div>
    </section>
  );
}

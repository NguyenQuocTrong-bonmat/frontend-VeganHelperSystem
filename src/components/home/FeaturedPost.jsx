import { Link } from 'react-router-dom';

export default function FeaturedPost() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-fraunces text-2xl font-medium text-[#2B2A25]">
          Featured Post
        </h2>
        <span className="text-[13px] font-medium text-[#6B6F63]">
          Weekly recommendation
        </span>
      </div>
      <Link className="block bg-[#FDFBF6] border border-[#DCE3D5] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center hover:border-[#2F5233] transition-colors cursor-pointer" to="/posts/1/guest">
        <div className="relative lg:col-span-6 w-full h-64 md:h-80 bg-[#E9EFE6] border border-[#DCE3D5] hero-radius overflow-hidden">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVut92jYK_Q_EsK1v2nfyFEboWQOjGuXIHJZUgz_UqCBgpd29xjvX6R3RrV1he-fmbybPme2KACc5Uo5rn1aGykfINbsFiq4njonV2t-_TEA71jBEXVcNff7z3TPezgjUwl7OmBhvxB3ZN5xf6waeNMioISgdQ9SqfUdwlhPygFlkrdOltlTvcSytwa8yC1nSRDITTLlEw-KtZbJR0G6LKj7NX9Wwomyfd6XCKeOVApxdQZ0gVo65B" alt="Golden Turmeric Braised Tofu & Mushrooms" className="w-full h-full object-cover" />
          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#2B2A25]/60 text-white text-[12px] font-medium">
            1/4
          </div>
        </div>
        <div className="lg:col-span-6 flex flex-col justify-between h-full py-1 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-[3px] h-4 bg-[#2F5233] rounded-full"></span>
              <span className="text-[13px] font-medium text-[#6B6F63]">
                Main Dishes
              </span>
              <span className="text-xs text-[#6B6F63]">
                •
              </span>
              <span className="text-[13px] text-[#6B6F63]">
                2 hours ago
              </span>
            </div>
            <h3 className="font-fraunces text-2xl md:text-3xl font-semibold text-[#2B2A25] mb-3 leading-snug hover:text-[#2F5233] transition-colors">
              Golden Turmeric Braised Tofu & Wild Forest Mushrooms
            </h3>
            <p className="text-[15px] leading-relaxed text-[#6B6F63] mb-6">
              Pan-seared firm tofu gently simmered in fresh young coconut water, cracked black pepper, fresh turmeric root, and fragrant wood ear mushrooms.
            </p>
          </div>
          <div className="pt-4 border-t border-[#DCE3D5] flex items-center justify-between text-[13px] text-[#6B6F63]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E9EFE6] border border-[#DCE3D5] flex items-center justify-center">
                <svg className="w-4 h-4 text-[#6B6F63]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
                </svg>
              </div>
              <span className="font-medium text-[#2B2A25]">
                Chef Duy
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="">
                Views:
                <strong className="font-semibold text-[#2B2A25]">
                  342
                </strong>
              </span>
              <span className="flex items-center gap-1 text-[#A63446]">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                </svg>
                <span className="text-[#6B6F63]">
                  Likes:
                </span>
                <strong className="font-semibold text-[#2B2A25]">
                  124
                </strong>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

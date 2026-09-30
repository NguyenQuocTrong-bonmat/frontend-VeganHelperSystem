export default function Footer() {
  return (
    <footer className="w-full border-t border-[#DCE3D5] bg-[#FDFBF6] py-6 mt-16">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-[#6B6F63] gap-4">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-[#2F5233] text-base">
            Botanical Hearth
          </span>
          <span className="">
            •
          </span>
          <span className="">
            Plant-based culinary & family nutrition platform
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-[#2F5233] transition-colors">
            About Us
          </a>
          <a href="#" className="hover:text-[#2F5233] transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-[#2F5233] transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-[#2F5233] transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
}

import { Link } from 'react-router-dom';

export default function HeaderAuth() {
  return (
    <header className="w-full bg-[#FDFBF6] border-b border-[#DCE3D5] h-16 flex items-center px-6 md:px-12 shrink-0">
      <div className="max-w-[1120px] w-full mx-auto flex items-center justify-between">
        <Link className="flex items-center gap-2.5 text-[#2F5233] font-fraunces font-semibold text-2xl tracking-tight hover:opacity-90 transition-opacity" to="/">
          <svg className="w-6 h-6 text-[#2F5233]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
            <path d="M2 21c0-3 1.85-5.36 5.08-6"></path>
          </svg>
          <span>Botanical Hearth</span>
        </Link>
        <Link className="text-sm font-medium text-[#6B6F63] hover:text-[#2F5233] transition-colors" to="/">
          Back to home
        </Link>
      </div>
    </header>
  );
}

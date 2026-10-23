import { Link } from 'react-router-dom';

export default function HeaderAuth({ className = '' }) {
  return (
    <header className={`w-full bg-[#FDFBF6]/95 backdrop-blur-md border-b border-[#DCE3D5] h-14 sm:h-15 flex items-center px-4 sm:px-8 md:px-12 shrink-0 z-20 ${className}`}>
      <div className="w-full flex items-center justify-between">
        <Link className="flex items-center gap-2.5 text-[#2F5233] font-fraunces font-semibold text-xl sm:text-2xl tracking-tight hover:opacity-90 transition-opacity" to="/">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-9 sm:h-10 md:h-11 w-auto object-contain origin-left" />
        </Link>
        <Link className="text-xs sm:text-sm font-medium text-[#6B6F63] hover:text-[#2F5233] transition-colors focus-ring-vh rounded px-2 py-1" to="/">
          Back to home
        </Link>
      </div>
    </header>
  );
}

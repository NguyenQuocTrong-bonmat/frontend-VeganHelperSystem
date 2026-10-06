import { Link } from 'react-router-dom';

export default function HeaderAuth() {
  return (
    <header className="w-full bg-[#FDFBF6] border-b border-[#DCE3D5] h-16 flex items-center px-6 md:px-12 shrink-0">
      <div className="max-w-[1120px] w-full mx-auto flex items-center justify-between">
        <Link className="flex items-center gap-2.5 text-[#2F5233] font-fraunces font-semibold text-2xl tracking-tight hover:opacity-90 transition-opacity" to="/">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-[46px] md:h-[54px] w-auto object-contain scale-[1.35] origin-left" />
        </Link>
        <Link className="text-sm font-medium text-[#6B6F63] hover:text-[#2F5233] transition-colors" to="/">
          Back to home
        </Link>
      </div>
    </header>
  );
}

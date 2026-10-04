import { Link, NavLink } from 'react-router-dom';

export default function HeaderGuest() {
  return (
    <header className="sticky top-0 z-40 h-16 bg-[#FDFBF6] border-b border-[#DCE3D5] flex items-center justify-between px-6 md:px-10">
      <div className="flex items-center gap-2.5">
        <Link className="flex items-center gap-2.5 text-[#2F5233] hover:opacity-95 transition-opacity shrink-0" to="/">
          <img src="/logo.png" alt="Vegan Helper Logo" className="h-10" />
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-8 h-16">
        <NavLink to="/" end className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          Home
        </NavLink>
        <NavLink to="/weekly-menu/locked"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          Weekly Menu
        </NavLink>
        <NavLink to="/vegan-stores/locked"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          Find Vegan Stores
        </NavLink>
        <NavLink to="/my-posts/locked"  className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-colors ${isActive ? "font-semibold text-[#2F5233] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#2F5233]" : "font-medium text-[#2B2A25] hover:text-[#2F5233]"}`}>
          My Posts
        </NavLink>
      </nav>
      <div className="flex items-center gap-3 shrink-0">
        <Link className="h-10 px-4 flex items-center justify-center rounded-lg border-[1.5px] border-[#2F5233] text-[#2F5233] text-[14px] font-medium hover:bg-[#F3F6EE] transition-colors" to="/login">
          Log In
        </Link>
        <Link className="h-10 px-4 flex items-center justify-center rounded-lg bg-[#2F5233] text-white text-[14px] font-medium hover:bg-[#25401F] transition-colors" to="/sign-up">
          Sign Up
        </Link>
      </div>
    </header>
  );
}

// app/dashboard/galleries/layout.js
import Link from "next/link";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

export default function GalleriesLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Sticky Header with Back Button shared across all gallery pages */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0D5C3E] bg-slate-100 hover:bg-slate-200/70 px-3.5 py-2 rounded-xl transition-all"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Hub</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#0D5C3E] flex items-center justify-center text-white text-xs font-bold">
              <FaShieldAlt />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Gallery Control
            </span>
          </div>

        </div>
      </header>

      {/* Renders the child page (food-services, interior-design, etc.) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
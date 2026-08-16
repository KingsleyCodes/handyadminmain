// app/page.js
import Link from 'next/link';
import { 
  FaCouch, 
  FaBuilding, 
  FaUtensils, 
  FaTshirt, 
  FaArrowRight,
  FaShieldAlt 
} from 'react-icons/fa';

const modules = [
  {
    title: 'Interior Design',
    slug: 'interior-design',
    path: '/dashboard/galleries/interior-design',
    icon: FaCouch,
    description: 'Manage interior projects, room transformations, and gallery image uploads.'
  },
  {
    title: 'Real Estate',
    slug: 'real-estate',
    path: '/dashboard/galleries/real-estate',
    icon: FaBuilding,
    description: 'Update property listings, luxury shortlet photos, land sales, and pricing details.'
  },
  {
    title: 'Food Services',
    slug: 'food-services',
    path: '/dashboard/galleries/food-services',
    icon: FaUtensils,
    description: 'Manage catering menus, dish showcases, event setups, and food package galleries.'
  },
  {
    title: 'Laundry Services',
    slug: 'laundry-services',
    path: '/dashboard/galleries/laundry-services',
    icon: FaTshirt,
    description: 'Control laundry package pricing, drop-off bundles, and dry cleaning portfolios.'
  }
];

export default function AdminLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Top Header Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D5C3E] to-[#1A3C2E] flex items-center justify-center text-white font-bold shadow-md">
              <FaShieldAlt className="text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Handy Uche Admin CMS</h1>
              <p className="text-xs text-slate-500 font-medium">Control Center</p>
            </div>
          </div>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            System Live
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Content Management Hub
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
            Select a service category below to navigate directly to its upload manager.
          </p>
        </div>

        {/* Dynamic Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.slug} 
                href={item.path}
                className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0D5C3E] to-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 group-hover:bg-[#0D5C3E]/10 text-slate-700 group-hover:text-[#0D5C3E] flex items-center justify-center text-2xl transition-colors duration-300">
                      <Icon />
                    </div>
                    <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#B8860B]/10 group-hover:text-[#B8860B] transition-colors duration-300">
                      {item.path}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0D5C3E] transition-colors duration-200 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-sm font-semibold text-[#0D5C3E] group-hover:text-[#B8860B] transition-colors duration-200">
                  <span>Open Gallery Upload Manager</span>
                  <FaArrowRight className="text-xs transform group-hover:translate-x-1.5 transition-transform duration-200" />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
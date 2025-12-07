import React from 'react';

const getInitials = (name) => {
  if (!name) return 'MK';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const Header = ({ 
  brandName = 'Türkiye Dijital Gönüllülük', 
  logo,
  showSearch = false,
  userData = null
}) => {
  const isLoggedIn = localStorage.getItem('currentUserId') !== null;
  const userInitials = userData ? getInitials(userData.name) : 'MK';
  const userAvatar = userData?.avatarUrl;
  return (
    <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 border-b border-slate-600 shadow-xl sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Logo - Left aligned */}
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img src="/media/kovan_logo.png" alt="Kovan Logo" className="h-20 w-auto" />
          </a>

          {/* Search Bar - Only show on Home */}
          {showSearch && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <img src="/media/search.svg" alt="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Ara..." 
                  className="w-full pl-11 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                />
              </div>
            </div>
          )}

          {/* Right side container - Always right aligned */}
          <div className="flex items-center gap-6">
            {/* Navigation Icons */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="flex flex-col items-center gap-1 text-slate-200 hover:text-cyan-400 transition group">
                <img src="/media/home.svg" alt="Home" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Home</span>
              </a>
              <a href="/projects" className="flex flex-col items-center gap-1 text-slate-200 hover:text-cyan-400 transition group">
                <img src="/media/application.svg" alt="Applications" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">Applications</span>
              </a>
              <a href="/statistics" className="flex flex-col items-center gap-1 text-slate-200 hover:text-cyan-400 transition group">
                <img src="/media/statistics.svg" alt="Statistics" className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">İstatistikler</span>
              </a>
              {isLoggedIn && (
                <a href="/me" className="flex flex-col items-center gap-1 text-slate-200 hover:text-cyan-400 transition group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 group-hover:scale-110 transition-transform flex items-center justify-center overflow-hidden text-white font-bold text-xs">
                    {userAvatar ? (
                      <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <span className="text-xs font-medium">Me</span>
                </a>
              )}
            </nav>

            {/* Login Button - Only show when not logged in */}
            {!isLoggedIn && (
              <a href="/login" className="hidden sm:inline-block px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition shadow-md">
                Giriş Yap
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

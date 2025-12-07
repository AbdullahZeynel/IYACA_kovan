import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 border-t border-slate-600 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-slate-400 text-sm text-center">
          © {currentYear} Kovan. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

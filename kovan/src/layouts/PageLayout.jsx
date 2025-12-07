import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const getUserData = () => {
  const saved = localStorage.getItem('userData');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    name: 'Mehmet Korkmaz',
    headline: 'Gönüllü',
    bio: 'Gönüllülük faaliyetlerine katılmayı seven, topluma katkı sağlamaktan mutluluk duyan biriyim.'
  };
};

const PageLayout = ({ children, showHeader = true, showFooter = true, showSearch = false, userData = null }) => {
  const [currentUserData, setCurrentUserData] = useState(userData || getUserData());

  useEffect(() => {
    if (!userData) {
      setCurrentUserData(getUserData());
    } else {
      setCurrentUserData(userData);
    }
  }, [userData]);

  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header showSearch={showSearch} userData={currentUserData} />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;

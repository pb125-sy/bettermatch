// Layout.tsx
import React from 'react';
import Header from './Header';
{/*import Footer from './Footer'; // Assume a Footer component exists*/}
import { LayoutProps } from './types';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = ['Home', 'About', 'Contact'];

  return (
    <div>
      <Header title="BetterMatch" navItems={navItems} />
      
      {/* ADD TEXT HERE for a persistent sidebar or notice */}
      <div style={{ background: '#e0e7ff', padding: '5px', textAlign: 'center' }}>
        Currently serving the Berkeley area.
      </div>

      <main style={{ padding: '20px' }}>
        {children} 
      </main>
      <Footer /> 
    </div>
  );
};

export default Layout;

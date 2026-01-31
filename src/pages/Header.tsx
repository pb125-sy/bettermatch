// Header.tsx
import React from 'react';
import { HeaderProps } from './types';

const Header: React.FC<HeaderProps> = ({ title, navItems }) => {
  return (
    <header style={{ padding: '10px', background: '#f4f4f4' }}>
      <h1>{title}</h1>
      
      {/* ADD TEXT HERE */}
      <p style={{ fontSize: '12px', color: 'gray' }}>AI-Powered Matching v1.0</p>
      
      <nav>
        {navItems.map(item => <a key={item} href={`/${item.toLowerCase()}`}>{item}</a>)}
      </nav>
    </header>
  );
};

export default Header;

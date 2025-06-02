import React from 'react';
import './Header.css'; // Import the custom CSS for animation

export const Header = () => {
  return (
    <header className="animated-gradient text-white shadow-md h-20 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <span className="text-3xl animate-bounce">🖼️</span>
        <h1 className="text-3xl font-bold tracking-wide animate-pulse">Pixify</h1>
      </div>
    </header>
  );
};

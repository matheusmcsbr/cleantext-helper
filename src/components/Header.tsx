
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container animate-fade-in">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="inline-block px-3 py-1 mb-2 text-xs font-medium tracking-wider text-primary-foreground bg-primary rounded-full animate-fade-up" style={{ animationDelay: '100ms' }}>
            TEXT UTILITY
          </div>
          <h1 className="text-3xl font-light tracking-tight sm:text-4xl md:text-5xl animate-fade-up" style={{ animationDelay: '200ms' }}>
            CleanText
          </h1>
          <p className="max-w-[700px] text-muted-foreground animate-fade-up" style={{ animationDelay: '300ms' }}>
            Transform formatted text into clean, plain paragraphs with a simple paste or upload.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;

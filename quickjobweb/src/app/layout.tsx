// src/app/layout.tsx

import React from 'react';
import '../app/globals.css'; // Import global styles if you have any

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        {/* You can add meta tags, title, and other head elements here */}
        <title>QuickJob</title>
      </head>
      <body>
        {/* Navigation Bar */}
      

        {/* Main Content */}
        <main style={{ marginTop: '30px' }}>
          {children}
        </main>
      </body>
    </html>
  );
};

export default Layout;

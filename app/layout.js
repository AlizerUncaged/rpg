// app/layout.js - Main layout component for the entire application

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
     title: "Aurora's Override - A Cyberpunk RPG Game",
     description: 'A turn-based RPG game with a cyberpunk hacker theme',
};

export default function RootLayout({ children }) {
     return (
          <html lang="en">
               <head>
                    {/* Custom fonts */}
                    <link href="https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&family=Press+Start+2P&display=swap" rel="stylesheet" />
               </head>
               <body className={`${inter.className} bg-[#0A0A23] text-white min-h-screen`}>
                    {children}
               </body>
          </html>
     );
}
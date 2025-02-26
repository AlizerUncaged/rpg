// app/not-found.js - 404 Not Found page for Next.js app

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
     return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0A23]">
               <div className="max-w-md w-full border-2 border-[#9D00FF] p-6 relative overflow-hidden">
                    {/* 404 header */}
                    <h1 className="font-['VT323'] text-6xl text-[#FF7700] mb-4 text-center">404</h1>

                    {/* Error details */}
                    <div className="mb-6 text-center">
                         <div className="font-['Share_Tech_Mono'] text-[#00FFFF] text-lg mb-4">
                              DATA SECTOR NOT FOUND
                         </div>

                         <div className="font-['Share_Tech_Mono'] text-[#39FF14] text-sm mb-6">
                              The digital path you're attempting to access has been corrupted or does not exist in the system.
                         </div>

                         {/* Terminal-style trace */}
                         <div className="font-['Share_Tech_Mono'] text-xs text-left p-3 bg-[#0A0A23] border border-[#39FF14] mb-6">
                              <div className="text-[#FF7700]">$ path_trace</div>
                              <div className="text-white">Scanning digital pathways...</div>
                              <div className="text-white">Error: Data corruption detected</div>
                              <div className="text-white">Attempting recovery... Failed</div>
                              <div className="text-red-500">System recommendation: Return to main interface</div>
                         </div>
                    </div>

                    {/* Action button */}
                    <div className="flex justify-center">
                         <Link href="/" className="
            bg-[#00FFFF] hover:bg-[#00CCCC] text-[#0A0A23] 
            border-2 border-[#39FF14]
            font-['Press_Start_2P'] text-sm py-2 px-4
            hover:shadow-[0_0_10px_rgba(57,255,20,0.7)]
            transition-all duration-200 
          ">
                              RETURN TO MAINFRAME
                         </Link>
                    </div>

                    {/* Animated 0s and 1s background */}
                    <div className="absolute -z-10 inset-0 overflow-hidden opacity-10">
                         <div className="animate-terminal-typing text-[#39FF14] font-['Share_Tech_Mono'] text-[8px]">
                              {'01'.repeat(2000)}
                         </div>
                    </div>
               </div>
          </div>
     );
}
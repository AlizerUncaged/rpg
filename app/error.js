// app/error.js - Error page for Next.js app

'use client';

import { useEffect } from 'react';
import Button from '../components/ui/Button';

export default function Error({ error, reset }) {
     // Log the error to console for debugging
     useEffect(() => {
          console.error('Application error:', error);
     }, [error]);

     return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0A23]">
               <div className="max-w-md w-full border-4 border-red-500 p-6 relative overflow-hidden">
                    {/* Error header */}
                    <h1 className="font-['VT323'] text-4xl text-red-500 mb-4 text-center">SYSTEM ERROR</h1>

                    {/* Error details */}
                    <div className="mb-6">
                         <div className="font-['Share_Tech_Mono'] text-[#FF7700] text-lg mb-2">
                              Critical Malfunction Detected
                         </div>

                         <div className="font-['Share_Tech_Mono'] text-[#39FF14] text-sm mb-4 p-3 bg-[#0A0A23] border border-[#39FF14] overflow-hidden">
                              <div className="mb-2 text-[#00FFFF]">Error code: {(Math.random() * 1000000).toFixed(0)}</div>
                              <div className="overflow-hidden">
                                   {error.message || "An unexpected error occurred within the system."}
                              </div>
                         </div>

                         <div className="font-['Share_Tech_Mono'] text-sm text-white">
                              The system has encountered an error and needs to be restarted. All unsaved progress may be lost.
                         </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap justify-center gap-4">
                         <Button onClick={reset} type="primary">
                              REBOOT SYSTEM
                         </Button>

                         <Button onClick={() => window.location.href = '/'} type="accent">
                              RETURN TO MAIN MENU
                         </Button>
                    </div>

                    {/* Animated error effect background */}
                    <div className="absolute -z-10 inset-0 overflow-hidden opacity-10">
                         <div className="animate-[glitch_0.5s_infinite] text-red-500 font-['Share_Tech_Mono'] text-[8px]">
                              {'ERROR '.repeat(2000)}
                         </div>
                    </div>
               </div>
          </div>
     );
}
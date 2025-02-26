// app/loading.js - Loading screen for Next.js app

'use client';

import React, { useState, useEffect } from 'react';

export default function Loading() {
     const [progress, setProgress] = useState(0);
     const [messages, setMessages] = useState([
          'Initializing system...',
          'Loading digital assets...',
          'Establishing secure connection...',
          'Preparing neural interface...',
          'Scanning for threats...',
          'Mounting system drives...',
          'Calibrating quantum entanglement...',
          'Bypassing security protocols...',
          'Ready to override...'
     ]);
     const [currentMessage, setCurrentMessage] = useState(0);

     // Simulate loading progress
     useEffect(() => {
          const timer = setInterval(() => {
               setProgress(prev => {
                    if (prev >= 100) {
                         clearInterval(timer);
                         return 100;
                    }
                    return prev + Math.floor(Math.random() * 10) + 1;
               });
          }, 400);

          return () => clearInterval(timer);
     }, []);

     // Cycle through loading messages
     useEffect(() => {
          if (progress < 100) {
               const messageTimer = setInterval(() => {
                    setCurrentMessage(prev => (prev + 1) % messages.length);
               }, 1500);

               return () => clearInterval(messageTimer);
          }
     }, [progress, messages.length]);

     return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A23] p-4">
               <div className="max-w-md w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                         <h1 className="font-['VT323'] text-4xl text-[#00FFFF] mb-2">AURORA'S OVERRIDE</h1>
                         <div className="font-['Share_Tech_Mono'] text-[#FF7700]">LOADING SYSTEM</div>
                    </div>

                    {/* Loading terminal */}
                    <div className="border-2 border-[#00FFFF] p-4 bg-[#0A0A23] mb-4">
                         <div className="border-b border-[#00FFFF] mb-4 pb-2 flex justify-between items-center">
                              <div className="font-['Share_Tech_Mono'] text-[#00FFFF]">system.boot</div>
                              <div className="flex space-x-2">
                                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                         </div>

                         <div className="font-['Share_Tech_Mono'] text-[#39FF14] text-sm h-32 overflow-hidden flex flex-col">
                              {messages.slice(0, currentMessage + 1).map((message, index) => (
                                   <div key={index} className={index === currentMessage ? 'animate-pulse' : ''}>
                                        <span className="text-[#00FFFF]">$</span> {message}
                                        {index === currentMessage && <span className="animate-blink ml-1">_</span>}
                                   </div>
                              ))}
                         </div>

                         {/* Progress bar */}
                         <div className="mt-4 w-full h-6 border border-[#39FF14] relative overflow-hidden">
                              <div
                                   className="h-full bg-[#39FF14] transition-all duration-300 ease-out"
                                   style={{ width: `${progress}%` }}
                              ></div>
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-['Press_Start_2P'] text-xs text-[#0A0A23]">
                                   {progress}%
                              </div>
                         </div>
                    </div>

                    {/* Loading text */}
                    <div className="text-center font-['Share_Tech_Mono'] text-[#9D00FF] text-xs animate-pulse">
                         PLEASE WAIT WHILE THE SYSTEM INITIALIZES
                    </div>
               </div>

               {/* Digital noise background */}
               <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-5 -z-10">
                    <div className="h-full w-full bg-[url('/digital-noise.png')] bg-repeat"></div>
               </div>
          </div>
     );
}
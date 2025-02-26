// app/page.js - Enhanced start screen with background

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserInput from '../components/UserInput';
import Background from '../components/ui/Background';

export default function Home() {
     const router = useRouter();
     const [isLoading, setIsLoading] = useState(true);
     const [gameStarting, setGameStarting] = useState(false);

     // Simulated loading for cyberpunk effect
     useEffect(() => {
          const timer = setTimeout(() => {
               setIsLoading(false);
          }, 2000);

          return () => clearTimeout(timer);
     }, []);

     // Handle starting the game with player names
     const handleStartGame = (player1Name, player2Name) => {
          setGameStarting(true);

          // Store player names in localStorage
          localStorage.setItem('auroraPlayers', JSON.stringify({
               player1: player1Name,
               player2: player2Name
          }));

          // Simulate initialization sequence for dramatic effect
          setTimeout(() => {
               router.push('/game');
          }, 1500);
     };

     if (isLoading) {
          return (
               <Background type="start">
                    <div className="min-h-screen flex flex-col items-center justify-center bg-opacity-50">
                         <div className="terminal-container p-6 border-2 border-[#00FFFF] bg-[#0A0A23] bg-opacity-80 max-w-md w-full rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                              <div className="flex justify-between items-center mb-4 border-b border-[#39FF14] pb-2">
                                   <div className="font-['Share_Tech_Mono'] text-[#00FFFF]">system.boot</div>
                                   <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                   </div>
                              </div>

                              <div className="mb-4 font-['Share_Tech_Mono'] text-[#39FF14]">
                                   <div>$ initializing system...</div>
                                   <div>$ loading assets...</div>
                                   <div>$ establishing connection...</div>
                                   <div className="animate-pulse">$ preparing digital battlefield...</div>
                              </div>

                              <div className="w-full bg-[#0A0A23] h-4 border border-[#39FF14] relative overflow-hidden">
                                   <div className="absolute top-0 left-0 h-full bg-[#39FF14] animate-[loading_2s_ease-in-out_infinite]" style={{ width: '70%' }}></div>
                                   <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                                        <span className="text-[10px] font-['Press_Start_2P'] text-[#0A0A23]">LOADING</span>
                                   </div>
                              </div>
                         </div>
                    </div>
               </Background>
          );
     }

     return (
          <Background type="start">
               <main className="min-h-screen flex flex-col items-center justify-center p-4">
                    {/* Game Logo/Title */}
                    <div className="mb-8 text-center bg-[#0A0A23] bg-opacity-80 p-4 rounded-lg shadow-lg">
                         <h1 className="font-['VT323'] text-5xl md:text-6xl text-[#00FFFF] mb-2 
            relative inline-block
            hover:text-[#39FF14] transition-colors duration-300">
                              AURORA&apos;S OVERRIDE
                         </h1>
                         <div className="font-['Share_Tech_Mono'] text-[#FF7700]">
                              A CYBERPUNK HACKER RPG
                         </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full max-w-lg">
                         <UserInput onSubmit={handleStartGame} isGameStarting={gameStarting} />
                    </div>

                    {/* Footer with credits */}
                    <div className="mt-auto pt-8 text-center bg-[#0A0A23] bg-opacity-70 w-full p-2">
                         <div className="font-['Share_Tech_Mono'] text-xs text-[#9D00FF]">
                              &copy; ORANGE WEEK :: VERSION 1.0.0
                         </div>
                    </div>
               </main>
          </Background>
     );
}
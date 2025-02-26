// app/highscores/page.js - High scores display page

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '../../hooks/useLocalStorage';
import Button from '../../components/ui/Button';

export default function HighScoresPage() {
     const router = useRouter();
     const { getHighScores } = useLocalStorage();
     const [highScores, setHighScores] = useState([]);
     const [loading, setLoading] = useState(true);

     // Load high scores from local storage
     useEffect(() => {
          // Add slight delay for cyberpunk terminal effect
          const timer = setTimeout(() => {
               const scores = getHighScores();
               setHighScores(scores);
               setLoading(false);
          }, 800);

          return () => clearTimeout(timer);
     }, [getHighScores]);

     // Format date for display
     const formatDate = (dateString) => {
          try {
               const date = new Date(dateString);
               return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } catch (error) {
               return 'Unknown date';
          }
     };

     if (loading) {
          return (
               <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0A0A23]">
                    <div className="terminal-container p-8 border-2 border-[#00FFFF] max-w-md w-full">
                         <div className="mb-4 font-['Share_Tech_Mono'] text-[#39FF14]">
                              <div>$ accessing database...</div>
                              <div>$ retrieving high scores...</div>
                              <div className="animate-pulse">$ please wait...</div>
                         </div>
                         <div className="w-full bg-[#00FFFF] h-2 relative overflow-hidden">
                              <div className="absolute top-0 left-0 bg-[#0A0A23] h-full w-3 animate-[loading_1.5s_infinite]"></div>
                         </div>
                    </div>
               </div>
          );
     }

     return (
          <div className="min-h-screen flex flex-col items-center p-4 bg-[#0A0A23]">
               <div className="w-full max-w-2xl">
                    {/* Header */}
                    <div className="mb-8 text-center">
                         <h1 className="font-['VT323'] text-4xl text-[#00FFFF] mb-2">HIGH SCORES</h1>
                         <div className="font-['Share_Tech_Mono'] text-sm text-[#39FF14]">
                              TOP HACKERS IN THE SYSTEM
                         </div>
                    </div>

                    {/* High Scores Table */}
                    <div className="mb-8 w-full border-2 border-[#9D00FF] bg-[#0A0A23] overflow-hidden">
                         {highScores.length === 0 ? (
                              <div className="p-6 text-center font-['Share_Tech_Mono'] text-[#FF7700]">
                                   No scores recorded yet. Be the first to hack the system!
                              </div>
                         ) : (
                              <table className="w-full">
                                   <thead>
                                        <tr className="border-b border-[#9D00FF]">
                                             <th className="p-3 font-['VT323'] text-left text-[#00FFFF]">RANK</th>
                                             <th className="p-3 font-['VT323'] text-left text-[#00FFFF]">HACKERS</th>
                                             <th className="p-3 font-['VT323'] text-right text-[#00FFFF]">SCORE</th>
                                             <th className="p-3 font-['VT323'] text-right text-[#00FFFF]">DATE</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {highScores.map((score, index) => (
                                             <tr
                                                  key={index}
                                                  className={`
                      border-b border-[#0A0A23] 
                      ${index === 0 ? 'bg-[#FF7700] bg-opacity-20' : ''}
                      ${index === 1 ? 'bg-[#9D00FF] bg-opacity-10' : ''}
                      ${index === 2 ? 'bg-[#00FFFF] bg-opacity-10' : ''}
                      hover:bg-[#39FF14] hover:bg-opacity-10 transition-colors
                    `}
                                             >
                                                  <td className="p-3 font-['Press_Start_2P'] text-xs text-[#39FF14]">
                                                       #{index + 1}
                                                  </td>
                                                  <td className="p-3 font-['Share_Tech_Mono'] text-white">
                                                       {score.player1} & {score.player2}
                                                  </td>
                                                  <td className="p-3 font-['Share_Tech_Mono'] text-right text-[#FF7700]">
                                                       {score.score.toLocaleString()}
                                                  </td>
                                                  <td className="p-3 font-['Share_Tech_Mono'] text-xs text-right text-[#9D00FF]">
                                                       {formatDate(score.date)}
                                                  </td>
                                             </tr>
                                        ))}
                                   </tbody>
                              </table>
                         )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center space-x-4">
                         <Button onClick={() => router.push('/')} type="secondary">
                              MAIN MENU
                         </Button>
                         <Button onClick={() => router.push('/game')} type="primary">
                              PLAY AGAIN
                         </Button>
                    </div>
               </div>

               {/* Digital decoration in background */}
               <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-5">
                    <div className="grid grid-cols-20 h-full">
                         {Array(20).fill(0).map((_, i) => (
                              <div key={i} className="overflow-hidden">
                                   <div className="animate-terminal-typing font-['Share_Tech_Mono'] text-[8px] text-[#39FF14]">
                                        {'01'.repeat(1000)}
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </div>
     );
}
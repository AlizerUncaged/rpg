// components/ui/Background.js
import React from 'react';

const Background = ({ type = 'battle', enemyType = '', children, className = '' }) => {
     // Enhanced background type mapping
     const backgrounds = {
          // Main screens
          battle: '/images/backgrounds/battle-background.png',
          start: '/images/backgrounds/start-screen.png',
          victory: '/images/backgrounds/victory-background.png',
          gameOver: '/images/backgrounds/game-over-background.png',

          // Enemy-specific backgrounds
          scriptKiddie: '/images/backgrounds/battle-background.png',
          malwareBot: '/images/backgrounds/code-overlay.png',
          firewallGuardian: '/images/backgrounds/energy-pattern.png',
          dataCorruptor: '/images/backgrounds/corruption-overlay.png',
          systemAdmin: '/images/backgrounds/digital-noise.png',
     };

     // If we have an enemy type, prioritize that background
     const bgImage = enemyType && backgrounds[enemyType]
          ? backgrounds[enemyType]
          : backgrounds[type] || backgrounds.battle;

     console.log("Current background:", bgImage, "Enemy type:", enemyType);

     // Overlay effects based on enemy/background type
     let overlayClass = "bg-[#0A0A23] opacity-30";

     if (enemyType === 'dataCorruptor') {
          overlayClass = "bg-gradient-to-br from-[#0A0A23] to-purple-900 opacity-40";
     } else if (enemyType === 'systemAdmin') {
          overlayClass = "bg-gradient-to-b from-[#0A0A23] to-[#FF7700] opacity-20";
     } else if (enemyType === 'firewallGuardian') {
          overlayClass = "bg-gradient-to-tr from-[#0A0A23] to-blue-900 opacity-30";
     } else if (type === 'victory') {
          overlayClass = "bg-gradient-to-t from-[#0A0A23] to-green-900 opacity-30";
     } else if (type === 'gameOver') {
          overlayClass = "bg-gradient-to-t from-[#0A0A23] to-red-900 opacity-40";
     }

     return (
          <div
               className={`fixed inset-0 w-full min-h-screen ${className}`}
               style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed'
               }}
          >
               {/* Fixed-position overlay that doesn't extend beyond viewport */}
               <div className={`fixed inset-0 ${overlayClass}`}></div>

               {/* Digital grid overlay with fixed position */}
               <div className="fixed inset-0 grid grid-cols-40 grid-rows-30 pointer-events-none">
                    {Array.from({ length: 1200 }).map((_, index) => (
                         <div
                              key={index}
                              className={`border border-[#00FFFF] ${enemyType === 'scriptKiddie' ? 'opacity-5' :
                                        enemyType === 'malwareBot' ? 'opacity-10' :
                                             enemyType === 'firewallGuardian' ? 'opacity-15' :
                                                  enemyType === 'dataCorruptor' ? 'opacity-20' :
                                                       enemyType === 'systemAdmin' ? 'opacity-25' : 'opacity-5'
                                   }`}
                         ></div>
                    ))}
               </div>

               {/* Content container with scrolling */}
               <div className="relative w-full min-h-screen overflow-auto">
                    {children}
               </div>
          </div>
     );
};

export default Background;
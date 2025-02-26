import React from 'react';

const ScoreDisplay = ({
     score = 0,
     multiplier = 1,
     showMultiplier = true
}) => {
     return (
          <div className="bg-[#0A0A23] border-2 border-[#00FFFF] p-2 rounded-sm flex flex-col items-center min-w-32">
               <div className="font-['VT323'] text-[#39FF14] text-lg mb-1">
                    SCORE
               </div>

               {/* Animated score counter */}
               <div className="font-['Press_Start_2P'] text-[#00FFFF] text-xl mb-1 tracking-wider">
                    {score.toLocaleString()}
               </div>

               {/* Score multiplier */}
               {showMultiplier && multiplier > 1 && (
                    <div className="font-['Share_Tech_Mono'] text-[#FF7700] text-xs">
                         x{multiplier.toFixed(1)} MULTIPLIER
                    </div>
               )}

               {/* Glowing border effect for high scores */}
               <div
                    className={`
          absolute inset-0 rounded-sm pointer-events-none
          ${score > 10000 ? 'animate-pulse opacity-20' : 'opacity-0'}
        `}
                    style={{
                         boxShadow: `0 0 15px ${score > 50000 ? '#FF7700' : '#00FFFF'}`,
                         transition: 'box-shadow 0.5s ease-in-out',
                    }}
               ></div>

               {/* Terminal flicker effect */}
               <div className="absolute inset-0 bg-[#00FFFF] opacity-0 animate-terminal-flicker pointer-events-none"></div>
          </div>
     );
};

export default ScoreDisplay;
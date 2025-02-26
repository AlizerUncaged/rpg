import React, { useState, useEffect } from 'react';

const HealthBar = ({
     currentHealth,
     maxHealth,
     label = "HEALTH",
     isPlayer = true,
     isHealing = false // New prop for healing animation
}) => {
     const [prevHealth, setPrevHealth] = useState(currentHealth);
     const [showHealing, setShowHealing] = useState(false);

     // Track health changes for animations
     useEffect(() => {
          // Check if health has increased (healing)
          if (currentHealth > prevHealth) {
               setShowHealing(true);
               const timer = setTimeout(() => setShowHealing(false), 1500);
               return () => clearTimeout(timer);
          }

          setPrevHealth(currentHealth);
     }, [currentHealth, prevHealth]);

     // Combine prop-based and state-based healing detection
     const isShowingHealing = isHealing || showHealing;

     const percentage = Math.max(0, Math.min(100, (currentHealth / maxHealth) * 100));

     // Color changes based on health percentage
     const getHealthColor = () => {
          if (percentage > 60) return '#39FF14'; // Lime green
          if (percentage > 30) return '#FF7700'; // Orange
          return '#FF0000'; // Red
     };

     return (
          <div className="mb-2 w-full">
               <div className="flex justify-between mb-1">
                    <span className="font-['Share_Tech_Mono'] text-[#39FF14] text-xs">
                         {label}
                    </span>
                    <span className="font-['Share_Tech_Mono'] text-[#39FF14] text-xs">
                         {currentHealth}/{maxHealth}
                    </span>
               </div>
               <div className={`w-full h-4 bg-[#0A0A23] border border-[#00FFFF] relative overflow-hidden`}>
                    {/* Health bar container */}
                    <div
                         className="h-full transition-all duration-300 ease-out"
                         style={{
                              width: `${percentage}%`,
                              backgroundColor: isShowingHealing ? '#39FF14' : getHealthColor(),
                              boxShadow: `0 0 10px ${isShowingHealing ? '#39FF14' : getHealthColor()}`,
                         }}
                    ></div>

                    {/* Grid overlay to create "digital" effect */}
                    <div className="absolute top-0 left-0 w-full h-full grid grid-cols-12 pointer-events-none">
                         {Array(12).fill(0).map((_, i) => (
                              <div key={i} className="border-r border-[#0A0A23] opacity-20 h-full"></div>
                         ))}
                    </div>

                    {/* Healing pulsing effect */}
                    {isShowingHealing && (
                         <div className="absolute top-0 left-0 w-full h-full bg-[#39FF14] opacity-30 animate-pulse"></div>
                    )}

                    {/* Glitch effect on low health */}
                    {percentage < 20 && (
                         <div className="absolute top-0 left-0 w-full h-full animate-glitch opacity-40 bg-red-500"></div>
                    )}
               </div>
          </div>
     );
};

export default HealthBar;
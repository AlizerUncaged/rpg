import React from 'react';

const EnergyBar = ({
     currentEnergy,
     maxEnergy,
     label = "ENERGY"
}) => {
     const percentage = Math.max(0, Math.min(100, (currentEnergy / maxEnergy) * 100));

     // Energy always glows in neon purple
     const energyColor = '#9D00FF';

     return (
          <div className="mb-2 w-full">
               <div className="flex justify-between mb-1">
                    <span className="font-['Share_Tech_Mono'] text-[#00FFFF] text-xs">
                         {label}
                    </span>
                    <span className="font-['Share_Tech_Mono'] text-[#00FFFF] text-xs">
                         {currentEnergy}/{maxEnergy}
                    </span>
               </div>
               <div className="w-full h-3 bg-[#0A0A23] border border-[#00FFFF] relative overflow-hidden">
                    {/* Energy bar */}
                    <div
                         className="h-full transition-all duration-300 ease-out"
                         style={{
                              width: `${percentage}%`,
                              backgroundColor: energyColor,
                              boxShadow: `0 0 8px ${energyColor}`,
                         }}
                    ></div>

                    {/* Digital circuit pattern overlay */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('/images/backgrounds/energy-pattern.png')] bg-repeat bg-cover pointer-events-none"></div>

                    {/* Energy pulses when full */}
                    {percentage === 100 && (
                         <div className="absolute top-0 left-0 w-full h-full animate-pulse opacity-60 bg-[#9D00FF]"></div>
                    )}
               </div>
          </div>
     );
};

export default EnergyBar;
import React from 'react';

const ActionButton = ({
     action,
     onClick,
     disabled = false,
     cooldown = 0,
     energyCost = 0,
     currentEnergy = 0
}) => {
     const isEnergyDisabled = energyCost > currentEnergy;
     const isDisabled = disabled || isEnergyDisabled || cooldown > 0;

     // Different styles based on action type
     const actionStyles = {
          attack: "bg-red-600 hover:bg-red-700 border-red-400",
          hack: "bg-[#00FFFF] hover:bg-[#00CCCC] border-[#00FFFF]",
          defend: "bg-blue-600 hover:bg-blue-700 border-blue-400",
          override: "bg-[#FF7700] hover:bg-[#CC5F00] border-[#FF7700]",
          item: "bg-[#39FF14] hover:bg-[#2DC010] border-[#39FF14]",
     };

     // Style for the specific action
     const actionStyle = actionStyles[action.type.toLowerCase()] || "bg-gray-600 hover:bg-gray-700 border-gray-400";

     // Apply disabled styles when applicable
     const buttonStyles = isDisabled
          ? `opacity-50 cursor-not-allowed ${actionStyle}`
          : `${actionStyle} cursor-pointer hover:shadow-[0_0_8px_rgba(0,255,255,0.7)]`;

     // Format damage display for the hover description
     const formatDamage = (damage) => {
          if (!damage) return "";
          if (typeof damage === 'object' && damage.min !== undefined && damage.max !== undefined) {
               return `${damage.min}-${damage.max}`;
          }
          return damage.toString();
     };

     return (
          <button
               onClick={onClick}
               disabled={isDisabled}
               className={`
        w-full py-3 px-4 
        rounded border-2 
        font-['Press_Start_2P'] text-xs
        text-white
        transition-all duration-150
        flex flex-col items-center justify-center
        relative
        ${buttonStyles}
      `}
          >
               {/* Action Name */}
               <span className="mb-1">{action.name}</span>

               {/* Energy Cost */}
               {energyCost > 0 && (
                    <span className={`text-[10px] ${isEnergyDisabled ? 'text-red-300' : 'text-[#00FFFF]'}`}>
                         Energy: {energyCost}
                    </span>
               )}

               {/* Cooldown Overlay */}
               {cooldown > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                         <span className="text-white text-lg font-bold">{cooldown}</span>
                    </div>
               )}

               {/* Terminal-style description on hover */}
               <div className="absolute bottom-full left-0 w-48 bg-[#0A0A23] border border-[#00FFFF] p-2 text-[10px] text-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none font-['Share_Tech_Mono']">
                    <div className="mb-1 text-[#00FFFF]">{action.name}</div>
                    <div className="mb-1">{action.description}</div>
                    {action.damage && <div>DMG: {formatDamage(action.damage)}</div>}
                    {energyCost > 0 && <div>Energy: {energyCost}</div>}
                    {action.cooldown > 0 && <div>Cooldown: {action.cooldown} turns</div>}
               </div>
          </button>
     );
};

export default ActionButton;
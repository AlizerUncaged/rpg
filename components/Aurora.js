import React, { useState, useEffect } from 'react';
import HealthBar from './ui/HealthBar';
import EnergyBar from './ui/EnergyBar';

const Aurora = ({
     health,
     maxHealth,
     energy,
     maxEnergy,
     statusEffects = [],
     isAttacking = false,
     isDefending = false,
     isHacking = false,
     isHealing = false,  // New prop for healing animation
     takingDamage = false,
     playerTurn = "",
     enemyType = ""  // New prop to customize animations based on enemy
}) => {
     const [animation, setAnimation] = useState('idle');
     const [showCriticalEffect, setShowCriticalEffect] = useState(false);
     const [showHealEffect, setShowHealEffect] = useState(false);
     const [lastHealth, setLastHealth] = useState(health);

     // Track health changes to show healing effect
     useEffect(() => {
          if (health > lastHealth) {
               // Health increased - show healing effect
               setShowHealEffect(true);
               setTimeout(() => setShowHealEffect(false), 1000);
          }
          setLastHealth(health);
     }, [health, lastHealth]);

     // Update animation based on props
     useEffect(() => {
          if (isAttacking) {
               // Different attack animations based on enemy type for variety
               setAnimation(enemyType === 'dataCorruptor' || enemyType === 'systemAdmin' ? 'attack-enhanced' : 'attack');
               const timer = setTimeout(() => setAnimation('idle'), 800);
               return () => clearTimeout(timer);
          } else if (isHacking) {
               setAnimation('hack');
               const timer = setTimeout(() => setAnimation('idle'), 800);
               return () => clearTimeout(timer);
          } else if (isHealing) {
               setAnimation('healing');
               setShowHealEffect(true);
               const timer = setTimeout(() => {
                    setAnimation('idle');
                    setShowHealEffect(false);
               }, 1000);
               return () => clearTimeout(timer);
          } else if (isDefending) {
               setAnimation('defend');
          } else if (takingDamage) {
               setAnimation('damage');
               // Randomly show critical hit effect for more dynamic visuals
               if (Math.random() > 0.7) {
                    setShowCriticalEffect(true);
                    setTimeout(() => setShowCriticalEffect(false), 400);
               }
               const timer = setTimeout(() => setAnimation('idle'), 400);
               return () => clearTimeout(timer);
          } else {
               setAnimation('idle');
          }
     }, [isAttacking, isDefending, isHacking, isHealing, takingDamage, enemyType]);

     // Animation class mapping with enhanced animations
     const animationClasses = {
          idle: "aurora-idle",
          attack: "aurora-attack",
          "attack-enhanced": "aurora-attack-enhanced",
          defend: "aurora-defend",
          hack: "aurora-hack",
          damage: "aurora-damage",
          healing: "quantum-repair"
     };

     // Status effect color mapping
     const getStatusEffectColor = (type) => {
          switch (type) {
               case 'buff': return '#39FF14';  // Lime green
               case 'debuff': return '#FF7700'; // Orange
               case 'shield': return '#00FFFF'; // Electric blue
               default: return '#FFFFFF';       // White
          }
     };

     // Determine if health is critically low
     const isHealthCritical = health <= maxHealth * 0.2;

     return (
          <div className="relative flex flex-col items-center">
               {/* Player indicator with enhanced float animation */}
               {playerTurn && (
                    <div className={`
                        absolute -top-10 left-1/2 transform -translate-x-1/2 z-20
                        font-['Press_Start_2P'] text-xs px-2 py-1 rounded float-ui
                        ${playerTurn === 'player1' ? 'bg-[#00FFFF] text-[#0A0A23]' : 'bg-[#9D00FF] text-white'}
                    `}>
                         {playerTurn === 'player1' ? 'PLAYER 1' : 'PLAYER 2'}
                    </div>
               )}

               {/* Status Effects Panel - Moved outside the character container */}
               {statusEffects.length > 0 && (
                    <div className="absolute -right-32 top-0 z-10 w-28 bg-[#0A0A23] bg-opacity-80 p-1 rounded border border-[#00FFFF]">
                         <div className="text-xs text-center text-[#00FFFF] font-['Share_Tech_Mono'] mb-1 border-b border-[#00FFFF] pb-1">
                              STATUS
                         </div>
                         <div className="flex flex-col gap-1">
                              {statusEffects.map((effect, index) => (
                                   <div
                                        key={index}
                                        className="text-xs font-['Share_Tech_Mono'] px-1 py-0.5 rounded-sm float-ui"
                                        style={{
                                             backgroundColor: `${getStatusEffectColor(effect.type)}20`, // 20 is hex for 12% opacity
                                             color: getStatusEffectColor(effect.type),
                                             border: `1px solid ${getStatusEffectColor(effect.type)}`
                                        }}
                                   >
                                        <div className="flex justify-between items-center">
                                             <span>{effect.name}</span>
                                             <span className="text-[10px] bg-[#0A0A23] px-1 rounded">{effect.duration}</span>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               )}

               {/* Character Container with Proper Z-index */}
               <div className="relative z-10">
                    {/* Character */}
                    <div className={`
                         w-32 h-48
                         relative
                         bg-[url('/images/aurora-sprite.png')] bg-no-repeat bg-contain
                         ${animationClasses[animation]}
                    `}>
                         {/* Shield effect when defending */}
                         {isDefending && (
                              <div className="absolute inset-0 rounded-full border-4 border-[#00FFFF] opacity-50 animate-pulse"></div>
                         )}

                         {/* Healing effect overlay */}
                         {showHealEffect && (
                              <div className="absolute inset-0 bg-gradient-to-t from-[#39FF14] to-transparent opacity-20 animate-pulse rounded-full"></div>
                         )}

                         {/* Hack effect */}
                         {isHacking && (
                              <div className="absolute inset-0 overflow-hidden">
                                   <div className="absolute inset-0 bg-[url('/images/code-overlay.png')] bg-repeat opacity-30 animate-slide-up"></div>
                              </div>
                         )}

                         {/* Damage effect */}
                         {takingDamage && (
                              <div className="absolute inset-0 bg-red-500 opacity-40 animate-flash"></div>
                         )}

                         {/* Critical hit flash */}
                         {showCriticalEffect && (
                              <div className="absolute inset-0 bg-white opacity-60 animate-flash"></div>
                         )}

                         {/* Low health warning effect */}
                         {isHealthCritical && (
                              <div className="absolute inset-0 border-2 border-red-500 animate-pulse opacity-70"></div>
                         )}
                    </div>

                    {/* Character Effects */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -mb-2">
                         {isHealing && (
                              <div className="flex justify-center">
                                   <div className="text-[#39FF14] text-xs font-['Share_Tech_Mono'] animate-float-up">
                                        +{Math.floor(maxHealth * 0.2)} HP
                                   </div>
                              </div>
                         )}
                    </div>
               </div>

               {/* Health and Energy Bars */}
               <div className="mt-4 w-48 z-10">
                    <HealthBar
                         currentHealth={health}
                         maxHealth={maxHealth}
                         label="AURORA HP"
                         isPlayer={true}
                         isHealing={showHealEffect}
                    />
                    <EnergyBar currentEnergy={energy} maxEnergy={maxEnergy} />
               </div>
          </div>
     );
};

export default Aurora;
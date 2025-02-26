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

     // Status effect visual indicators
     const renderStatusEffects = () => {
          return statusEffects.map((effect, index) => (
               <div
                    key={index}
                    className="absolute text-xs font-['Share_Tech_Mono'] px-1 py-0.5 rounded-sm float-ui"
                    style={{
                         top: `${index * 20 + 10}px`,
                         right: '5px',
                         backgroundColor: getStatusEffectColor(effect.type),
                         color: '#0A0A23',
                         border: '1px solid #00FFFF',
                         boxShadow: `0 0 5px ${getStatusEffectColor(effect.type)}`
                    }}
               >
                    {effect.name} ({effect.duration})
               </div>
          ));
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
                        absolute -top-10 left-1/2 transform -translate-x-1/2
                        font-['Press_Start_2P'] text-xs px-2 py-1 rounded float-ui
                        ${playerTurn === 'player1' ? 'bg-[#00FFFF] text-[#0A0A23]' : 'bg-[#9D00FF] text-white'}
                    `}>
                         {playerTurn === 'player1' ? 'PLAYER 1' : 'PLAYER 2'}
                    </div>
               )}

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
                         <div className="health-regen-effect"></div>
                    )}

                    {/* Hack effect */}
                    {isHacking && (
                         <div className="absolute inset-0 overflow-hidden">
                              <div className="absolute inset-0 bg-[url('/code-overlay.png')] bg-repeat opacity-30 animate-slide-up"></div>
                         </div>
                    )}

                    {/* Damage effect */}
                    {takingDamage && (
                         <div className="absolute inset-0 bg-red-500 opacity-40 animate-flash"></div>
                    )}

                    {/* Critical hit flash */}
                    {showCriticalEffect && (
                         <div className="critical-hit-flash"></div>
                    )}

                    {/* Status effects */}
                    {renderStatusEffects()}

                    {/* Low health warning effect */}
                    {isHealthCritical && (
                         <div className="absolute inset-0 border-2 border-red-500 animate-pulse opacity-70"></div>
                    )}
               </div>

               {/* Health and Energy Bars */}
               <div className="mt-4 w-48">
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
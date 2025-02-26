import React, { useState, useEffect } from 'react';
import HealthBar from './ui/HealthBar';

const Enemy = ({
     name,
     type,
     health,
     maxHealth,
     isAttacking = false,
     takingDamage = false,
     statusEffects = []
}) => {
     const [animation, setAnimation] = useState('idle');

     // Enemy type determines appearance and animation style
     const enemyTypes = {
          'scriptkiddie': {
               sprite: '/images/enemies/script-kiddie.png',
               attackAnim: 'enemy-attack-weak',
               damageAnim: 'enemy-damage-basic',
          },
          'malwarebot': {
               sprite: '/images/enemies/malware-bot.png',
               attackAnim: 'enemy-attack-medium',
               damageAnim: 'enemy-damage-glitch',
          },
          'firewallguardian': {
               sprite: '/images/enemies/firewall-guardian.png',
               attackAnim: 'enemy-attack-strong',
               damageAnim: 'enemy-damage-crack',
          },
          'datacorruptor': {
               sprite: '/images/enemies/data-corruptor.png',
               attackAnim: 'enemy-attack-corrupted',
               damageAnim: 'enemy-damage-heavy',
          },
          'systemadmin': {
               sprite: '/images/enemies/system-admin.png',
               attackAnim: 'enemy-attack-boss',
               damageAnim: 'enemy-damage-boss',
          }
     };

     // Ensure we have a valid enemy type or use default
     const enemyData = enemyTypes[type] || {
          sprite: '/images/enemies/default-enemy.png',
          attackAnim: 'enemy-attack-basic',
          damageAnim: 'enemy-damage-basic',
     };

     // Update animation based on props
     useEffect(() => {
          if (isAttacking) {
               setAnimation('attack');
               const timer = setTimeout(() => setAnimation('idle'), 600);
               return () => clearTimeout(timer);
          } else if (takingDamage) {
               setAnimation('damage');
               const timer = setTimeout(() => setAnimation('idle'), 400);
               return () => clearTimeout(timer);
          } else {
               setAnimation('idle');
          }
     }, [isAttacking, takingDamage]);

     // Get current animation class
     const getAnimationClass = () => {
          switch (animation) {
               case 'attack': return enemyData.attackAnim;
               case 'damage': return enemyData.damageAnim;
               default: return 'enemy-idle';
          }
     };

     // Filter visible status effects - only show the 2 most important ones
     const visibleStatusEffects = statusEffects
          .sort((a, b) => {
               // Prioritize debuffs first, then buffs, then others
               const getPriority = (effect) => {
                    if (effect.type === 'debuff' || effect.type.includes('down')) return 3;
                    if (effect.type === 'buff' || effect.type.includes('up')) return 2;
                    return 1;
               };
               return getPriority(b) - getPriority(a);
          })
          .slice(0, 2); // Only show top 2 effects

     return (
          <div className="relative flex flex-col items-center">
               {/* Enemy name indicator */}
               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2
        font-['VT323'] text-[#FF7700] text-lg
        bg-[#0A0A23] bg-opacity-80 px-2 py-1 rounded-lg border border-[#FF7700] shadow-md
      ">
                    {name.toUpperCase()}
               </div>

               {/* Enemy character */}

               <div
                    className={`
    w-52 h-64
    relative
    bg-center bg-no-repeat bg-contain
    ${getAnimationClass()}
    mb-2
  `}
                    style={{
                         backgroundImage: `url(${enemyData.sprite})`
                    }}
               >
                    {/* Digital damage effect */}
                    {takingDamage && (
                         <div className="absolute inset-0 bg-white opacity-40 animate-glitch"></div>
                    )}

                    {/* Status effects - Only show icons */}
                    <div className="absolute -left-2 top-0 flex flex-col gap-1">
                         {visibleStatusEffects.map((effect, index) => (
                              <div
                                   key={index}
                                   className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                                   style={{
                                        backgroundColor: getStatusEffectColor(effect.type),
                                        color: '#0A0A23',
                                        border: '1px solid #FF7700',
                                        boxShadow: `0 0 5px ${getStatusEffectColor(effect.type)}`
                                   }}
                                   title={`${effect.name} (${effect.remainingDuration} turns)`}
                              >
                                   {effect.remainingDuration}
                              </div>
                         ))}
                    </div>

                    {/* If there are more effects than we're showing, add a "+X more" indicator */}
                    {statusEffects.length > 2 && (
                         <div className="absolute -left-2 top-16 w-6 h-6 rounded-full flex items-center justify-center text-xs bg-[#0A0A23] text-white border border-[#FF7700]">
                              +{statusEffects.length - 2}
                         </div>
                    )}

                    {/* Enemy-specific effects */}
                    {type === 'datacorruptor' && (
                         <div className="absolute inset-0 bg-[url('/corruption-overlay.png')] bg-repeat bg-cover opacity-20 mix-blend-overlay"></div>
                    )}

                    {type === 'systemadmin' && (
                         <div className="absolute -inset-2 border-2 border-[#FF7700] animate-pulse opacity-50 rounded-lg"></div>
                    )}
               </div>

               {/* Health Bar */}
               <div className="w-40 bg-[#0A0A23] bg-opacity-75 p-2 rounded border border-[#FF7700]">
                    <HealthBar currentHealth={health} maxHealth={maxHealth} isPlayer={false} />
               </div>
          </div>
     );
};

// Status effect color mapping
const getStatusEffectColor = (type) => {
     switch (type) {
          case 'buff':
          case 'self_defense_up':
          case 'self_heal':
               return '#39FF14';  // Green for positive effects

          case 'debuff':
          case 'stun':
          case 'damage_over_time':
               return '#FF7700'; // Orange for negative effects

          case 'clear_buffs':
               return '#00FFFF'; // Cyan for cleansing effects

          default:
               return '#FFFFFF'; // White for unknown
     }
};

export default Enemy;
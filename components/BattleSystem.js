// components/BattleSystem.js - Completely updated version

import React, { useState, useEffect } from 'react';
import ActionButton from './ui/ActionButton';

const BattleSystem = ({
     gameState,
     playerActions,
     onPlayerAction,
     currentPlayer,
     aurora,
     enemy,
     turnNumber,
     onEndTurn,
     score,
     scoreMultiplier
}) => {
     const [selectedAction, setSelectedAction] = useState(null);
     const [isProcessing, setIsProcessing] = useState(false);
     const [showActionDetails, setShowActionDetails] = useState(false);
     const [showTurnInfo, setShowTurnInfo] = useState(false);

     // Filter actions based on current player
     const availableActions = playerActions.filter(
          action => action.player === currentPlayer
     );

     // Debug logging
     useEffect(() => {
          console.log("BattleSystem - Current player:", currentPlayer);
          console.log("BattleSystem - Available actions:", availableActions);
          console.log("BattleSystem - Current turn phase:", gameState.turnPhase);
     }, [currentPlayer, availableActions, gameState.turnPhase]);

     // Check if action is on cooldown

     const getActionCooldown = (actionId) => {
          // Make sure aurora and cooldowns exists before checking
          if (!aurora || !aurora.cooldowns) return 0;

          // Find the cooldown by name
          const cooldown = aurora.cooldowns[actionId];
          return cooldown || 0;
     };

     // Handle player action selection

     const handleActionSelect = async (action) => {
          setSelectedAction(action);
          setIsProcessing(true);
          setShowActionDetails(false);

          console.log("Player selected action:", action.name);

          // Execute the action
          await onPlayerAction(action);

          // CRITICAL FIX: Reset processing state ALWAYS after action
          setTimeout(() => {
               setSelectedAction(null);
               setIsProcessing(false);
          }, 500);
     };

     // Toggle between action list and details
     const toggleActionDetails = () => {
          setShowActionDetails(!showActionDetails);
     };

     // Toggle turn information panel
     const toggleTurnInfo = () => {
          setShowTurnInfo(!showTurnInfo);
     };

     // Get player name and role label
     const getPlayerInfo = () => {
          if (currentPlayer === 'player1') {
               return {
                    name: gameState.players.player1.name,
                    role: 'Offense',
                    color: 'text-[#00FFFF]',
                    actionLabel: 'ATTACK'
               };
          } else if (currentPlayer === 'player2') {
               return {
                    name: gameState.players.player2.name,
                    role: 'Defense',
                    color: 'text-[#9D00FF]',
                    actionLabel: 'DEFEND'
               };
          }
          return { name: 'Enemy', role: '', color: 'text-[#FF7700]', actionLabel: 'ATTACK' };
     };

     const playerInfo = getPlayerInfo();

     return (
          <div className="battle-system w-full max-w-3xl mx-auto">
               {/* Turn flow indicator */}
               <div className="flex justify-between items-center mb-2 px-4 py-1 bg-[#0A0A23] bg-opacity-70 rounded-md shadow-lg">
                    <div className="font-['VT323'] text-md text-[#00FFFF]">
                         ROUND {gameState.round} • TURN {gameState.turnCounter}
                    </div>

                    <div className="flex items-center gap-2">
                         <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-1 ${gameState.turnPhase === 'PLAYER1' ? 'bg-[#00FFFF]' : 'bg-gray-600'}`}></div>
                              <span className={`text-xs font-['Share_Tech_Mono'] ${gameState.turnPhase === 'PLAYER1' ? 'text-[#00FFFF]' : 'text-gray-400'}`}>P1</span>
                         </div>
                         <div className="font-['Share_Tech_Mono'] text-gray-400">→</div>
                         <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-1 ${gameState.turnPhase === 'PLAYER2' ? 'bg-[#9D00FF]' : 'bg-gray-600'}`}></div>
                              <span className={`text-xs font-['Share_Tech_Mono'] ${gameState.turnPhase === 'PLAYER2' ? 'text-[#9D00FF]' : 'text-gray-400'}`}>P2</span>
                         </div>
                         <div className="font-['Share_Tech_Mono'] text-gray-400">→</div>
                         <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-1 ${gameState.turnPhase === 'ENEMY' ? 'bg-[#FF7700]' : 'bg-gray-600'}`}></div>
                              <span className={`text-xs font-['Share_Tech_Mono'] ${gameState.turnPhase === 'ENEMY' ? 'text-[#FF7700]' : 'text-gray-400'}`}>Enemy</span>
                         </div>
                    </div>

                    <button
                         onClick={toggleTurnInfo}
                         className="text-[#39FF14] text-xs font-['Share_Tech_Mono'] bg-[#0A0A23] px-2 py-1 rounded hover:bg-opacity-70"
                    >
                         ?
                    </button>
               </div>

               {/* Turn Info Panel */}
               {showTurnInfo && (
                    <div className="bg-[#0A0A23] bg-opacity-90 p-3 rounded mb-2 text-sm font-['Share_Tech_Mono'] border border-[#39FF14]">
                         <h3 className="text-[#39FF14] mb-2 font-['VT323'] text-lg">Turn Flow:</h3>
                         <ol className="list-decimal pl-5 space-y-1">
                              <li className="text-[#00FFFF]">Player 1 (Offense) attacks the enemy</li>
                              <li className="text-[#9D00FF]">Player 2 (Defense) provides support or defense</li>
                              <li className="text-[#FF7700]">Enemy attacks Aurora</li>
                              <li className="text-white">Status effects are resolved and cooldowns reduced</li>
                         </ol>
                         <p className="mt-2 text-[#39FF14]">Each player must take an action or wait during their turn.</p>
                         <button
                              onClick={toggleTurnInfo}
                              className="mt-2 bg-[#0A0A23] border border-[#39FF14] text-[#39FF14] px-2 py-1 rounded w-full hover:bg-[#39FF14] hover:bg-opacity-20"
                         >
                              Close
                         </button>
                    </div>
               )}

               {/* Score display - Compact */}
               <div className="flex justify-end mb-2">
                    <div className="bg-[#0A0A23] bg-opacity-80 px-3 py-1 rounded border border-[#FF7700]">
                         <span className="font-['VT323'] text-[#FF7700]">SCORE: </span>
                         <span className="font-['Press_Start_2P'] text-sm text-[#00FFFF]">{gameState.totalScore.toLocaleString()}</span>
                         {scoreMultiplier > 1 && (
                              <span className="ml-1 font-['Share_Tech_Mono'] text-xs text-[#FF7700]">x{scoreMultiplier.toFixed(1)}</span>
                         )}
                    </div>
               </div>

               {/* Action buttons - Different for each player */}
               {(gameState.turnPhase === 'PLAYER1' || gameState.turnPhase === 'PLAYER2') && (
                    <div className="battle-controls bg-[#0A0A23] bg-opacity-80 p-3 rounded-lg shadow-lg border border-[#39FF14]">
                         {!showActionDetails ? (
                              <div className="grid grid-cols-2 gap-3">
                                   <div
                                        onClick={toggleActionDetails}
                                        className={`
                  cursor-pointer 
                  ${currentPlayer === 'player1' ?
                                                  'bg-gradient-to-br from-[#00FFFF] to-[#0088FF]' :
                                                  'bg-gradient-to-br from-[#9D00FF] to-[#7A00CC]'
                                             }
                  text-[#0A0A23] font-['Press_Start_2P'] p-3 rounded-md text-center shadow-inner 
                  hover:shadow-[0_0_10px_rgba(0,255,255,0.7)]
                `}
                                   >
                                        {playerInfo.actionLabel}
                                   </div>
                                   <div
                                        onClick={onEndTurn}
                                        className="cursor-pointer bg-gradient-to-br from-[#FF7700] to-[#FF5500] text-[#0A0A23] font-['Press_Start_2P'] p-3 rounded-md text-center shadow-inner hover:shadow-[0_0_10px_rgba(255,119,0,0.7)]"
                                   >
                                        WAIT
                                   </div>
                              </div>
                         ) : (
                              <div>
                                   {availableActions.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                             {availableActions.slice(0, 4).map(action => (
                                                  <ActionButton
                                                       key={action.name}
                                                       action={action}
                                                       onClick={() => handleActionSelect(action)}
                                                       disabled={
                                                            isProcessing ||
                                                            (action.energyCost > aurora.energy) ||   // Not enough energy
                                                            (getActionCooldown(action.name) > 0)     // On cooldown
                                                       }
                                                       cooldown={getActionCooldown(action.name)}
                                                       energyCost={action.energyCost || 0}
                                                       currentEnergy={aurora.energy}
                                                  />
                                             ))}
                                        </div>
                                   ) : (
                                        <div className="text-center py-4 text-[#FF7700] font-['Share_Tech_Mono']">
                                             No abilities available for this player
                                        </div>
                                   )}
                                   <button
                                        onClick={toggleActionDetails}
                                        className="w-full mt-2 bg-[#0A0A23] text-[#FF7700] border border-[#FF7700] p-1 rounded font-['Press_Start_2P'] text-xs hover:bg-[#FF7700] hover:text-[#0A0A23]"
                                   >
                                        BACK
                                   </button>
                              </div>
                         )}
                    </div>
               )}

               {/* Current player indicator */}
               <div className="mt-2 flex justify-center">
                    <div className={`bg-[#0A0A23] bg-opacity-80 px-3 py-1 rounded border ${currentPlayer === 'player1' ? 'border-[#00FFFF]' : currentPlayer === 'player2' ? 'border-[#9D00FF]' : 'border-[#FF7700]'} text-center`}>
                         <span className={`font-['Share_Tech_Mono'] text-xs ${playerInfo.color}`}>
                              {gameState.turnPhase === 'PLAYER1' ?
                                   `${gameState.players.player1.name}'s Turn (Offense)` :
                                   gameState.turnPhase === 'PLAYER2' ?
                                        `${gameState.players.player2.name}'s Turn (Defense)` :
                                        'Enemy Turn'}
                         </span>
                    </div>
               </div>
          </div>
     );
};

export default BattleSystem;
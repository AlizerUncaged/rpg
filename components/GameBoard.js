// components/GameBoard.js - Main game board visual component with enhanced cyberpunk design

import React, { useEffect, useState } from 'react';
import Aurora from './Aurora';
import Enemy from './Enemy';
import BattleSystem from './BattleSystem';
import ScoreTracker from './ScoreTracker';
import Image from 'next/image';

const GameBoard = ({
     gameState,
     playerActions,
     onPlayerAction,
     onEndTurn
}) => {
     // Calculate the current player's turn
     const currentPlayer =
          gameState.turnPhase === 'PLAYER1' ? 'player1' :
               gameState.turnPhase === 'PLAYER2' ? 'player2' : 'enemy';

     // Calculate score multiplier based on consecutive hits
     const scoreMultiplier = 1 + (Math.max(
          gameState.players.player1.consecutiveHits,
          gameState.players.player2.consecutiveHits
     ) * 0.1); // 0.1 per consecutive hit as defined in gameLogic.js

     // Add visual effects for battle actions
     const [showAttackEffect, setShowAttackEffect] = useState(false);
     const [showDefendEffect, setShowDefendEffect] = useState(false);
     const [showDamageEffect, setShowDamageEffect] = useState(false);

     // Monitor game state for action triggers
     useEffect(() => {
          if (gameState.turnPhase === 'PLAYER1' && gameState.actionInProgress) {
               setShowAttackEffect(true);
               setTimeout(() => setShowAttackEffect(false), 600);
          } else if (gameState.turnPhase === 'PLAYER2' && gameState.actionInProgress) {
               setShowDefendEffect(true);
               setTimeout(() => setShowDefendEffect(false), 600);
          } else if (gameState.turnPhase === 'ENEMY' && gameState.actionInProgress) {
               setShowDamageEffect(true);
               setTimeout(() => setShowDamageEffect(false), 600);
          }
     }, [gameState.turnPhase, gameState.actionInProgress]);

     return (
          <div className="game-board-container w-full max-w-6xl mx-auto relative">
               {/* Dynamic Battle Background */}
               <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-[#0A0A23] bg-opacity-90"></div>
                    <div className="absolute inset-0 bg-[url('/images/backgrounds/battle-background.png')] bg-cover bg-center opacity-40"></div>

                    {/* Grid overlay */}
                    <div className="absolute inset-0 grid grid-cols-40 grid-rows-30 pointer-events-none opacity-10">
                         {Array.from({ length: 1200 }).map((_, index) => (
                              <div key={index} className="border border-[#00FFFF]"></div>
                         ))}
                    </div>

                    {/* Moving code effect */}
                    <div className="absolute inset-0 overflow-hidden">
                         <div className="absolute inset-0 pointer-events-none opacity-10">
                              <div className="animate-terminal-typing text-[#39FF14] font-['Share_Tech_Mono'] text-[8px]">
                                   {'01'.repeat(5000)}
                              </div>
                         </div>
                    </div>
               </div>

               {/* Digital scan line effect */}
               <div className="absolute inset-0 pointer-events-none z-20 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FFFF10] to-transparent bg-size-200 animate-scanline"></div>
               </div>

               {/* Battle area */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                    {/* Player character (Aurora) */}
                    <div className="flex flex-col items-center justify-center p-4 
                         border-2 border-[#00FFFF] bg-[#0A0A23] bg-opacity-80 rounded-lg
                         shadow-[0_0_15px_rgba(0,255,255,0.5)] backdrop-blur-sm">
                         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#0A0A23] px-4 border border-[#00FFFF] text-[#00FFFF] font-['VT323'] text-lg z-10">
                              AURORA
                         </div>

                         <Aurora
                              health={gameState.aurora.health}
                              maxHealth={gameState.aurora.maxHealth}
                              energy={gameState.aurora.energy}
                              maxEnergy={gameState.aurora.maxEnergy}
                              statusEffects={gameState.aurora.statusEffects}
                              isAttacking={gameState.turnPhase === 'PLAYER1' && gameState.actionInProgress}
                              isDefending={gameState.turnPhase === 'PLAYER2' && gameState.actionInProgress}
                              isHacking={gameState.turnPhase === 'PLAYER1' && gameState.hackInProgress}
                              takingDamage={gameState.turnPhase === 'ENEMY' && gameState.actionInProgress}
                              playerTurn={currentPlayer === 'player1' || currentPlayer === 'player2' ? currentPlayer : ''}
                         />

                         {/* Attack effect overlay */}
                         {showAttackEffect && (
                              <div className="absolute inset-0 bg-[url('/images/code-overlay.png')] bg-repeat opacity-30 animate-pulse pointer-events-none"></div>
                         )}

                         {/* Defend effect overlay */}
                         {showDefendEffect && (
                              <div className="absolute inset-0 rounded-lg border-4 border-[#00FFFF] opacity-50 animate-pulse pointer-events-none"></div>
                         )}

                         {/* Damage effect overlay */}
                         {showDamageEffect && (
                              <div className="absolute inset-0 bg-red-500 opacity-20 animate-flash pointer-events-none"></div>
                         )}

                         {/* Player indicator */}
                         <div className="mt-4 font-['Share_Tech_Mono'] text-xs text-[#39FF14] bg-[#0A0A23] p-2 border border-[#39FF14] rounded">
                              CONTROLLED BY:
                              <span className="text-[#00FFFF] ml-1">
                                   {gameState.players.player1.name} (OFF) & {gameState.players.player2.name} (DEF)
                              </span>
                         </div>
                    </div>

                    {/* Battle info center column */}
                    <div className="flex flex-col justify-between">
                         {/* Round & turn info */}
                         <div className="text-center p-2 border-b-2 border-[#FF7700] bg-[#0A0A23] bg-opacity-80 rounded-t-lg">
                              <div className="font-['VT323'] text-xl text-[#FF7700]">
                                   ROUND {gameState.round}/5 - TURN {gameState.turnCounter}
                              </div>
                              <div className="font-['Share_Tech_Mono'] text-xs text-[#9D00FF]">
                                   {gameState.turnPhase === 'PLAYER1' ? `${gameState.players.player1.name}'S TURN` :
                                        gameState.turnPhase === 'PLAYER2' ? `${gameState.players.player2.name}'S TURN` :
                                             gameState.turnPhase === 'ENEMY' ? 'ENEMY TURN' : 'RESOLVING EFFECTS'}
                              </div>
                         </div>

                         {/* VS indicator */}
                         <div className="flex-grow flex items-center justify-center">
                              <div className="relative">
                                   <div className="font-['Press_Start_2P'] text-3xl text-[#FF7700]">VS</div>
                                   <div className="absolute -inset-8 border-2 border-[#FF7700] animate-pulse opacity-30"></div>

                                   {/* Connecting line effects */}
                                   <div className="absolute left-full top-1/2 h-px w-16 bg-gradient-to-r from-[#FF7700] to-transparent"></div>
                                   <div className="absolute right-full top-1/2 h-px w-16 bg-gradient-to-l from-[#FF7700] to-transparent"></div>
                              </div>
                         </div>

                         {/* Score tracker with enhanced design */}
                         <ScoreTracker
                              totalScore={gameState.totalScore}
                              currentRoundScore={gameState.battleStats.damageDealt * 10}
                              criticalHits={gameState.battleStats.criticalHits}
                              consecutiveHits={Math.max(
                                   gameState.players.player1.consecutiveHits,
                                   gameState.players.player2.consecutiveHits
                              )}
                              abilitiesUsed={gameState.battleStats.abilitiesUsed.size}
                              turnsElapsed={gameState.battleStats.turnsElapsed}
                         />
                    </div>

                    {/* Enemy character */}
                    <div className="flex flex-col items-center justify-center p-4 
                         border-2 border-red-500 bg-[#0A0A23] bg-opacity-80 rounded-lg
                         shadow-[0_0_15px_rgba(255,0,0,0.3)] backdrop-blur-sm">
                         <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#0A0A23] px-4 border border-red-500 text-red-500 font-['VT323'] text-lg z-10">
                              ENEMY
                         </div>

                         <Enemy
                              name={gameState.currentEnemy?.name || 'Enemy'}
                              type={Object.keys(gameState.currentEnemy || {}).length ?
                                   gameState.currentEnemy.name.replace(/\s+/g, '').toLowerCase() : 'unknown'}
                              health={gameState.currentEnemy?.currentHealth || 0}
                              maxHealth={gameState.currentEnemy?.stats?.health || 100}
                              isAttacking={gameState.turnPhase === 'ENEMY' && gameState.actionInProgress}
                              takingDamage={(gameState.turnPhase === 'PLAYER1' || gameState.turnPhase === 'PLAYER2') &&
                                   gameState.actionInProgress}
                              statusEffects={gameState.currentEnemy?.statusEffects || []}
                         />

                         {/* Attack effect overlay for enemy */}
                         {gameState.turnPhase === 'ENEMY' && gameState.actionInProgress && (
                              <div className="absolute inset-0 bg-[url('/images/corruption-overlay.png')] bg-repeat opacity-30 animate-pulse pointer-events-none"></div>
                         )}

                         {/* Damage effect overlay for enemy */}
                         {(gameState.turnPhase === 'PLAYER1' || gameState.turnPhase === 'PLAYER2') &&
                              gameState.actionInProgress && (
                                   <div className="absolute inset-0 bg-[#00FFFF] opacity-20 animate-glitch pointer-events-none"></div>
                              )}

                         {/* Enemy type indicator */}
                         <div className="mt-4 font-['Share_Tech_Mono'] text-xs text-red-400 bg-[#0A0A23] p-2 border border-red-400 rounded">
                              THREAT LEVEL:
                              <span className="text-red-500 font-bold ml-1">
                                   {gameState.round === 5 ? 'CRITICAL' :
                                        gameState.round === 4 ? 'HIGH' :
                                             gameState.round === 3 ? 'MODERATE' :
                                                  gameState.round === 2 ? 'LOW' : 'MINIMAL'}
                              </span>
                         </div>
                    </div>
               </div>

               {/* Battle system controls with enhanced visuals */}
               <div className="relative z-10">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00FFFF] via-[#9D00FF] to-[#FF7700] opacity-50 blur-sm rounded-lg"></div>

                    <div className="relative bg-[#0A0A23] bg-opacity-90 border border-[#39FF14] rounded-lg p-4">
                         <BattleSystem
                              gameState={gameState}
                              playerActions={playerActions}
                              onPlayerAction={onPlayerAction}
                              currentPlayer={currentPlayer}
                              aurora={gameState.aurora}
                              enemy={gameState.currentEnemy}
                              turnNumber={gameState.turnCounter}
                              onEndTurn={onEndTurn}
                              score={gameState.totalScore}
                              scoreMultiplier={scoreMultiplier}
                         />
                    </div>
               </div>

               {/* Digital circuitry decorative elements */}
               <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-20 z-0">
                    <div className="w-full h-full bg-[url('/images/energy-pattern.png')] bg-contain bg-no-repeat"></div>
               </div>
               <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none opacity-20 z-0">
                    <div className="w-full h-full bg-[url('/images/energy-pattern.png')] bg-contain bg-no-repeat transform rotate-180"></div>
               </div>
          </div>
     );
};

export default GameBoard;
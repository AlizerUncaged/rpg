// app/game/page.js - Enhanced with backgrounds and less text

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useGameState from '../../hooks/useGameState';
import useLocalStorage from '../../hooks/useLocalStorage';
import Aurora from '../../components/Aurora';
import Enemy from '../../components/Enemy';
import BattleSystem from '../../components/BattleSystem';
import Button from '../../components/ui/Button';
import Background from '../../components/ui/Background';

import { getAbilitiesByRole } from '../../lib/abilities';
import { GAME_CONSTANTS } from '../../lib/gameLogic';

export default function GamePage() {
     const router = useRouter();
     const { saveHighScore } = useLocalStorage();
     const [playerNames, setPlayerNames] = useState({ player1: '', player2: '' });
     const [showVictoryScreen, setShowVictoryScreen] = useState(false);
     const [showGameOverScreen, setShowGameOverScreen] = useState(false);
     const [showNextRoundScreen, setShowNextRoundScreen] = useState(false);
     const [isTransitioning, setIsTransitioning] = useState(false);

     const [showingEffects, setShowingEffects] = useState(false);
     const [enemyActionState, setEnemyActionState] = useState({
          isAttacking: false,
          isDamaging: false
     });

     // Initialize game state with player names
     const { gameState, handleAction, startNewGame, nextRound, setGamePhase } = useGameState(
          playerNames.player1,
          playerNames.player2
     );

     useEffect(() => {
          if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION) {
               // Show effects resolving
               setShowingEffects(true);

               // After a short delay, hide the effects indicator
               // This gives time for the user to see what's happening
               setTimeout(() => {
                    setShowingEffects(false);
               }, 1200);
          }
     }, [gameState.turnPhase]);
     // Load player names from localStorage on component mount
     useEffect(() => {
          try {
               const savedPlayers = JSON.parse(localStorage.getItem('auroraPlayers'));
               if (savedPlayers) {
                    setPlayerNames(savedPlayers);
                    startNewGame(savedPlayers.player1, savedPlayers.player2);
               } else {
                    // No player data found, redirect to start screen
                    router.push('/');
               }
          } catch (error) {
               console.error('Error loading player data:', error);
               router.push('/');
          }
     }, [router, startNewGame]);



     useEffect(() => {
          const handleEnemyTurn = () => {
               // Only process if it's enemy turn and we're in battle phase
               if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.ENEMY &&
                    gameState.phase === GAME_CONSTANTS.GAME_PHASES.BATTLE) {

                    console.log("Processing enemy turn");

                    // Force turn progression if it gets stuck
                    const stuckDetectionTimer = setTimeout(() => {
                         console.log("Checking if enemy turn is stuck");
                         // If we're still in enemy phase after timeout, force progression
                         if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.ENEMY) {
                              console.log("Enemy turn appears stuck, forcing progression");
                              setGameState(prevState => ({
                                   ...prevState,
                                   turnPhase: GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION,
                                   battleLog: [...prevState.battleLog, "Enemy appears confused and does nothing."]
                              }));
                         }
                    }, 3000); // 3 second stuck detection

                    return () => clearTimeout(stuckDetectionTimer);
               }
          };

          handleEnemyTurn();
     }, [gameState.turnPhase, gameState.phase]);


     useEffect(() => {
          console.log("Turn phase changed to:", gameState.turnPhase);
          console.log("Action in progress:", gameState.actionInProgress);

          // Log when enemy turn starts
          if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.ENEMY) {
               console.log("Enemy turn started");
          }

          // Log when effect resolution phase starts
          if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION) {
               console.log("Effect resolution phase started");
          }
     }, [gameState.turnPhase, gameState.actionInProgress]);

     // Watch for game phase changes to show appropriate screens
     useEffect(() => {
          if (gameState.phase === GAME_CONSTANTS.GAME_PHASES.VICTORY) {
               if (gameState.round >= GAME_CONSTANTS.MAX_ROUNDS) {
                    // Final round complete - show victory screen
                    setIsTransitioning(true);
                    setTimeout(() => {
                         setShowVictoryScreen(true);
                         setIsTransitioning(false);

                         // Save high score
                         saveHighScore(
                              gameState.players.player1.name,
                              gameState.players.player2.name,
                              gameState.totalScore
                         );
                    }, 1000);
               } else {
                    // Round complete - show next round screen
                    setIsTransitioning(true);
                    setTimeout(() => {
                         setShowNextRoundScreen(true);
                         setIsTransitioning(false);
                    }, 1000);
               }
          } else if (gameState.phase === GAME_CONSTANTS.GAME_PHASES.GAME_OVER) {
               // Game over
               setIsTransitioning(true);
               setTimeout(() => {
                    setShowGameOverScreen(true);
                    setIsTransitioning(false);

                    // Save high score even on defeat
                    saveHighScore(
                         gameState.players.player1.name,
                         gameState.players.player2.name,
                         gameState.totalScore
                    );
               }, 1000);
          }
     }, [gameState.phase, gameState.round, gameState.totalScore, gameState.players, saveHighScore]);
     useEffect(() => {
          // Check if it's the enemy's turn to attack
          if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.ENEMY) {
               // First show the enemy preparing to attack
               setEnemyActionState({
                    isAttacking: true,
                    isDamaging: false
               });

               // After a short delay, show the damage effect on Aurora
               setTimeout(() => {
                    setEnemyActionState({
                         isAttacking: true,
                         isDamaging: true
                    });

                    // Play sound effect if available (with safety check)
                    try {
                         const audio = new Audio('/sounds/enemy-attack.mp3');
                         audio.volume = 0.5;
                         audio.play().catch(err => {
                              // Silent catch - this handles browsers that block autoplay
                              console.log("Sound couldn't be played, likely due to browser autoplay policy");
                         });
                    } catch (error) {
                         // Sound file might not exist, just continue
                         console.log("Sound effect couldn't be played");
                    }

                    // Then reset the state after animation completes
                    setTimeout(() => {
                         setEnemyActionState({
                              isAttacking: false,
                              isDamaging: false
                         });
                    }, 800);
               }, 600);
          }
     }, [gameState.turnPhase]);

     // Handle player actions

     const handlePlayerAction = (action) => {
          // Safety check
          if (!action) {
               console.error("Action is undefined");
               return;
          }

          // Log for debugging
          console.log("Player action:", action);

          // Get player role and action type from the action - revised to use player property directly
          const playerRole = action.player;

          // Determine action type based on player (not the other way around)
          const actionType = playerRole === 'player1' ? 'attack' : 'defend';

          // Use action.name as the actionId
          const actionId = action.name;

          // Check if actionId exists
          if (!actionId) {
               console.error("Action name is missing", action);
               return;
          }

          // Now call the handleAction function with the correct parameters
          handleAction(playerRole, actionType, actionId);
     };

     // Handle proceeding to next round
     const handleNextRound = () => {
          setShowNextRoundScreen(false);
          setIsTransitioning(true);

          setTimeout(() => {
               nextRound();
               setIsTransitioning(false);
          }, 1000);
     };

     // Return to home screen
     const handleReturnHome = () => {
          router.push('/');
     };

     // Start a new game
     const handlePlayAgain = () => {
          setShowVictoryScreen(false);
          setShowGameOverScreen(false);
          setIsTransitioning(true);

          setTimeout(() => {
               startNewGame(playerNames.player1, playerNames.player2);
               setIsTransitioning(false);
          }, 1000);
     };


     const handleEndTurn = () => {
          // Simply call handleAction with 'skip' action type
          if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.PLAYER1) {
               handleAction('player1', 'skip', 'Wait');
          } else if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.PLAYER2) {
               handleAction('player2', 'skip', 'Wait');
          }
     };
     const getEnemyTypeForBackground = () => {
          if (!gameState.currentEnemy || !gameState.currentEnemy.name) return '';

          // Map enemy names to their background keys
          const enemyName = gameState.currentEnemy.name.toLowerCase();
          if (enemyName.includes('script')) return 'scriptKiddie';
          if (enemyName.includes('malware')) return 'malwareBot';
          if (enemyName.includes('firewall')) return 'firewallGuardian';
          if (enemyName.includes('corruptor')) return 'dataCorruptor';
          if (enemyName.includes('admin')) return 'systemAdmin';
          return '';
     };

     // Victory Screen
     if (showVictoryScreen) {
          return (
               <Background type="victory">
                    <div className="min-h-screen flex flex-col items-center justify-center p-4">
                         <div className="w-full max-w-lg p-6 border-4 border-[#00FFFF] bg-[#0A0A23] bg-opacity-90 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.5)]">
                              <h1 className="font-['VT323'] text-4xl text-[#39FF14] mb-3 text-center">SYSTEM OVERRIDE</h1>

                              <div className="mb-6 text-center">
                                   <div className="font-['Share_Tech_Mono'] text-xl text-[#00FFFF] mb-2">SCORE</div>
                                   <div className="font-['Press_Start_2P'] text-3xl text-[#FF7700] mb-3">{gameState.totalScore.toLocaleString()}</div>

                                   <div className="font-['Share_Tech_Mono'] text-sm text-[#39FF14]">
                                        {gameState.players.player1.name} & {gameState.players.player2.name} WIN!
                                   </div>
                              </div>

                              <div className="flex flex-wrap justify-center gap-3">
                                   <Button onClick={handlePlayAgain} type="primary">PLAY AGAIN</Button>
                                   <Button onClick={() => router.push('/highscores')} type="secondary">HIGH SCORES</Button>
                                   <Button onClick={handleReturnHome} type="accent">MAIN MENU</Button>
                              </div>
                         </div>
                    </div>
               </Background>
          );
     }

     // Game Over Screen
     if (showGameOverScreen) {
          return (
               <Background type="gameOver">
                    <div className="min-h-screen flex flex-col items-center justify-center p-4">
                         <div className="w-full max-w-lg p-6 border-4 border-red-500 bg-[#0A0A23] bg-opacity-90 rounded-lg shadow-[0_0_30px_rgba(255,0,0,0.5)]">
                              <h1 className="font-['VT323'] text-4xl text-red-500 mb-3 text-center">SYSTEM FAILURE</h1>

                              <div className="mb-6 text-center">
                                   <div className="font-['Press_Start_2P'] text-2xl text-[#FF7700] mb-3">{gameState.totalScore.toLocaleString()}</div>
                                   <div className="font-['Share_Tech_Mono'] text-sm text-red-400">
                                        AURORA DEFEATED
                                   </div>
                              </div>

                              <div className="flex flex-wrap justify-center gap-3">
                                   <Button onClick={handlePlayAgain} type="primary">TRY AGAIN</Button>
                                   <Button onClick={handleReturnHome} type="accent">MAIN MENU</Button>
                              </div>
                         </div>
                    </div>
               </Background>
          );
     }

     // Next Round Screen
     if (showNextRoundScreen) {
          return (
               <Background type="battle">
                    <div className="min-h-screen flex flex-col items-center justify-center p-4">
                         <div className="w-full max-w-lg p-6 border-4 border-[#9D00FF] bg-[#0A0A23] bg-opacity-90 rounded-lg shadow-[0_0_30px_rgba(157,0,255,0.5)]">
                              <h1 className="font-['VT323'] text-3xl text-[#9D00FF] mb-2 text-center">ENEMY DEFEATED!</h1>

                              <div className="mb-6 text-center">
                                   <div className="font-['Share_Tech_Mono'] text-xl text-[#00FFFF] mb-2">ROUND {gameState.round} CLEAR</div>
                                   <div className="font-['Press_Start_2P'] text-xl text-[#FF7700] mb-3">+{gameState.battleStats.damageDealt.toLocaleString()}</div>
                                   <div className="font-['Share_Tech_Mono'] text-sm text-[#39FF14]">NEXT ROUND APPROACHING...</div>
                              </div>

                              <div className="flex justify-center">
                                   <Button onClick={handleNextRound} type="accent">CONTINUE</Button>
                              </div>
                         </div>
                    </div>
               </Background>
          );
     }

     // Main Game Screen

     return (
          <Background
               type="battle"
               enemyType={getEnemyTypeForBackground()}
          >
               <div className={`min-h-screen flex flex-col p-4 transition-opacity duration-1000 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    {/* Game Header - With Enemy-Specific Styling */}
                    <div className={`
                         flex justify-between items-center mb-3 
                         bg-[#0A0A23] bg-opacity-75 p-2 rounded-lg
                         ${gameState.currentEnemy?.name?.includes('Corruptor') ? 'border border-purple-500' : ''}
                         ${gameState.currentEnemy?.name?.includes('Guardian') ? 'border border-blue-500' : ''}
                         ${gameState.currentEnemy?.name?.includes('Admin') ? 'border border-[#FF7700]' : ''}
                    `}>
                         <div className={`
                              font-['VT323'] text-xl
                              ${gameState.currentEnemy?.name?.includes('Script') ? 'text-[#00FFFF]' : ''}
                              ${gameState.currentEnemy?.name?.includes('Malware') ? 'text-red-400' : ''}
                              ${gameState.currentEnemy?.name?.includes('Guardian') ? 'text-blue-400' : ''}
                              ${gameState.currentEnemy?.name?.includes('Corruptor') ? 'text-purple-400' : ''}
                              ${gameState.currentEnemy?.name?.includes('Admin') ? 'text-[#FF7700]' : 'text-[#00FFFF]'}
                         `}>
                              ROUND {gameState.round} - {gameState.currentEnemy?.name?.toUpperCase()}
                         </div>
                         <div className="font-['Share_Tech_Mono'] text-sm text-[#39FF14]">
                              {gameState.players.player1.name} & {gameState.players.player2.name}
                         </div>
                    </div>

                    {/* Main Battle Area - More Visual Focus */}
                    <div className="flex-1 flex flex-col">
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              {/* Player Character (Aurora) - More Visual Space */}
                              <div className="flex justify-center items-center">
                                   <Aurora
                                        health={gameState.aurora.health}
                                        maxHealth={gameState.aurora.maxHealth}
                                        energy={gameState.aurora.energy}
                                        maxEnergy={gameState.aurora.maxEnergy}
                                        statusEffects={gameState.aurora.statusEffects}
                                        isAttacking={gameState.turnPhase === 'PLAYER1' && gameState.actionInProgress}
                                        isDefending={gameState.turnPhase === 'PLAYER2' && gameState.actionInProgress}
                                        isHacking={gameState.turnPhase === 'PLAYER1' && gameState.hackInProgress}
                                        // Add isHealing prop for healing animation
                                        isHealing={gameState.turnPhase === 'PLAYER2' && gameState.healInProgress}
                                        takingDamage={enemyActionState.isDamaging}
                                        playerTurn={
                                             gameState.turnPhase === 'PLAYER1' ? 'player1' :
                                                  gameState.turnPhase === 'PLAYER2' ? 'player2' : ''
                                        }
                                        // Pass enemy type for enemy-specific animations
                                        enemyType={gameState.currentEnemy?.name?.replace(/\s+/g, '')?.toLowerCase() || ''}
                                   />
                              </div>



                              {/* Battle Visual Center - VS Graphic */}
                              <div className="flex flex-col justify-center items-center">
                                   <div className="relative mb-2">
                                        <div className={`
                                             font-['Press_Start_2P'] text-3xl 
                                             ${gameState.currentEnemy?.name?.includes('Script') ? 'text-green-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Malware') ? 'text-red-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Guardian') ? 'text-blue-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Corruptor') ? 'text-purple-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Admin') ? 'text-[#FF7700]' : 'text-[#FF7700]'}
                                        `}>VS</div>
                                        <div className={`
                                             absolute -inset-4 border-2 animate-pulse opacity-30 rounded-full
                                             ${gameState.currentEnemy?.name?.includes('Script') ? 'border-green-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Malware') ? 'border-red-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Guardian') ? 'border-blue-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Corruptor') ? 'border-purple-500' : ''}
                                             ${gameState.currentEnemy?.name?.includes('Admin') ? 'border-[#FF7700]' : 'border-[#FF7700]'}
                                        `}></div>
                                   </div>

                                   {/* Turn Indicator */}
                                   <div className="bg-[#0A0A23] bg-opacity-80 p-2 rounded-md border border-[#00FFFF] w-36 text-center mb-2">
                                        <div className={`
                                             font-['Press_Start_2P'] text-xs
                                             ${gameState.turnPhase === 'PLAYER1' ? 'text-[#39FF14]' :
                                                  gameState.turnPhase === 'PLAYER2' ? 'text-[#9D00FF]' :
                                                       'text-[#FF7700]'}
                                        `}>
                                             {gameState.turnPhase === 'PLAYER1' ? 'OFFENSE' :
                                                  gameState.turnPhase === 'PLAYER2' ? 'DEFENSE' : 'ENEMY'}
                                        </div>
                                   </div>

                                   {/* Battle Log - with enemy-specific styling */}
                                   <div className={`
                                        w-full bg-[#0A0A23] bg-opacity-80 border rounded-md
                                        font-['Share_Tech_Mono'] text-sm text-[#39FF14]
                                        h-16 overflow-y-auto mt-1 p-2
                                        ${gameState.currentEnemy?.name?.includes('Script') ? 'border-green-500' : ''}
                                        ${gameState.currentEnemy?.name?.includes('Malware') ? 'border-red-500' : ''}
                                        ${gameState.currentEnemy?.name?.includes('Guardian') ? 'border-blue-500' : ''}
                                        ${gameState.currentEnemy?.name?.includes('Corruptor') ? 'border-purple-500' : ''}
                                        ${gameState.currentEnemy?.name?.includes('Admin') ? 'border-[#FF7700]' : 'border-[#00FFFF]'}
                                   `}>
                                        {gameState.battleLog && gameState.battleLog.length > 0 ? (
                                             <div className="flex flex-col h-full justify-end">
                                                  {gameState.battleLog.slice(-2).map((log, index) => (
                                                       <div
                                                            key={index}
                                                            className={`
                                                                 ${log.includes('damage') || log.includes('CRITICAL') ? 'text-red-500' : ''}
                                                                 ${log.includes(gameState.currentEnemy?.name || '') ? 'text-[#FF7700]' : ''}
                                                                 ${log.includes('Aurora') ? 'text-[#00FFFF]' : ''}
                                                                 ${log.includes('heal') || log.includes('Quantum Repair') ? 'text-[#39FF14]' : ''}
                                                            `}
                                                       >
                                                            {log}
                                                       </div>
                                                  ))}
                                             </div>
                                        ) : (
                                             <div className="text-gray-500 italic">Battle log will appear here...</div>
                                        )}
                                   </div>
                              </div>


                              {/* Enemy Character - with enemy-specific animations */}
                              <div className="flex justify-center items-center">
                                   <Enemy
                                        name={gameState.currentEnemy?.name || 'Enemy'}
                                        type={Object.keys(gameState.currentEnemy || {}).length ?
                                             gameState.currentEnemy.name.replace(/\s+/g, '').toLowerCase() : 'unknown'}
                                        health={gameState.currentEnemy?.currentHealth || 0}
                                        maxHealth={gameState.currentEnemy?.stats?.health || 100}
                                        isAttacking={enemyActionState.isAttacking}
                                        takingDamage={(gameState.turnPhase === 'PLAYER1' || gameState.turnPhase === 'PLAYER2') &&
                                             gameState.actionInProgress}
                                        statusEffects={gameState.currentEnemy?.statusEffects || []}
                                   />
                              </div>
                         </div>

                         {/* Battle Controls */}
                         <div className="mt-auto">
                              <BattleSystem
                                   gameState={gameState}
                                   playerActions={[
                                        // Map Player 1 (offensive) abilities correctly
                                        ...Object.values(getAbilitiesByRole('player1')).map(ability => ({
                                             ...ability,
                                             player: 'player1',
                                             type: 'offensive',
                                             id: ability.name
                                        })),
                                        // Map Player 2 (defensive) abilities correctly
                                        ...Object.values(getAbilitiesByRole('player2')).map(ability => ({
                                             ...ability,
                                             player: 'player2',
                                             type: 'defensive',
                                             id: ability.name
                                        }))
                                   ]}
                                   onPlayerAction={handlePlayerAction}
                                   currentPlayer={
                                        gameState.turnPhase === 'PLAYER1' ? 'player1' :
                                             gameState.turnPhase === 'PLAYER2' ? 'player2' : 'enemy'
                                   }
                                   aurora={gameState.aurora}
                                   enemy={gameState.currentEnemy}
                                   turnNumber={gameState.turnCounter}
                                   onEndTurn={handleEndTurn}
                                   score={gameState.totalScore}
                                   scoreMultiplier={1 + (Math.max(
                                        gameState.players.player1.consecutiveHits,
                                        gameState.players.player2.consecutiveHits
                                   ) * 0.1)}
                              />
                         </div>
                    </div>
               </div>
          </Background>
     );


}
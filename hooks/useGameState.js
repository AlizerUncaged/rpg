// hooks/useGameState.js
// Game state management with React hooks

import { useState, useEffect, useCallback } from 'react';
import { GAME_CONSTANTS, initializeGameState, processPlayerAction, progressToNextRound } from '../lib/gameLogic';
import { getEnemyByRound } from '../lib/enemies';
import { generateLootDrop } from '../lib/abilities';

const useGameState = (player1Name = '', player2Name = '') => {
     // Initialize game state
     const [gameState, setGameState] = useState(() =>
          initializeGameState(player1Name, player2Name)
     );

     // Update the handleAction function to reset actionInProgress flag:

     const handleAction = useCallback((player, actionType, actionId) => {
          setGameState(prevState => {
               // Set action in progress
               return {
                    ...prevState,
                    actionInProgress: true
               };
          });

          // Process the action with a slight delay for animation
          setTimeout(() => {
               setGameState(prevState => {
                    // Process the action
                    const newState = processPlayerAction(prevState, player, actionType, actionId);

                    // CRITICAL FIX: Always reset action flag
                    return {
                         ...newState,
                         actionInProgress: false
                    };
               });
          }, 500);
     }, []);

     useEffect(() => {
          // Check specifically for EFFECT_RESOLUTION phase that might be stuck
          if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION) {
               console.log("Detected EFFECT_RESOLUTION phase - ensuring progression");

               // Use a short timeout to allow any in-progress effects to complete
               const progressionTimer = setTimeout(() => {
                    // Force transition to player 1's turn if still in EFFECT_RESOLUTION
                    if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION) {
                         console.log("Force transitioning from EFFECT_RESOLUTION to PLAYER1");

                         setGameState(prevState => ({
                              ...prevState,
                              turnPhase: GAME_CONSTANTS.TURN_PHASES.PLAYER1,
                              actionInProgress: false,
                              battleLog: [
                                   ...prevState.battleLog,
                                   "Turn cycle completed. Player 1's turn begins."
                              ]
                         }));
                    }
               }, 1500); // Wait 1.5 seconds to ensure any animations complete

               return () => clearTimeout(progressionTimer);
          }
     }, [gameState.turnPhase]);
     useEffect(() => {
     // Ensure effect resolution phase properly processes cooldowns
     if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION) {
          console.log("Processing effect resolution phase");
          
          // Use a short delay to ensure animations complete
          const effectTimer = setTimeout(() => {
               setGameState(prevState => {
                    console.log("Current cooldowns:", prevState.aurora.cooldowns);
                    
                    // Make a copy of cooldowns for safe manipulation
                    const updatedCooldowns = { ...prevState.aurora.cooldowns };
                    
                    // Process cooldown reductions
                    Object.keys(updatedCooldowns).forEach(ability => {
                         if (updatedCooldowns[ability] > 0) {
                              updatedCooldowns[ability]--;
                              console.log(`Reduced cooldown for ${ability} to ${updatedCooldowns[ability]}`);
                         }
                    });
                    
                    return {
                         ...prevState,
                         turnPhase: GAME_CONSTANTS.TURN_PHASES.PLAYER1,
                         aurora: {
                              ...prevState.aurora,
                              cooldowns: updatedCooldowns
                         },
                         battleLog: [
                              ...prevState.battleLog,
                              "Turn cycle completed. Cooldowns reduced."
                         ]
                    };
               });
          }, 1000);
          
          return () => clearTimeout(effectTimer);
     }
}, [gameState.turnPhase]);

     useEffect(() => {
          // Check if it's time to process enemy action
          if (gameState.turnPhase === GAME_CONSTANTS.TURN_PHASES.ENEMY &&
               gameState.phase === GAME_CONSTANTS.GAME_PHASES.BATTLE) {

               console.log("Processing enemy turn");

               // Wait a moment before enemy attacks (for animation)
               const enemyTimer = setTimeout(() => {
                    // Import the missing functions explicitly at the top of your file
                    // import { processEnemyAction, processEffectResolution } from '../lib/gameLogic';

                    setGameState(prevState => {
                         // Process enemy action
                         const enemyActionState = processEnemyAction(prevState);

                         // Set a timer to process the effect resolution phase
                         setTimeout(() => {
                              console.log("Processing effect resolution phase");
                              setGameState(currentState => {
                                   const finalState = processEffectResolution(currentState);
                                   console.log("Turn should now be back to Player 1:", finalState.turnPhase);
                                   return finalState;
                              });
                         }, 1000);

                         return enemyActionState;
                    });
               }, 800);

               return () => clearTimeout(enemyTimer);
          }
     }, [gameState.turnPhase, gameState.phase]);

     // Start a new game
     const startNewGame = useCallback((player1Name, player2Name) => {
          setGameState(initializeGameState(player1Name, player2Name));
     }, []);

     // Progress to next round
     const nextRound = useCallback(() => {
          setGameState(prevState => progressToNextRound(prevState));
     }, []);

     // Set player names
     const setPlayerNames = useCallback((player1Name, player2Name) => {
          setGameState(prevState => ({
               ...prevState,
               players: {
                    ...prevState.players,
                    player1: {
                         ...prevState.players.player1,
                         name: player1Name
                    },
                    player2: {
                         ...prevState.players.player2,
                         name: player2Name
                    }
               }
          }));
     }, []);

     // Change game phase
     const setGamePhase = useCallback((phase) => {
          setGameState(prevState => ({
               ...prevState,
               phase
          }));
     }, []);

     // Reset cooldowns (for testing/debugging)
     const resetCooldowns = useCallback(() => {
          setGameState(prevState => ({
               ...prevState,
               aurora: {
                    ...prevState.aurora,
                    cooldowns: {}
               }
          }));
     }, []);

     // Listen for game over or victory
     useEffect(() => {
          if (gameState.phase === GAME_CONSTANTS.GAME_PHASES.GAME_OVER) {
               console.log('Game Over!');
               // Any game over effects could be triggered here
          } else if (gameState.phase === GAME_CONSTANTS.GAME_PHASES.VICTORY &&
               gameState.round === GAME_CONSTANTS.MAX_ROUNDS) {
               console.log('Game Complete!');
               // Any victory effects could be triggered here
          }
     }, [gameState.phase, gameState.round]);

     return {
          gameState,
          handleAction,
          startNewGame,
          nextRound,
          setPlayerNames,
          setGamePhase,
          resetCooldowns
     };
};

export default useGameState;

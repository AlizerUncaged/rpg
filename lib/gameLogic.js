// lib/gameLogic.js
// Contains core game logic, rules, and utilities

import { getEnemyByRound, getRandomEnemyAbility } from './enemies';
import { getAbilitiesByRole, calculateAbilityDamage } from './abilities';

// Game constants
export const GAME_CONSTANTS = {
     MAX_ROUNDS: 5,
     AURORA_BASE_STATS: {
          health: 100,
          maxHealth: 100,
          energy: 50,
          maxEnergy: 100,
          defense: 10,
          critChance: 0.15,
          dodgeChance: 0.10
     },
     GAME_PHASES: {
          START: 'START',
          PLAYER_SETUP: 'PLAYER_SETUP',
          BATTLE: 'BATTLE',
          VICTORY: 'VICTORY',
          GAME_OVER: 'GAME_OVER'
     },
     TURN_PHASES: {
          PLAYER1: 'PLAYER1',
          PLAYER2: 'PLAYER2',
          ENEMY: 'ENEMY',
          EFFECT_RESOLUTION: 'EFFECT_RESOLUTION'
     },
     ENERGY_REGEN_PER_TURN: 5,
     SCORE_MULTIPLIERS: {
          VICTORY_BASE: 100,
          HEALTH_REMAINING: 2,
          QUICK_BATTLE: 50, // Bonus per turn under par
          PAR_TURNS: 5, // Expected number of turns to complete a battle
          VARIETY_BONUS: 20, // Bonus per unique ability used
          CRITICAL_HIT: 10, // Bonus per critical hit
          CONSECUTIVE_SUCCESS: 0.1 // 10% increase per consecutive hit
     },
     WAIT_ACTION: {
          name: "Wait",
          description: "Skip this turn and regenerate some energy",
          energyCost: -5, // Negative value means it gives energy
          type: "skip",
          cooldown: 0
     }
};

// Initialize a new game state
export const initializeGameState = (player1Name, player2Name) => {
     return {
          phase: GAME_CONSTANTS.GAME_PHASES.PLAYER_SETUP,
          round: 1,
          turnPhase: GAME_CONSTANTS.TURN_PHASES.PLAYER1,
          turnCounter: 0,

          // Players information
          players: {
               player1: {
                    name: player1Name || 'Player 1',
                    role: 'offensive',
                    score: 0,
                    criticalHits: 0,
                    abilitiesUsed: new Set(),
                    consecutiveHits: 0
               },
               player2: {
                    name: player2Name || 'Player 2',
                    role: 'defensive',
                    score: 0,
                    abilitiesUsed: new Set(),
                    consecutiveHits: 0
               }
          },

          // Aurora character stats
          aurora: {
               ...GAME_CONSTANTS.AURORA_BASE_STATS,
               abilities: {
                    offensive: getAbilitiesByRole('player1'),
                    defensive: getAbilitiesByRole('player2')
               },
               statusEffects: [],
               cooldowns: {},
               shield: 0,
               availableItems: []
          },

          // Current enemy data
          currentEnemy: {
               ...getEnemyByRound(1),
               currentHealth: getEnemyByRound(1).stats.health,
               statusEffects: [],
               cooldowns: {}
          },

          // Battle statistics for scoring
          battleStats: {
               turnsElapsed: 0,
               damageDealt: 0,
               damageTaken: 0,
               criticalHits: 0,
               abilitiesUsed: new Set()
          },

          // Overall game score
          totalScore: 0,

          // Game logs for UI display
          battleLog: ["Battle begun! Player 1's turn."]
     };
};

// Process a player action
// Fix for the processPlayerAction function in gameLogic.js

// Modified processPlayerAction function for gameLogic.js

export const processPlayerAction = (gameState, player, actionType, actionId) => {
     // Make a copy of the game state to work with
     const newState = { ...gameState };
     let actionResult = {};

     // Safety checks
     if (!player || !actionType) {
          return {
               ...newState,
               battleLog: [...newState.battleLog, "Invalid action parameters."]
          };
     }

     // Special handling for skip/wait action
     if (actionType === 'skip') {
          // Add energy for waiting
          newState.aurora.energy = Math.min(
               newState.aurora.maxEnergy,
               newState.aurora.energy + 5
          );

          // Add to battle log
          const playerName = player === 'player1' ?
               newState.players.player1.name :
               newState.players.player2.name;

          actionResult = {
               logMessage: `${playerName} waits and regains energy.`
          };

          // Reset consecutive hits for waiting
          if (player === 'player1') {
               newState.players.player1.consecutiveHits = 0;
          } else {
               newState.players.player2.consecutiveHits = 0;
          }

          // Move to the next turn phase
          newState.turnPhase = getNextTurnPhase(newState.turnPhase);

          // If it's the enemy's turn now, process enemy action automatically
          if (newState.turnPhase === GAME_CONSTANTS.TURN_PHASES.ENEMY) {
               newState.battleLog = [...newState.battleLog, actionResult.logMessage];
               return processEnemyAction(newState);
          }

          // If it's the effect resolution phase, process status effects
          if (newState.turnPhase === GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION) {
               newState.battleLog = [...newState.battleLog, actionResult.logMessage];
               return processEffectResolution(newState);
          }

          newState.battleLog = [...newState.battleLog, actionResult.logMessage];
          return newState;
     }

     // Determine which ability set to use based on player
     const playerRole = player === 'player1' ? 'offensive' : 'defensive';
     const abilities = newState.aurora.abilities ? newState.aurora.abilities[playerRole] : null;

     // Safety check for abilities
     if (!abilities) {
          console.error(`Abilities not found for role: ${playerRole}`);
          return {
               ...newState,
               battleLog: [...newState.battleLog, `Error: No abilities found for ${playerRole} role.`]
          };
     }

     // Find the ability by its name instead of using it as a key
     // This is the key fix - we need to find the ability by name property
     const ability = Object.values(abilities).find(ability => ability.name === actionId);

     // Safety check for the ability
     if (!ability) {
          console.error(`Ability not found with name: ${actionId}`);
          return {
               ...newState,
               battleLog: [...newState.battleLog, `Error: Ability '${actionId}' not found.`]
          };
     }

     // Process different action types
     switch (actionType) {
          case 'attack':
               if (player === 'player1') {
                    actionResult = processAttack(newState, ability);
               } else {
                    return {
                         ...newState,
                         battleLog: [...newState.battleLog, "Invalid player for attack action."]
                    };
               }
               break;

          case 'defend':
               if (player === 'player2') {
                    actionResult = processDefend(newState, ability);
               } else {
                    return {
                         ...newState,
                         battleLog: [...newState.battleLog, "Invalid player for defend action."]
                    };
               }
               break;

          case 'item':
               actionResult = processItemUse(newState, actionId);
               break;

          default:
               // Invalid action
               return {
                    ...newState,
                    battleLog: [...newState.battleLog, "Invalid action selected."]
               };
     }

     // Record the ability used for score variety bonus
     if (actionType !== 'item' && newState.players && newState.players[player]) {
          if (!newState.players[player].abilitiesUsed) {
               newState.players[player].abilitiesUsed = new Set();
          }
          newState.players[player].abilitiesUsed.add(actionId);

          if (!newState.battleStats.abilitiesUsed) {
               newState.battleStats.abilitiesUsed = new Set();
          }
          newState.battleStats.abilitiesUsed.add(actionId);
     }

     // Add action result to battle log
     if (actionResult.logMessage) {
          newState.battleLog = [...newState.battleLog, actionResult.logMessage];
     }

     // Move to the next turn phase
     newState.turnPhase = getNextTurnPhase(newState.turnPhase);

     // If it's the enemy's turn now, process enemy action automatically
     if (newState.turnPhase === GAME_CONSTANTS.TURN_PHASES.ENEMY) {
          return processEnemyAction(newState);
     }

     // If it's the effect resolution phase, process status effects
     if (newState.turnPhase === GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION) {
          return processEffectResolution(newState);
     }

     return newState;
};

// Process an attack action
const processAttack = (gameState, ability) => {
     // Safety check: if ability is undefined, return with error message
     if (!ability) {
          console.error("Ability is undefined in processAttack");
          return {
               ...gameState,
               logMessage: "Error: Invalid ability selected."
          };
     }

     // Make sure cooldowns object exists before checking
     gameState.aurora.cooldowns = gameState.aurora.cooldowns || {};

     // Check if the ability is on cooldown
     if (gameState.aurora.cooldowns[ability.name] > 0) {
          return {
               ...gameState,
               logMessage: `${ability.name} is on cooldown for ${gameState.aurora.cooldowns[ability.name]} more turns.`
          };
     }

     // Check if Aurora has enough energy
     if (gameState.aurora.energy < ability.energyCost) {
          return {
               ...gameState,
               logMessage: `Not enough energy to use ${ability.name}. Need ${ability.energyCost} energy.`
          };
     }

     // Calculate damage with critical hit chance
     const { damage, isCritical } = calculateAbilityDamage(ability, gameState.aurora.critChance);

     // Check if enemy dodges
     const isDodged = Math.random() < gameState.currentEnemy.stats.dodgeChance;

     if (isDodged) {
          // Set cooldown for the ability
          gameState.aurora.cooldowns[ability.name] = ability.cooldown;

          // Use energy
          gameState.aurora.energy = Math.max(0, gameState.aurora.energy - ability.energyCost);

          // Reset consecutive hits
          gameState.players.player1.consecutiveHits = 0;

          return {
               ...gameState,
               logMessage: `${gameState.currentEnemy.name} dodged ${ability.name}!`
          };
     }

     // Calculate final damage after enemy defense
     let finalDamage = Math.max(1, damage - gameState.currentEnemy.stats.defense);

     // Apply damage to enemy
     gameState.currentEnemy.currentHealth = Math.max(0, gameState.currentEnemy.currentHealth - finalDamage);

     // Apply status effect if present
     if (ability.statusEffect) {
          gameState.currentEnemy.statusEffects.push({
               ...ability.statusEffect,
               name: ability.name,
               remainingDuration: ability.statusEffect.duration
          });
     }

     // Set cooldown for the ability
     gameState.aurora.cooldowns[ability.name] = ability.cooldown;

     // Use energy
     gameState.aurora.energy = Math.max(0, gameState.aurora.energy - ability.energyCost);

     // Update battle statistics
     gameState.battleStats.damageDealt += finalDamage;
     if (isCritical) {
          gameState.battleStats.criticalHits++;
          gameState.players.player1.criticalHits++;
     }

     // Increase consecutive hits
     gameState.players.player1.consecutiveHits++;

     // Check if enemy is defeated
     if (gameState.currentEnemy.currentHealth <= 0) {
          gameState.phase = GAME_CONSTANTS.GAME_PHASES.VICTORY;
     }

     const critText = isCritical ? "CRITICAL HIT! " : "";
     return {
          ...gameState,
          logMessage: `${critText}${ability.name} deals ${finalDamage} damage to ${gameState.currentEnemy.name}!`
     };
};


// Process a defend action
const processDefend = (gameState, ability) => {
     // Safety check
     if (!ability) {
          console.error("Ability is undefined in processDefend");
          return {
               ...gameState,
               logMessage: "Error: Invalid ability selected."
          };
     }

     // Check if the ability is on cooldown
     if (gameState.aurora.cooldowns[ability.name] > 0) {
          return {
               ...gameState,
               logMessage: `${ability.name} is on cooldown for ${gameState.aurora.cooldowns[ability.name]} more turns.`
          };
     }

     // Check if Aurora has enough energy
     if (gameState.aurora.energy < ability.energyCost) {
          return {
               ...gameState,
               logMessage: `Not enough energy to use ${ability.name}. Need ${ability.energyCost} energy.`
          };
     }

     // Ensure effect property exists
     if (!ability.effect) {
          console.error(`Ability ${ability.name} has no effect property`);
          return {
               ...gameState,
               logMessage: `Error: ${ability.name} has no effect.`
          };
     }

     // Apply the defensive ability effect
     let effectMessage = "";
     switch (ability.effect.type) {
          case 'defense_up':
               gameState.aurora.statusEffects.push({
                    type: 'defense_up',
                    value: ability.effect.value,
                    remainingDuration: ability.duration,
                    name: ability.name
               });
               effectMessage = `Defense increased by ${Math.round(ability.effect.value * 100)}% for ${ability.duration} turns`;
               break;

          case 'shield':
               gameState.aurora.shield += ability.effect.value;
               effectMessage = `Shield added for ${ability.effect.value} damage`;
               break;

          case 'heal':
               const healAmount = ability.effect.value;
               const oldHealth = gameState.aurora.health;
               gameState.aurora.health = Math.min(
                    gameState.aurora.maxHealth,
                    gameState.aurora.health + healAmount
               );
               const actualHeal = gameState.aurora.health - oldHealth;
               effectMessage = `Restored ${actualHeal} health`;
               break;

          case 'energy_restore':
               const energyAmount = ability.effect.value;
               const oldEnergy = gameState.aurora.energy;
               gameState.aurora.energy = Math.min(
                    gameState.aurora.maxEnergy,
                    gameState.aurora.energy + energyAmount
               );
               const actualEnergy = gameState.aurora.energy - oldEnergy;
               effectMessage = `Restored ${actualEnergy} energy`;
               break;

          case 'cooldown_reduction':
               // Reduce cooldowns for all abilities
               Object.keys(gameState.aurora.cooldowns).forEach(abilityName => {
                    if (gameState.aurora.cooldowns[abilityName] > 0) {
                         gameState.aurora.cooldowns[abilityName] = Math.max(
                              0,
                              gameState.aurora.cooldowns[abilityName] - ability.effect.value
                         );
                    }
               });
               effectMessage = `Reduced all cooldowns by ${ability.effect.value} turns`;
               break;

          case 'all_stats_up':
               // Add a status effect that increases all stats
               gameState.aurora.statusEffects.push({
                    type: 'all_stats_up',
                    value: ability.effect.value,
                    remainingDuration: ability.duration,
                    name: ability.name
               });
               effectMessage = `All stats increased by ${Math.round(ability.effect.value * 100)}% for ${ability.duration} turns`;
               break;

          default:
               effectMessage = `${ability.name} applied`;
               break;
     }

     // Set cooldown for the ability
     gameState.aurora.cooldowns[ability.name] = ability.cooldown;

     // Use energy
     gameState.aurora.energy = Math.max(0, gameState.aurora.energy - ability.energyCost);

     // Increase consecutive hits for scoring
     if (gameState.players && gameState.players.player2) {
          if (!gameState.players.player2.consecutiveHits) {
               gameState.players.player2.consecutiveHits = 0;
          }
          gameState.players.player2.consecutiveHits++;
     }

     return {
          ...gameState,
          logMessage: `${ability.name} used! ${effectMessage}`
     };
};


// Process using an item
const processItemUse = (gameState, itemId) => {
     // Find the item in available items
     const itemIndex = gameState.aurora.availableItems.findIndex(item => item.name === itemId);

     if (itemIndex === -1) {
          return {
               ...gameState,
               logMessage: `Item ${itemId} not found in inventory.`
          };
     }

     // Get the item
     const item = gameState.aurora.availableItems[itemIndex];

     // Apply the item effect
     switch (item.effect.type) {
          case 'clear_debuffs':
               // Remove all negative status effects from Aurora
               gameState.aurora.statusEffects = gameState.aurora.statusEffects.filter(
                    effect => !['damage_over_time', 'defense_down', 'energy_drain', 'stun', 'ability_block', 'ultimate_block'].includes(effect.type)
               );
               break;

          case 'ignore_defense':
               // Add a status effect that lets the next attack ignore defense
               gameState.aurora.statusEffects.push({
                    type: 'ignore_defense',
                    value: item.effect.value,
                    remainingDuration: 1,
                    name: item.name
               });
               break;

          case 'heal':
               // Heal Aurora
               gameState.aurora.health = Math.min(
                    gameState.aurora.maxHealth,
                    gameState.aurora.health + item.effect.value
               );
               break;

          case 'energy_restore':
               // Restore energy
               gameState.aurora.energy = Math.min(
                    gameState.aurora.maxEnergy,
                    gameState.aurora.energy + item.effect.value
               );
               break;
     }

     // Remove the used item from inventory
     gameState.aurora.availableItems.splice(itemIndex, 1);

     return {
          ...gameState,
          logMessage: `Used item: ${item.name}!`
     };
};

// Process enemy's turn

// Process enemy's turn
const processEnemyAction = (gameState) => {

     const newState = { ...gameState };

     // Check if enemy is stunned
     const isStunned = newState.currentEnemy.statusEffects.some(effect => effect.type === 'stun');
     if (isStunned) {
          // When enemy is stunned, add message and move to next phase
          return {
               ...newState,
               battleLog: [...newState.battleLog, `${newState.currentEnemy.name} is stunned and cannot act!`],
               turnPhase: GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION, // Always move to EFFECT_RESOLUTION
               actionInProgress: false // Make sure to reset action flag
          };
     }

     // Update cooldowns for enemy abilities
     if (newState.currentEnemy.cooldowns) {
          Object.keys(newState.currentEnemy.cooldowns).forEach(ability => {
               if (newState.currentEnemy.cooldowns[ability] > 0) {
                    newState.currentEnemy.cooldowns[ability]--;
               }
          });
     }

     // Get a random available ability
     let chosenAbility;
     if (newState.currentEnemy.abilities && newState.currentEnemy.abilities.length > 0) {
          // Filter available abilities (not on cooldown)
          const availableAbilities = newState.currentEnemy.abilities.filter(
               ability => !newState.currentEnemy.cooldowns ||
                    !newState.currentEnemy.cooldowns[ability.name] ||
                    newState.currentEnemy.cooldowns[ability.name] <= 0
          );

          if (availableAbilities.length > 0) {
               // Choose a random ability
               const randomIndex = Math.floor(Math.random() * availableAbilities.length);
               chosenAbility = availableAbilities[randomIndex];
          } else {
               // Fallback to basic attack if no abilities available
               chosenAbility = {
                    name: "Basic Attack",
                    description: "A standard attack",
                    damage: newState.currentEnemy.stats.damage,
                    cooldown: 0,
                    statusEffect: null
               };
          }
     } else {
          // Fallback if no abilities defined
          chosenAbility = {
               name: "Basic Attack",
               description: "A standard attack",
               damage: newState.currentEnemy.stats.damage,
               cooldown: 0,
               statusEffect: null
          };
     }

     // Calculate damage
     const baseDamage = Math.floor(
          Math.random() * (chosenAbility.damage.max - chosenAbility.damage.min + 1)
     ) + chosenAbility.damage.min;

     // Check for critical hit
     const isCritical = Math.random() < (newState.currentEnemy.stats.critChance || 0.15);
     let finalDamage = isCritical ? Math.floor(baseDamage * 1.5) : baseDamage;

     // Check if Aurora dodges
     const isDodged = Math.random() < (newState.aurora.dodgeChance || 0.1);
     if (isDodged) {
          // Set cooldown if ability used
          if (chosenAbility.name !== "Basic Attack" && newState.currentEnemy.cooldowns) {
               newState.currentEnemy.cooldowns[chosenAbility.name] = chosenAbility.cooldown;
          }

          // Always progress to next phase
          return {
               ...newState,
               battleLog: [...newState.battleLog, `Aurora dodged ${chosenAbility.name}!`],
               turnPhase: GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION // Move to next phase
          };
     }

     // Apply defense reduction if Aurora has defense effects
     const defenseBonus = newState.aurora.statusEffects
          .filter(effect => effect.type === 'defense_up')
          .reduce((total, effect) => total + effect.value, 0);

     finalDamage = Math.max(1, finalDamage - (newState.aurora.defense * (1 + defenseBonus)));

     // Apply damage to shield first if present
     let logMessage;
     if (newState.aurora.shield > 0) {
          if (newState.aurora.shield >= finalDamage) {
               // Shield absorbs all damage
               newState.aurora.shield -= finalDamage;
               logMessage = `Shield absorbs ${finalDamage} damage from ${chosenAbility.name}!`;
               finalDamage = 0;
          } else {
               // Shield absorbs part of the damage
               const absorbedDamage = newState.aurora.shield;
               finalDamage -= absorbedDamage;
               newState.aurora.shield = 0;
               logMessage = `Shield absorbs ${absorbedDamage} damage, Aurora takes ${finalDamage} damage from ${chosenAbility.name}!`;
          }
     } else {
          const critText = isCritical ? "CRITICAL HIT! " : "";
          logMessage = `${critText}${newState.currentEnemy.name} uses ${chosenAbility.name} for ${finalDamage} damage!`;
     }

     // Apply damage to Aurora
     newState.aurora.health = Math.max(0, newState.aurora.health - finalDamage);

     // Update battle statistics
     if (newState.battleStats) {
          newState.battleStats.damageTaken += finalDamage;
     }

     // Apply status effect if present
     if (chosenAbility.statusEffect) {
          newState.aurora.statusEffects.push({
               ...chosenAbility.statusEffect,
               name: chosenAbility.name,
               remainingDuration: chosenAbility.statusEffect.duration
          });

          logMessage += ` ${chosenAbility.statusEffect.type.replace(/_/g, ' ')} effect applied!`;
     }

     // Set cooldown for the ability if it's not a basic attack
     if (chosenAbility.name !== "Basic Attack" && newState.currentEnemy.cooldowns) {
          newState.currentEnemy.cooldowns[chosenAbility.name] = chosenAbility.cooldown;
     }

     // Check if Aurora is defeated
     if (newState.aurora.health <= 0) {
          newState.phase = GAME_CONSTANTS.GAME_PHASES.GAME_OVER;
          logMessage += " Aurora has been defeated!";
     }

     // ALWAYS progress to next phase, this is critical for turn flow
     return {
          ...newState,
          battleLog: [...newState.battleLog, logMessage], // Use the actual message we created
          turnPhase: GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION, // Always move to EFFECT_RESOLUTION
          actionInProgress: false // Make sure to reset action flag
     };
}

// 2. Update the processEffectResolution function to ensure it always moves back to PLAYER1
// In gameLogic.js
// Replace the processEffectResolution function with this corrected version

const processEffectResolution = (gameState) => {
     const newState = { ...gameState };
     const effectMessages = [];

     // Process Aurora's status effects
     if (newState.aurora.statusEffects) {
          newState.aurora.statusEffects = newState.aurora.statusEffects
               .map(effect => {
                    // Apply effect
                    switch (effect.type) {
                         case 'damage_over_time':
                              const dotDamage = effect.value;
                              newState.aurora.health = Math.max(0, newState.aurora.health - dotDamage);
                              effectMessages.push(`Aurora takes ${dotDamage} damage from ${effect.name}!`);
                              break;
                         case 'energy_drain':
                              const drainAmount = Math.min(newState.aurora.energy, effect.value);
                              newState.aurora.energy -= drainAmount;
                              effectMessages.push(`Aurora loses ${drainAmount} energy from ${effect.name}!`);
                              break;
                    }

                    // Decrease remaining duration
                    return {
                         ...effect,
                         remainingDuration: effect.remainingDuration - 1
                    };
               })
               .filter(effect => effect.remainingDuration > 0); // Remove expired effects
     }

     // Process enemy's status effects
     if (newState.currentEnemy && newState.currentEnemy.statusEffects) {
          newState.currentEnemy.statusEffects = newState.currentEnemy.statusEffects
               .map(effect => {
                    // Apply effect
                    switch (effect.type) {
                         case 'damage_over_time':
                              const dotDamage = effect.value;
                              newState.currentEnemy.currentHealth = Math.max(0, newState.currentEnemy.currentHealth - dotDamage);
                              effectMessages.push(`${newState.currentEnemy.name} takes ${dotDamage} damage from ${effect.name}!`);

                              // Update battle statistics
                              if (newState.battleStats) {
                                   newState.battleStats.damageDealt += dotDamage;
                              }
                              break;
                    }

                    // Decrease remaining duration
                    return {
                         ...effect,
                         remainingDuration: effect.remainingDuration - 1
                    };
               })
               .filter(effect => effect.remainingDuration > 0); // Remove expired effects
     }

     // Check if enemy is defeated by status effects
     if (newState.currentEnemy && newState.currentEnemy.currentHealth <= 0 &&
          newState.phase !== GAME_CONSTANTS.GAME_PHASES.GAME_OVER) {
          newState.phase = GAME_CONSTANTS.GAME_PHASES.VICTORY;
          effectMessages.push(`${newState.currentEnemy.name} has been defeated!`);
     }

     // Check if Aurora is defeated by status effects
     if (newState.aurora.health <= 0 && newState.phase !== GAME_CONSTANTS.GAME_PHASES.VICTORY) {
          newState.phase = GAME_CONSTANTS.GAME_PHASES.GAME_OVER;
          effectMessages.push("Aurora has been defeated!");
     }

     // If game is still in battle phase, prepare for the next turn
     if (newState.phase === GAME_CONSTANTS.GAME_PHASES.BATTLE) {
          // Regenerate energy
          newState.aurora.energy = Math.min(
               newState.aurora.maxEnergy,
               newState.aurora.energy + GAME_CONSTANTS.ENERGY_REGEN_PER_TURN
          );

          // Update cooldowns for Aurora's abilities
          if (newState.aurora.cooldowns) {
               Object.keys(newState.aurora.cooldowns).forEach(abilityName => {
                    if (newState.aurora.cooldowns[abilityName] > 0) {
                         newState.aurora.cooldowns[abilityName]--;
                    }
               });
          }

          // Increment turn counter
          if (newState.battleStats) {
               newState.battleStats.turnsElapsed++;
          }
          newState.turnCounter++;

          // CRITICAL FIX: Reset turn phase to PLAYER1
          newState.turnPhase = GAME_CONSTANTS.TURN_PHASES.PLAYER1;
          effectMessages.push("New turn begins. Player 1's turn.");
     }

     newState.turnPhase = GAME_CONSTANTS.TURN_PHASES.PLAYER1;
     newState.actionInProgress = false;

     // Add a clear message about the turn transition
     effectMessages.push("Effects resolved. Player 1's turn begins.");
     console.log("Transitioning to Player 1's turn");

     return {
          ...newState,
          battleLog: [...newState.battleLog, ...effectMessages]
     };
};
// Helper function to get the next turn phase
const getNextTurnPhase = (currentPhase) => {
     switch (currentPhase) {
          case GAME_CONSTANTS.TURN_PHASES.PLAYER1:
               return GAME_CONSTANTS.TURN_PHASES.PLAYER2;
          case GAME_CONSTANTS.TURN_PHASES.PLAYER2:
               return GAME_CONSTANTS.TURN_PHASES.ENEMY;
          case GAME_CONSTANTS.TURN_PHASES.ENEMY:
               return GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION;
          case GAME_CONSTANTS.TURN_PHASES.EFFECT_RESOLUTION:
               return GAME_CONSTANTS.TURN_PHASES.PLAYER1;
          default:
               return GAME_CONSTANTS.TURN_PHASES.PLAYER1;
     }
};

// Calculate score based on battle performance
export const calculateScore = (battleStats, playerStats) => {
     // Base score for victory
     let score = GAME_CONSTANTS.SCORE_MULTIPLIERS.VICTORY_BASE;

     // Bonus for health remaining
     score += battleStats.damageTaken * GAME_CONSTANTS.SCORE_MULTIPLIERS.HEALTH_REMAINING;

     // Bonus for quick battle (under par turns)
     const turnsDiff = Math.max(0, GAME_CONSTANTS.SCORE_MULTIPLIERS.PAR_TURNS - battleStats.turnsElapsed);
     score += turnsDiff * GAME_CONSTANTS.SCORE_MULTIPLIERS.QUICK_BATTLE;

     // Bonus for variety of abilities used
     score += battleStats.abilitiesUsed.size * GAME_CONSTANTS.SCORE_MULTIPLIERS.VARIETY_BONUS;

     // Bonus for critical hits
     score += battleStats.criticalHits * GAME_CONSTANTS.SCORE_MULTIPLIERS.CRITICAL_HIT;

     // Bonus for consecutive hits (average of both players)
     const consecutiveBonus = Math.max(
          playerStats.player1.consecutiveHits,
          playerStats.player2.consecutiveHits
     ) * GAME_CONSTANTS.SCORE_MULTIPLIERS.CONSECUTIVE_SUCCESS;

     score = Math.floor(score * (1 + consecutiveBonus));

     return score;
};

// Progress to the next round
export const progressToNextRound = (gameState) => {
     // Calculate score for the current round
     const roundScore = calculateScore(
          gameState.battleStats,
          { player1: gameState.players.player1, player2: gameState.players.player2 }
     );

     // Add to total score
     const totalScore = gameState.totalScore + roundScore;

     // Check if this was the final round
     if (gameState.round >= GAME_CONSTANTS.MAX_ROUNDS) {
          return {
               ...gameState,
               phase: GAME_CONSTANTS.GAME_PHASES.VICTORY,
               totalScore,
               battleLog: [
                    ...gameState.battleLog,
                    `Final round complete! Total score: ${totalScore}`
               ]
          };
     }

     // Set up the next round
     const nextRound = gameState.round + 1;
     const nextEnemy = getEnemyByRound(nextRound);

     return {
          ...gameState,
          phase: GAME_CONSTANTS.GAME_PHASES.BATTLE,
          round: nextRound,
          turnPhase: GAME_CONSTANTS.TURN_PHASES.PLAYER1,
          turnCounter: 0,

          // Restore some health and energy for Aurora
          aurora: {
               ...gameState.aurora,
               health: Math.min(
                    gameState.aurora.maxHealth,
                    gameState.aurora.health + (gameState.aurora.maxHealth * 0.3) // Restore 30% health
               ),
               energy: Math.min(
                    gameState.aurora.maxEnergy,
                    gameState.aurora.energy + (gameState.aurora.maxEnergy * 0.5) // Restore 50% energy
               ),
               statusEffects: [], // Clear status effects
               cooldowns: {} // Reset cooldowns
          },

          // Set up the new enemy
          currentEnemy: {
               ...nextEnemy,
               currentHealth: nextEnemy.stats.health,
               statusEffects: [],
               cooldowns: {}
          },

          // Reset battle statistics for the new round
          battleStats: {
               turnsElapsed: 0,
               damageDealt: 0,
               damageTaken: 0,
               criticalHits: 0,
               abilitiesUsed: new Set()
          },

          // Update total score
          totalScore,

          // Reset battle log
          battleLog: [`Round ${nextRound} begins! A ${nextEnemy.name} appears! Player 1's turn.`]
     };
};

// Save high score to local storage
export const saveHighScore = (playerNames, score) => {
     try {
          // Get existing high scores
          const existingScores = JSON.parse(localStorage.getItem('auroraHighScores') || '[]');

          // Add new score
          const newScore = {
               player1: playerNames.player1,
               player2: playerNames.player2,
               score,
               date: new Date().toISOString()
          };

          existingScores.push(newScore);

          // Sort by score (highest first) and keep top 10
          const sortedScores = existingScores
               .sort((a, b) => b.score - a.score)
               .slice(0, 10);

          // Save back to local storage
          localStorage.setItem('auroraHighScores', JSON.stringify(sortedScores));

          return sortedScores;
     } catch (error) {
          console.error('Error saving high score:', error);
          return [];
     }
};

// Get high scores from local storage
export const getHighScores = () => {
     try {
          return JSON.parse(localStorage.getItem('auroraHighScores') || '[]');
     } catch (error) {
          console.error('Error loading high scores:', error);
          return [];
     }
};
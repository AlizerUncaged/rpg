// lib/abilities.js
// Contains all character abilities for Aurora split by player role

// Player 1: Offensive Abilities
const offensiveAbilities = {
     // Basic Attack
     basicAttack: {
          name: "Data Breach",
          description: "A standard attack that deals damage based on Aurora's stats",
          energyCost: 0,
          damage: {
               min: 15,
               max: 25
          },
          cooldown: 0,
          statusEffect: null,
          animation: "attack",
          type: "offensive",
          sound: "/sounds/data-breach.mp3"
     },

     // Special Attacks
     codeInjection: {
          name: "Code Injection",
          description: "Inject malicious code that deals extra damage",
          energyCost: 15,
          damage: {
               min: 25,
               max: 35
          },
          cooldown: 2,
          statusEffect: null,
          animation: "code-injection",
          type: "offensive",
          sound: "/sounds/code-injection.mp3"
     },

     virusUpload: {
          name: "Virus Upload",
          description: "Upload a virus that deals damage over time",
          energyCost: 20,
          damage: {
               min: 15,
               max: 20
          },
          cooldown: 3,
          statusEffect: {
               type: "damage_over_time",
               duration: 3,
               value: 8 // 8 damage per turn for 3 turns
          },
          animation: "virus-upload",
          type: "offensive",
          sound: "/sounds/virus-upload.mp3"
     },

     bufferOverflow: {
          name: "Buffer Overflow",
          description: "Exploit a vulnerability for high damage with a chance to stun",
          energyCost: 30,
          damage: {
               min: 30,
               max: 45
          },
          cooldown: 4,
          statusEffect: {
               type: "stun",
               duration: 1,
               value: 0.3 // 30% chance to stun
          },
          animation: "buffer-overflow",
          type: "offensive",
          sound: "/sounds/buffer-overflow.mp3"
     },

     // Ultimate Ability (charges over time)
     systemReset: {
          name: "System Reset",
          description: "Powerful attack that resets all enemy buffs and deals massive damage",
          energyCost: 50,
          damage: {
               min: 50,
               max: 70
          },
          cooldown: 6,
          statusEffect: {
               type: "clear_buffs",
               duration: 1,
               value: null
          },
          animation: "system-reset",
          type: "ultimate",
          isUltimate: true,
          sound: "/sounds/system-reset.mp3"
     }
};

// Player 2: Defensive & Support Abilities
const defensiveAbilities = {
     // Basic Defend
     basicDefend: {
          name: "Firewall",
          description: "Raise defenses to reduce incoming damage",
          energyCost: 0,
          effect: {
               type: "defense_up",
               value: 0.5 // Reduces incoming damage by 50%
          },
          cooldown: 0,
          duration: 1,
          animation: "defend",
          type: "defensive",
          sound: "/sounds/firewall.mp3"
     },

     // Enhanced healing skill - NEW!
     quantumRepair: {
          name: "Quantum Repair",
          description: "Advanced healing algorithm that restores a significant amount of health",
          energyCost: 25,
          effect: {
               type: "heal",
               value: 45 // Heal 45 HP - more powerful than dataPatch
          },
          cooldown: 4,
          duration: 1,
          animation: "quantum-repair",
          type: "support",
          sound: "/sounds/quantum-repair.mp3"
     },

     energyRestore: {
          name: "Energy Restore",
          description: "Restore Aurora's energy reserves",
          energyCost: 0, // Free to use
          effect: {
               type: "energy_restore",
               value: 25 // Restore 25 energy
          },
          cooldown: 3,
          duration: 1,
          animation: "energy-restore",
          type: "support",
          sound: "/sounds/energy-restore.mp3"
     },

     dataPatch: {
          name: "Data Patch",
          description: "Repair damaged code to restore health",
          energyCost: 15,
          effect: {
               type: "heal",
               value: 30 // Heal 30 HP
          },
          cooldown: 3,
          duration: 1,
          animation: "data-patch",
          type: "support",
          sound: "/sounds/data-patch.mp3"
     },

     encryptedShield: {
          name: "Encrypted Shield",
          description: "Create a powerful shield that absorbs damage",
          energyCost: 25,
          effect: {
               type: "shield",
               value: 50 // Absorb up to 50 damage
          },
          cooldown: 4,
          duration: 2,
          animation: "encrypted-shield",
          type: "defensive",
          sound: "/sounds/encrypted-shield.mp3"
     },

     hackAcceleration: {
          name: "Hack Acceleration",
          description: "Boost Aurora's speed, reducing cooldowns on all abilities",
          energyCost: 20,
          effect: {
               type: "cooldown_reduction",
               value: 1 // Reduce all cooldowns by 1 turn
          },
          cooldown: 5,
          duration: 1,
          animation: "hack-acceleration",
          type: "support",
          sound: "/sounds/hack-acceleration.mp3"
     },

     // Ultimate Ability (charges over time)
     systemOverride: {
          name: "System Override",
          description: "Override the system to enhance all of Aurora's abilities",
          energyCost: 50,
          effect: {
               type: "all_stats_up",
               value: 0.5 // Increase all stats by 50%
          },
          cooldown: 6,
          duration: 3,
          animation: "system-override",
          type: "ultimate",
          isUltimate: true,
          sound: "/sounds/system-override.mp3"
     }
};


// Item abilities (picked up during gameplay)
const itemAbilities = {
     debugTool: {
          name: "Debug Tool",
          description: "Remove all negative status effects",
          effect: {
               type: "clear_debuffs",
               value: null
          },
          animation: "debug-tool",
          type: "item",
          sound: "/sounds/debug-tool.mp3"
     },

     backdoorAccess: {
          name: "Backdoor Access",
          description: "Bypass enemy defenses for the next attack",
          effect: {
               type: "ignore_defense",
               value: 1 // Ignore defense for 1 attack
          },
          animation: "backdoor-access",
          type: "item",
          sound: "/sounds/backdoor-access.mp3"
     },

     emergencyPatch: {
          name: "Emergency Patch",
          description: "Instantly restore 50 health",
          effect: {
               type: "heal",
               value: 50
          },
          animation: "emergency-patch",
          type: "item",
          sound: "/sounds/emergency-patch.mp3"
     },

     powerSurge: {
          name: "Power Surge",
          description: "Fully restore energy",
          effect: {
               type: "energy_restore",
               value: 100 // Full energy restore
          },
          animation: "power-surge",
          type: "item",
          sound: "/sounds/power-surge.mp3"
     }
};

// Helper function to get abilities by player role
export const getAbilitiesByRole = (role) => {
     if (role === 'player1') {
          return offensiveAbilities;
     } else if (role === 'player2') {
          return defensiveAbilities;
     }
     return {};
};

// Helper function to get item abilities
export const getItemAbilities = () => {
     return itemAbilities;
};

// Function to randomly generate a loot drop
export const generateLootDrop = () => {
     const items = Object.values(itemAbilities);
     const randomIndex = Math.floor(Math.random() * items.length);
     return items[randomIndex];
};

// Function to calculate ability damage with critical hit chance
export const calculateAbilityDamage = (ability, critChance = 0.15) => {
     const { min, max } = ability.damage;
     const baseDamage = Math.floor(Math.random() * (max - min + 1)) + min;

     // Check for critical hit
     const isCritical = Math.random() < critChance;
     const damageMultiplier = isCritical ? 1.5 : 1;

     return {
          damage: Math.floor(baseDamage * damageMultiplier),
          isCritical
     };
};

export default {
     offensive: offensiveAbilities,
     defensive: defensiveAbilities,
     items: itemAbilities
};
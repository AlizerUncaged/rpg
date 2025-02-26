// lib/enemies.js
// Contains data for all enemy types in the game

const enemies = {
     // ENEMY TYPE 1: Script Kiddies (Easy)
     scriptKiddie: {
          name: "Script Kiddie",
          description: "Novice hackers with basic skills, easily defeated but still dangerous in numbers.",
          sprite: "/images/enemies/script-kiddie.png",
          stats: {
               health: 50,
               damage: {
                    min: 5,
                    max: 10
               },
               defense: 3,
               critChance: 0.10,
               dodgeChance: 0.05
          },
          abilities: [
               {
                    name: "Copy-Paste Attack",
                    description: "Uses borrowed code for a weak attack",
                    damage: {
                         min: 8,
                         max: 15
                    },
                    cooldown: 0,
                    statusEffect: null
               },
               {
                    name: "DDoS Attempt",
                    description: "Tries to overload Aurora with requests",
                    damage: {
                         min: 12,
                         max: 20
                    },
                    cooldown: 2,
                    statusEffect: {
                         type: "slow",
                         duration: 1,
                         value: 0.2 // Reduces Aurora's speed by 20%
                    }
               }
          ],
          scoreValue: 100,
          dropChance: 0.3, // 30% chance to drop an item
     },

     // ENEMY TYPE 2: Malware Bots (Medium)
     malwareBot: {
          name: "Malware Bot",
          description: "Automated programs designed to corrupt data and steal information.",
          sprite: "/images/enemies/malware-bot.png",
          stats: {
               health: 80,
               damage: {
                    min: 8,
                    max: 15
               },
               defense: 5,
               critChance: 0.15,
               dodgeChance: 0.10
          },
          abilities: [
               {
                    name: "Data Corruption",
                    description: "Corrupts Aurora's data, causing damage over time",
                    damage: {
                         min: 5,
                         max: 10
                    },
                    cooldown: 3,
                    statusEffect: {
                         type: "damage_over_time",
                         duration: 2,
                         value: 5 // 5 damage per turn
                    }
               },
               {
                    name: "Trojan Horse",
                    description: "Sneaky attack that bypasses defenses",
                    damage: {
                         min: 15,
                         max: 25
                    },
                    cooldown: 4,
                    statusEffect: null
               }
          ],
          scoreValue: 200,
          dropChance: 0.4, // 40% chance to drop an item
     },

     // ENEMY TYPE 3: Firewall Guardians (Hard)
     firewallGuardian: {
          name: "Firewall Guardian",
          description: "Powerful security programs that protect valuable data.",
          sprite: "/images/enemies/firewall-guardian.png",
          stats: {
               health: 120,
               damage: {
                    min: 12,
                    max: 20
               },
               defense: 8,
               critChance: 0.15,
               dodgeChance: 0.15
          },
          abilities: [
               {
                    name: "Security Lockdown",
                    description: "Prevents Aurora from using special abilities",
                    damage: {
                         min: 10,
                         max: 15
                    },
                    cooldown: 4,
                    statusEffect: {
                         type: "ability_block",
                         duration: 1,
                         value: null
                    }
               },
               {
                    name: "Firewall Shield",
                    description: "Increases defense temporarily",
                    damage: {
                         min: 0,
                         max: 0
                    },
                    cooldown: 3,
                    statusEffect: {
                         type: "self_defense_up",
                         duration: 2,
                         value: 1.5 // 50% defense increase
                    }
               },
               {
                    name: "Security Breach Protocol",
                    description: "Heavy damage attack with a long cooldown",
                    damage: {
                         min: 25,
                         max: 35
                    },
                    cooldown: 5,
                    statusEffect: null
               }
          ],
          scoreValue: 300,
          dropChance: 0.5, // 50% chance to drop an item
     },

     // ENEMY TYPE 4: Data Corruptors (Very Hard)
     dataCorruptor: {
          name: "Data Corruptor",
          description: "Advanced malicious programs that can manipulate the digital environment.",
          sprite: "/images/enemies/data-corruptor.png",
          stats: {
               health: 150,
               damage: {
                    min: 15,
                    max: 25
               },
               defense: 10,
               critChance: 0.20,
               dodgeChance: 0.15
          },
          abilities: [
               {
                    name: "Memory Leak",
                    description: "Drains Aurora's energy",
                    damage: {
                         min: 10,
                         max: 15
                    },
                    cooldown: 3,
                    statusEffect: {
                         type: "energy_drain",
                         duration: 1,
                         value: 15 // Drains 15 energy
                    }
               },
               {
                    name: "Data Fragmentation",
                    description: "Deals damage and has a chance to decrease Aurora's defense",
                    damage: {
                         min: 15,
                         max: 25
                    },
                    cooldown: 4,
                    statusEffect: {
                         type: "defense_down",
                         duration: 2,
                         value: 0.7 // Reduces defense by 30%
                    }
               },
               {
                    name: "System Crash",
                    description: "Powerful attack that has a chance to stun Aurora",
                    damage: {
                         min: 30,
                         max: 40
                    },
                    cooldown: 6,
                    statusEffect: {
                         type: "stun",
                         duration: 1,
                         value: null
                    }
               }
          ],
          scoreValue: 400,
          dropChance: 0.6, // 60% chance to drop an item
     },

     // BOSS: System Admin (Final Boss)
     systemAdmin: {
          name: "System Admin",
          description: "The final boss, a powerful AI controlling the entire system.",
          sprite: "/images/enemies/system-admin.png",
          stats: {
               health: 250,
               damage: {
                    min: 20,
                    max: 30
               },
               defense: 15,
               critChance: 0.25,
               dodgeChance: 0.20
          },
          abilities: [
               {
                    name: "Root Access",
                    description: "Uses admin privileges to deal significant damage",
                    damage: {
                         min: 30,
                         max: 45
                    },
                    cooldown: 4,
                    statusEffect: null
               },
               {
                    name: "System Restore",
                    description: "Heals itself by restoring from backup",
                    damage: {
                         min: 0,
                         max: 0
                    },
                    cooldown: 5,
                    statusEffect: {
                         type: "self_heal",
                         duration: 1,
                         value: 50 // Heals 50 HP
                    }
               },
               {
                    name: "Permissions Denied",
                    description: "Blocks Aurora's most powerful ability",
                    damage: {
                         min: 15,
                         max: 25
                    },
                    cooldown: 5,
                    statusEffect: {
                         type: "ultimate_block",
                         duration: 2,
                         value: null
                    }
               },
               {
                    name: "System Purge",
                    description: "Ultimate attack that deals massive damage",
                    damage: {
                         min: 40,
                         max: 60
                    },
                    cooldown: 7,
                    statusEffect: {
                         type: "damage_over_time",
                         duration: 2,
                         value: 10 // 10 damage per turn
                    }
               }
          ],
          scoreValue: 1000,
          dropChance: 1.0, // 100% chance to drop an item (guaranteed)
     }
};

// Function to get enemies by round
export const getEnemyByRound = (round) => {
     switch (round) {
          case 1:
               return enemies.scriptKiddie;
          case 2:
               return enemies.malwareBot;
          case 3:
               return enemies.firewallGuardian;
          case 4:
               return enemies.dataCorruptor;
          case 5:
               return enemies.systemAdmin;
          default:
               return enemies.scriptKiddie;
     }
};

// Function to get a random enemy ability
export const getRandomEnemyAbility = (enemy) => {
     const availableAbilities = enemy.abilities.filter(ability => ability.cooldown === 0);
     if (availableAbilities.length === 0) {
          // If no abilities are available, return a basic attack
          return {
               name: "Basic Attack",
               description: "A standard attack",
               damage: enemy.stats.damage,
               cooldown: 0,
               statusEffect: null
          };
     }

     const randomIndex = Math.floor(Math.random() * availableAbilities.length);
     return availableAbilities[randomIndex];
};

export default enemies;
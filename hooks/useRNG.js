// hooks/useRNG.js
// Random number generator hook

import { useCallback } from 'react';

const useRNG = () => {
     // Generate a random integer between min and max (inclusive)
     const getRandomInt = useCallback((min, max) => {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
     }, []);

     // Roll a probability check (returns true if successful)
     const rollProbability = useCallback((probability) => {
          return Math.random() < probability;
     }, []);

     // Calculate damage with critical hit chance
     const calculateDamage = useCallback((minDamage, maxDamage, critChance = 0.15, critMultiplier = 1.5) => {
          const baseDamage = getRandomInt(minDamage, maxDamage);
          const isCritical = rollProbability(critChance);

          return {
               damage: isCritical ? Math.floor(baseDamage * critMultiplier) : baseDamage,
               isCritical
          };
     }, [getRandomInt, rollProbability]);

     // Check for dodge
     const checkDodge = useCallback((dodgeChance) => {
          return rollProbability(dodgeChance);
     }, [rollProbability]);

     // Select random item from array
     const getRandomItem = useCallback((items) => {
          if (!items || items.length === 0) return null;
          const index = getRandomInt(0, items.length - 1);
          return items[index];
     }, [getRandomInt]);

     // Generate loot drop based on probability
     const generateLootDrop = useCallback((items, dropChance) => {
          if (!rollProbability(dropChance)) {
               return null;
          }
          return getRandomItem(items);
     }, [rollProbability, getRandomItem]);

     // Weighted random selection
     const weightedRandom = useCallback((items, weightFn) => {
          const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
          let random = Math.random() * totalWeight;

          for (const item of items) {
               random -= weightFn(item);
               if (random <= 0) {
                    return item;
               }
          }

          // Fallback to first item (shouldn't happen normally)
          return items[0];
     }, []);

     return {
          getRandomInt,
          rollProbability,
          calculateDamage,
          checkDodge,
          getRandomItem,
          generateLootDrop,
          weightedRandom
     };
};

export default useRNG;
// hooks/useLocalStorage.js
// Custom hook for managing localStorage data

import { useState, useEffect, useCallback } from 'react';

// Constants
const HIGH_SCORES_KEY = 'auroraHighScores';
const SETTINGS_KEY = 'auroraSettings';
const MAX_HIGH_SCORES = 10;

const useLocalStorage = () => {
     const [isAvailable, setIsAvailable] = useState(false);

     // Check if localStorage is available
     useEffect(() => {
          try {
               const testKey = 'test_storage';
               localStorage.setItem(testKey, testKey);
               localStorage.removeItem(testKey);
               setIsAvailable(true);
          } catch (error) {
               console.error('LocalStorage is not available:', error);
               setIsAvailable(false);
          }
     }, []);

     // Save high score
     const saveHighScore = useCallback((player1, player2, score) => {
          if (!isAvailable) return false;

          try {
               // Get existing high scores
               const highScoresJSON = localStorage.getItem(HIGH_SCORES_KEY);
               const highScores = highScoresJSON ? JSON.parse(highScoresJSON) : [];

               // Add new score
               highScores.push({
                    player1,
                    player2,
                    score,
                    date: new Date().toISOString()
               });

               // Sort and limit to top scores
               const sortedScores = highScores
                    .sort((a, b) => b.score - a.score)
                    .slice(0, MAX_HIGH_SCORES);

               // Save back to localStorage
               localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(sortedScores));
               return true;
          } catch (error) {
               console.error('Error saving high score:', error);
               return false;
          }
     }, [isAvailable]);

     // Get high scores
     const getHighScores = useCallback(() => {
          if (!isAvailable) return [];

          try {
               const highScoresJSON = localStorage.getItem(HIGH_SCORES_KEY);
               return highScoresJSON ? JSON.parse(highScoresJSON) : [];
          } catch (error) {
               console.error('Error getting high scores:', error);
               return [];
          }
     }, [isAvailable]);

     // Save game settings
     const saveSettings = useCallback((settings) => {
          if (!isAvailable) return false;

          try {
               localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
               return true;
          } catch (error) {
               console.error('Error saving settings:', error);
               return false;
          }
     }, [isAvailable]);

     // Get game settings
     const getSettings = useCallback(() => {
          if (!isAvailable) {
               return getDefaultSettings();
          }

          try {
               const settingsJSON = localStorage.getItem(SETTINGS_KEY);
               return settingsJSON ? JSON.parse(settingsJSON) : getDefaultSettings();
          } catch (error) {
               console.error('Error getting settings:', error);
               return getDefaultSettings();
          }
     }, [isAvailable]);

     // Get default settings
     const getDefaultSettings = useCallback(() => {
          return {
               soundEnabled: true,
               musicEnabled: true,
               difficulty: 'normal',
               animationsEnabled: true
          };
     }, []);

     return {
          isAvailable,
          saveHighScore,
          getHighScores,
          saveSettings,
          getSettings
     };
};

export default useLocalStorage;
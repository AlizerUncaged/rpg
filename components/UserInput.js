import React, { useState, useEffect } from 'react';
import Button from './ui/Button';

const UserInput = ({ onSubmit, isGameStarting }) => {
     const [player1Name, setPlayer1Name] = useState('');
     const [player2Name, setPlayer2Name] = useState('');
     const [showTutorial, setShowTutorial] = useState(false);
     const [tutorialPage, setTutorialPage] = useState(1);
     const [inputError, setInputError] = useState('');
     const [isFormValid, setIsFormValid] = useState(false);

     // Reset error when input changes
     useEffect(() => {
          setInputError('');
          // Form is valid when both players have names
          setIsFormValid(player1Name.trim() !== '' && player2Name.trim() !== '');
     }, [player1Name, player2Name]);

     // Handle form submission
     const handleSubmit = (e) => {
          e.preventDefault();

          // Validate inputs
          if (player1Name.trim() === '' || player2Name.trim() === '') {
               setInputError('Both player names are required');
               return;
          }

          // Submit player names to parent component
          onSubmit(player1Name, player2Name);
     };

     // Tutorial content
     const tutorialContent = [
          {
               title: "WELCOME TO AURORA'S OVERRIDE",
               content: "Aurora's Override is a turn-based RPG where two players control a single character named Aurora as they navigate through a digital landscape filled with cyber threats.",
               image: "/tutorial/tutorial-1.png"
          },
          {
               title: "PLAYER ROLES",
               content: "Player 1 controls offensive actions and attacks enemies. Player 2 handles defensive moves and support abilities. Work together for maximum effectiveness!",
               image: "/tutorial/tutorial-2.png"
          },
          {
               title: "TURN-BASED COMBAT",
               content: "Combat is turn-based. First Player 1 acts, then Player 2, then the enemy attacks, and status effects are resolved. Each player must choose their actions wisely.",
               image: "/tutorial/tutorial-3.png"
          },
          {
               title: "ABILITIES & ENERGY",
               content: "Aurora has various abilities that cost energy to use. Energy regenerates each turn. Stronger abilities have cooldowns between uses.",
               image: "/tutorial/tutorial-4.png"
          },
          {
               title: "SCORE SYSTEM",
               content: "Score points by defeating enemies quickly, maintaining high health, using a variety of abilities, and landing critical hits. Consecutive successful actions increase your score multiplier!",
               image: "/tutorial/tutorial-5.png"
          }
     ];

     return (
          <div className="user-input-container max-w-md mx-auto">
               {/* Tutorial Overlay */}
               {showTutorial && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                         <div className="bg-[#0A0A23] border-2 border-[#00FFFF] p-6 max-w-lg relative">
                              {/* Close button */}
                              <button
                                   onClick={() => setShowTutorial(false)}
                                   className="absolute top-2 right-2 text-[#FF7700] hover:text-white"
                              >
                                   X
                              </button>

                              {/* Tutorial content */}
                              <div className="text-center mb-6">
                                   <h2 className="font-['VT323'] text-2xl text-[#00FFFF] mb-4">
                                        {tutorialContent[tutorialPage - 1].title}
                                   </h2>

                                   {/* Tutorial image */}
                                   <div className="mb-4 h-48 flex items-center justify-center">
                                        <div className="w-64 h-48 bg-[#0A0A23] border border-[#39FF14] flex items-center justify-center">
                                             <div className="text-[#39FF14] font-['Share_Tech_Mono']">
                                                  [Tutorial Image: {tutorialContent[tutorialPage - 1].image}]
                                             </div>
                                        </div>
                                   </div>

                                   <p className="font-['Share_Tech_Mono'] text-[#39FF14] mb-6">
                                        {tutorialContent[tutorialPage - 1].content}
                                   </p>
                              </div>

                              {/* Navigation buttons */}
                              <div className="flex justify-between">
                                   <Button
                                        onClick={() => setTutorialPage(Math.max(1, tutorialPage - 1))}
                                        disabled={tutorialPage === 1}
                                        type="secondary"
                                        size="small"
                                   >
                                        &lt; PREV
                                   </Button>

                                   <div className="font-['Share_Tech_Mono'] text-[#00FFFF]">
                                        {tutorialPage} / {tutorialContent.length}
                                   </div>

                                   {tutorialPage < tutorialContent.length ? (
                                        <Button
                                             onClick={() => setTutorialPage(tutorialPage + 1)}
                                             type="secondary"
                                             size="small"
                                        >
                                             NEXT &gt;
                                        </Button>
                                   ) : (
                                        <Button
                                             onClick={() => setShowTutorial(false)}
                                             type="accent"
                                             size="small"
                                        >
                                             START GAME
                                        </Button>
                                   )}
                              </div>
                         </div>
                    </div>
               )}

               {/* Player Input Form */}
               <form onSubmit={handleSubmit} className="bg-[#0A0A23] border-2 border-[#00FFFF] p-6 relative">
                    {/* Digital terminal appearance */}
                    <div className="absolute top-0 left-0 w-full h-8 bg-[#0A0A23] border-b border-[#00FFFF] flex items-center px-2">
                         <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                         <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                         <div className="flex-1 text-center font-['Share_Tech_Mono'] text-xs text-[#00FFFF]">
                              aurora_login.exe
                         </div>
                    </div>

                    <div className="mt-8">
                         <h2 className="font-['VT323'] text-3xl text-[#FF7700] mb-6 text-center">
                              AURORA'S OVERRIDE
                         </h2>

                         <div className="mb-6 font-['Share_Tech_Mono'] text-[#00FFFF] text-center text-sm">
                              Enter player names to begin the mission
                         </div>

                         {/* Player 1 Input */}
                         <div className="mb-4">
                              <label className="block font-['VT323'] text-lg text-[#39FF14] mb-1">
                                   PLAYER 1 (OFFENSE)
                              </label>
                              <input
                                   type="text"
                                   value={player1Name}
                                   onChange={(e) => setPlayer1Name(e.target.value)}
                                   placeholder="Enter name"
                                   className="
                w-full px-3 py-2
                bg-[#0A0A23] 
                border-2 border-[#39FF14]
                text-[#39FF14] 
                font-['Share_Tech_Mono']
                placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-[#00FFFF]
              "
                                   disabled={isGameStarting}
                              />
                         </div>

                         {/* Player 2 Input */}
                         <div className="mb-6">
                              <label className="block font-['VT323'] text-lg text-[#9D00FF] mb-1">
                                   PLAYER 2 (DEFENSE)
                              </label>
                              <input
                                   type="text"
                                   value={player2Name}
                                   onChange={(e) => setPlayer2Name(e.target.value)}
                                   placeholder="Enter name"
                                   className="
                w-full px-3 py-2
                bg-[#0A0A23] 
                border-2 border-[#9D00FF]
                text-[#9D00FF] 
                font-['Share_Tech_Mono']
                placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-[#00FFFF]
              "
                                   disabled={isGameStarting}
                              />
                         </div>

                         {/* Error Message */}
                         {inputError && (
                              <div className="mb-4 text-red-500 font-['Share_Tech_Mono'] text-center">
                                   {inputError}
                              </div>
                         )}

                         {/* Button Container */}
                         <div className="flex justify-between">
                              <Button
                                   type="secondary"
                                   onClick={() => setShowTutorial(true)}
                                   disabled={isGameStarting}
                              >
                                   TUTORIAL
                              </Button>

                              <Button
                                   type="primary"
                                   onClick={handleSubmit}
                                   disabled={!isFormValid || isGameStarting}
                              >
                                   {isGameStarting ? 'INITIALIZING...' : 'START MISSION'}
                              </Button>
                         </div>

                         {/* Terminal Animation */}
                         <div className="mt-6 text-[#39FF14] font-['Share_Tech_Mono'] text-xs h-16 overflow-hidden">
                              <div className="animate-terminal-typing">
                                   &gt; system.initialize()<br />
                                   &gt; loading.players()<br />
                                   &gt; aurora.connect()<br />
                                   &gt; security.bypass()<br />
                                   &gt; mission.start()<br />
                              </div>
                         </div>
                    </div>
               </form>
          </div>
     );
};

export default UserInput;
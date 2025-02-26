import React, { useState, useEffect } from 'react';

const ScoreTracker = ({
  totalScore,
  currentRoundScore,
  criticalHits,
  consecutiveHits,
  abilitiesUsed,
  turnsElapsed
}) => {
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [highlightStat, setHighlightStat] = useState(null);
  const [terminalLines, setTerminalLines] = useState([
    '> tracking.score.module.init()',
    '> aurora.utils.calculateScore()',
    '> system.multiplier.apply()',
    '> aurora.db.saveStats()',
    '> visual.display.update()'
  ]);

  // Animate score changes
  useEffect(() => {
    setScoreAnimation(true);
    const timer = setTimeout(() => setScoreAnimation(false), 500);
    return () => clearTimeout(timer);
  }, [totalScore]);

  // Random stat highlight for visual interest
  useEffect(() => {
    const stats = ['criticals', 'consecutive', 'abilities', 'turns'];
    const interval = setInterval(() => {
      setHighlightStat(stats[Math.floor(Math.random() * stats.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Update terminal lines randomly
  useEffect(() => {
    const possibleLines = [
      '> tracking.score.module.init()',
      `> aurora.utils.calculateScore({round: ${currentRoundScore}})`,
      `> system.multiplier.apply(${consecutiveHits > 0 ? consecutiveHits * 0.1 : 1})`,
      '> aurora.db.saveStats()',
      '> visual.display.update()',
      '> security.bypassFirewall()',
      '> neural.interface.connect()',
      '> hack.initiate(target.system)',
      '> scan.vulnerabilities()',
      `> digital.trace.hide()`,
      `> memory.fragment.collect(${Math.floor(Math.random() * 100)})`,
      `> threat.level.analyze()`
    ];
    
    const updateTerminal = setInterval(() => {
      const newLines = [...terminalLines];
      newLines.shift();
      newLines.push(possibleLines[Math.floor(Math.random() * possibleLines.length)]);
      setTerminalLines(newLines);
    }, 2000);
    
    return () => clearInterval(updateTerminal);
  }, [terminalLines, currentRoundScore, consecutiveHits]);

  return (
    <div className="score-tracker p-4 bg-[#0A0A23] border-2 border-[#00FFFF] rounded relative overflow-hidden">
      {/* Digital scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FFFF10] to-transparent bg-size-200 animate-scanline"></div>
      </div>
      
      <div className="relative z-10 mb-4 text-center">
        <h2 className="font-['VT323'] text-2xl text-[#39FF14] mb-1 flex items-center justify-center">
          <span className="mr-2 text-[#FF7700]">[</span>
          BATTLE STATS
          <span className="ml-2 text-[#FF7700]">]</span>
        </h2>

        {/* Total Score */}
        <div className={`
          font-['Press_Start_2P'] text-3xl text-[#00FFFF]
          transition-all duration-300 
          ${scoreAnimation ? 'scale-125 text-[#FF7700]' : ''}
          shadow-glow relative
        `}>
          {totalScore.toLocaleString()}
          
          {/* Digital glitch effect on score change */}
          {scoreAnimation && (
            <div className="absolute inset-0 animate-glitch opacity-70 flex justify-center items-center text-[#FF7700]">
              {totalScore.toLocaleString()}
            </div>
          )}
        </div>

        {/* Current Round Score */}
        {currentRoundScore > 0 && (
          <div className="font-['Share_Tech_Mono'] text-sm text-[#9D00FF] mt-1">
            +{currentRoundScore.toLocaleString()} this round
          </div>
        )}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Critical Hits */}
        <div className={`
          stat-box p-2 border border-[#39FF14] relative overflow-hidden
          ${highlightStat === 'criticals' ? 'bg-[#39FF14] bg-opacity-20' : ''}
          transition-all duration-300 ease-in-out
        `}>
          <div className="font-['VT323'] text-[#39FF14] text-sm">CRITICAL HITS</div>
          <div className="font-['Share_Tech_Mono'] text-white text-lg">{criticalHits}</div>
          {highlightStat === 'criticals' && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#39FF14] animate-pulse"></div>
          )}
        </div>

        {/* Consecutive Hits */}
        <div className={`
          stat-box p-2 border border-[#FF7700] relative overflow-hidden
          ${highlightStat === 'consecutive' ? 'bg-[#FF7700] bg-opacity-20' : ''}
          transition-all duration-300 ease-in-out
        `}>
          <div className="font-['VT323'] text-[#FF7700] text-sm">CONSECUTIVE</div>
          <div className="font-['Share_Tech_Mono'] text-white text-lg">{consecutiveHits}</div>
          {highlightStat === 'consecutive' && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#FF7700] animate-pulse"></div>
          )}
        </div>

        {/* Abilities Used */}
        <div className={`
          stat-box p-2 border border-[#9D00FF] relative overflow-hidden
          ${highlightStat === 'abilities' ? 'bg-[#9D00FF] bg-opacity-20' : ''}
          transition-all duration-300 ease-in-out
        `}>
          <div className="font-['VT323'] text-[#9D00FF] text-sm">ABILITIES USED</div>
          <div className="font-['Share_Tech_Mono'] text-white text-lg">{abilitiesUsed}</div>
          {highlightStat === 'abilities' && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#9D00FF] animate-pulse"></div>
          )}
        </div>

        {/* Turns Elapsed */}
        <div className={`
          stat-box p-2 border border-[#00FFFF] relative overflow-hidden
          ${highlightStat === 'turns' ? 'bg-[#00FFFF] bg-opacity-20' : ''}
          transition-all duration-300 ease-in-out
        `}>
          <div className="font-['VT323'] text-[#00FFFF] text-sm">TURNS ELAPSED</div>
          <div className="font-['Share_Tech_Mono'] text-white text-lg">{turnsElapsed}</div>
          {highlightStat === 'turns' && (
            <div className="absolute top-0 right-0 w-2 h-2 bg-[#00FFFF] animate-pulse"></div>
          )}
        </div>
      </div>

      {/* Terminal Code Effect - Fixed to prevent overlap */}
      <div className="mt-4 text-[#39FF14] font-['Share_Tech_Mono'] text-xs h-16 bg-[#0a0a18] border border-[#39FF14] rounded overflow-hidden relative">
        <div className="p-2 h-full flex flex-col justify-start">
          {terminalLines.map((line, index) => (
            <div key={index} className={`
              line whitespace-nowrap transition-all duration-500
              ${index === terminalLines.length - 1 ? 'text-[#00FFFF]' : ''}
            `}>
              {line}
            </div>
          ))}
        </div>
        
        {/* Blinking cursor */}
        <div className="absolute bottom-2 left-[calc(2rem+8px+7ch)] w-2 h-4 bg-[#00FFFF] opacity-70 animate-blink"></div>
        
        {/* Terminal scan line effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39FF1408] to-transparent opacity-50 animate-scanline pointer-events-none"></div>
      </div>
      
      {/* Connection status indicator */}
      <div className="flex items-center justify-end mt-2 text-[10px] font-['Share_Tech_Mono'] text-[#00FFFF]">
        <div className="w-2 h-2 bg-[#39FF14] rounded-full animate-pulse mr-1"></div>
        <span>SECURE CONNECTION</span>
      </div>
    </div>
  );
};

// Add these animations to your global.css
/*
*/

export default ScoreTracker;
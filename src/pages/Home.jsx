import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

export default function Home() {
  const Trophy = getIcon('Trophy');
  const Info = getIcon('Info');
  
  // Game statistics
  const [stats, setStats] = useState({
    xWins: 0,
    oWins: 0,
    draws: 0,
    totalGames: 0
  });

  // Handle game completion event
  const handleGameComplete = (result) => {
    setStats(prevStats => {
      const newStats = { ...prevStats, totalGames: prevStats.totalGames + 1 };
      
      if (result === 'X') {
        newStats.xWins = prevStats.xWins + 1;
        toast.success("Player X wins the game! 🎉");
      } else if (result === 'O') {
        newStats.oWins = prevStats.oWins + 1;
        toast.success("Player O wins the game! 🎉");
      } else if (result === 'draw') {
        newStats.draws = prevStats.draws + 1;
        toast.info("It's a draw! 🤝");
      }
      
      return newStats;
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 md:mb-4 text-gradient">
            TicTacGo
          </h1>
          <p className="text-surface-600 dark:text-surface-400 text-lg md:text-xl mb-4">
            The classic game with a modern twist
          </p>
        </div>

        {/* Stats Card */}
        <div className="card p-4 md:p-6 mb-8 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy size={20} className="text-yellow-500" />
              Game Statistics
            </h2>
            <span className="text-sm text-surface-500 dark:text-surface-400">
              Total Games: {stats.totalGames}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
              <div className="text-2xl font-bold text-primary">{stats.xWins}</div>
              <div className="text-sm text-surface-600 dark:text-surface-400">X Wins</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-secondary/10 dark:bg-secondary/20">
              <div className="text-2xl font-bold text-secondary">{stats.oWins}</div>
              <div className="text-sm text-surface-600 dark:text-surface-400">O Wins</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-surface-200 dark:bg-surface-700">
              <div className="text-2xl font-bold text-surface-700 dark:text-surface-300">{stats.draws}</div>
              <div className="text-sm text-surface-600 dark:text-surface-400">Draws</div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <MainFeature onGameComplete={handleGameComplete} />
        
        {/* Game Rules */}
        <div className="mt-8 md:mt-12 w-full max-w-md mx-auto card p-4">
          <div className="flex items-center gap-2 mb-2 text-surface-700 dark:text-surface-300">
            <Info size={18} />
            <h3 className="font-semibold">How to Play</h3>
          </div>
          <ul className="list-disc list-inside text-sm text-surface-600 dark:text-surface-400 space-y-1">
            <li>Players take turns placing X or O on the board</li>
            <li>First player to get 3 in a row (horizontal, vertical, or diagonal) wins</li>
            <li>If all spaces are filled with no winner, the game is a draw</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
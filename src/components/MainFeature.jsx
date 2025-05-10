import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

export default function MainFeature({ onGameComplete }) {
  const RotateCcw = getIcon('RotateCcw');
  const X = getIcon('X');
  const Circle = getIcon('Circle');
  const PartyPopper = getIcon('PartyPopper');
  const AlertCircle = getIcon('AlertCircle');
  const ArrowRight = getIcon('ArrowRight');

  // Game state
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winLine, setWinLine] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Check for winner after each move
  useEffect(() => {
    const result = calculateWinner(board);
    
    if (result) {
      if (result.winner) {
        setWinner(result.winner);
        setWinLine(result.line);
        setShowConfetti(true);
        
        // Notify parent component about game completion
        if (onGameComplete) {
          onGameComplete(result.winner);
        }
        
        // Hide confetti after 3 seconds
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      } else if (result.isDraw) {
        setWinner('draw');
        
        // Notify parent component about game completion
        if (onGameComplete) {
          onGameComplete('draw');
        }
      }
    }
  }, [board, onGameComplete]);

  // Handle cell click
  const handleClick = (index) => {
    // Ignore click if cell is filled or game is over
    if (board[index] || winner) return;
    
    // Set game as started on first move
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    // Update the board
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setWinLine([]);
    setGameStarted(false);
    setShowConfetti(false);
    toast.info("Game reset! X goes first.");
  };

  // Calculate winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
      [0, 4, 8], [2, 4, 6]              // Diagonals
    ];
    
    // First check for a winner
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }

    // Only if no winner and board is full, declare a draw
    const isBoardFull = squares.every(square => square !== null);
    if (isBoardFull) {
      return { isDraw: true };
    }
    
    return null; // Game still in progress
  };

  // Determine status message
  let status;
  if (winner === 'draw') {
    status = "It's a draw!";
  } else if (winner) {
    status = `Player ${winner} wins!`;
  } else {
    status = `Player ${xIsNext ? 'X' : 'O'}'s turn`;
  }

  // Custom cell component
  const Cell = ({ value, index, isWinningCell }) => {
    const cellVariants = {
      initial: { scale: 0.8, opacity: 0 },
      enter: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
      exit: { scale: 0.8, opacity: 0, transition: { duration: 0.1 } }
    };

    return (
      <motion.button
        whileHover={!value && !winner ? { scale: 0.95 } : {}}
        whileTap={!value && !winner ? { scale: 0.9 } : {}}
        className={`aspect-square flex items-center justify-center rounded-lg text-3xl md:text-4xl lg:text-5xl font-bold transition-all border-2 
          ${!value && !winner ? 'cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-800' : 'cursor-default'}
          ${isWinningCell ? 'border-green-500 dark:border-green-400 bg-green-100 dark:bg-green-900/30' : 'border-surface-200 dark:border-surface-700'}
          ${value === 'X' ? 'text-primary' : value === 'O' ? 'text-secondary' : 'text-transparent'}`}
        onClick={() => handleClick(index)}
        disabled={!!value || !!winner}
        aria-label={value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`}
      >
        <AnimatePresence mode="wait">
          {value && (
            <motion.div
              key={value}
              variants={cellVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="w-full h-full flex items-center justify-center"
            >
              {value === 'X' ? <X size={32} className="md:w-12 md:h-12" /> : <Circle size={32} className="md:w-12 md:h-12" />}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  };
  
  // Confetti effect
  const Confetti = () => {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -20,
              rotate: 0,
              opacity: 1
            }}
            animate={{ 
              y: window.innerHeight + 20,
              rotate: Math.random() * 360,
              opacity: 0
            }}
            transition={{ 
              duration: Math.random() * 2 + 1,
              ease: "linear"
            }}
            className="absolute w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: ['#6366f1', '#ec4899', '#34d399', '#f59e0b', '#3b82f6'][Math.floor(Math.random() * 5)],
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Game start overlay for new games */}
      <AnimatePresence>
        {!gameStarted && !winner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-surface-900/80 backdrop-blur-sm rounded-xl"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="text-center p-6"
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">Ready to Play?</h3>
              <p className="text-surface-600 dark:text-surface-400 mb-6">
                Click anywhere on the board to start. Player X goes first.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary flex items-center gap-2"
                onClick={() => setGameStarted(true)}
              >
                Start Game
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Confetti animation for winners */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
      
      <div className="card overflow-hidden">
        {/* Game status */}
        <div className={`p-4 text-white flex items-center justify-between
          ${winner === 'X' ? 'bg-primary' : 
            winner === 'O' ? 'bg-secondary' : 
            winner === 'draw' ? 'bg-surface-600 dark:bg-surface-700' : 
            xIsNext ? 'bg-primary' : 'bg-secondary'}`}>
          
          <div className="flex items-center gap-2">
            {winner === 'X' || winner === 'O' ? (
              <PartyPopper size={20} className="animate-bounce" />
            ) : winner === 'draw' ? (
              <AlertCircle size={20} />
            ) : xIsNext ? (
              <X size={20} />
            ) : (
              <Circle size={20} />
            )}
            <span className="font-medium">{status}</span>
          </div>
          
          <button 
            onClick={resetGame}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Reset game"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        
        {/* Game board */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 p-4 md:p-6 bg-surface-50 dark:bg-surface-800">
          {board.map((cell, index) => (
            <Cell 
              key={index}
              value={cell}
              index={index}
              isWinningCell={winLine.includes(index)}
            />
          ))}
        </div>
      </div>
      
      {/* Player indicators */}
      <div className="mt-6 flex justify-between items-center">
        <div className={`flex items-center gap-2 p-3 rounded-lg transition-all ${xIsNext && !winner ? 'bg-primary/10 dark:bg-primary/20 ring-2 ring-primary/50' : ''}`}>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <X size={18} />
          </div>
          <span className="font-medium">Player X</span>
        </div>
        
        <div className={`flex items-center gap-2 p-3 rounded-lg transition-all ${!xIsNext && !winner ? 'bg-secondary/10 dark:bg-secondary/20 ring-2 ring-secondary/50' : ''}`}>
          <span className="font-medium">Player O</span>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <Circle size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}
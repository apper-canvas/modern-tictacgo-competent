import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const ArrowLeft = getIcon('ArrowLeft');
  const FolderX = getIcon('FolderX');
  
  // Add a countdown to automatically navigate back
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="flex justify-center mb-6">
          <FolderX size={80} className="text-secondary" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page Not Found</h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="mb-6">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(countdown / 5) * 100}%` }}
            transition={{ duration: 1, ease: 'linear' }}
            className="h-1 bg-primary rounded-full mx-auto"
          />
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Redirecting to home in {countdown} seconds...
          </p>
        </div>
        
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Return to Home
        </Link>
      </motion.div>
    </div>
  );
}
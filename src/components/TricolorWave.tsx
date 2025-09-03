import React from 'react';
import { motion } from 'framer-motion';

const TricolorWave: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex h-2"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="w-1/3 bg-gradient-to-r from-orange-500 to-orange-400"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-gradient-to-r from-green-600 to-green-500"></div>
      </motion.div>
      
      {/* Ashoka Chakra inspired accent */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-6 border-2 border-navy-800 rounded-full bg-navy-800"
        animate={{ rotate: 360 }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="absolute inset-1 border border-white rounded-full">
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TricolorWave;
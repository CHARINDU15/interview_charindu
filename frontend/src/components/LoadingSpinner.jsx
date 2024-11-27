import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      {/* Background Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-500 to-transparent opacity-30 rounded-full"
          animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500 to-transparent opacity-30 rounded-full"
          animate={{ x: [0, -100, 100, 0], y: [0, 100, -100, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Enhanced Loading Spinner */}
      <motion.div
        className='relative z-10 w-16 h-16 border-4 border-t-4 border-t-green-500 border-green-200 rounded-full'
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      {/* Loading Text */}
      <motion.div
        className="relative z-10 mt-6 text-center text-white text-lg font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading, please wait...
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;

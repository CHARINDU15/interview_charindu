import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const FloatingShape = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ top, left }} // Use inline style for positioning
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay: delay,
        ease: 'linear',
      }}
      aria-hidden="true"
    />
  );
};

// PropTypes validation
FloatingShape.propTypes = {
  color: PropTypes.string.isRequired,  
  size: PropTypes.string.isRequired, 
  top: PropTypes.string.isRequired,    
  left: PropTypes.string.isRequired,    
  delay: PropTypes.number,              
};

export default FloatingShape;
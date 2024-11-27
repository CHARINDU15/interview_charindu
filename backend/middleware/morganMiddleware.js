import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import RequestLog from '../models/log.model.js';

morgan.token('user-id', (req) => {
  const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'
  if (!token) {
    return 'anonymous';
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    return decoded.userId; // Assuming the user ID is stored in the 'userId' field of the token payload
  } catch (error) {
    return 'anonymous';
  }
});

morgan.token('role', (req) => {
  const token = req.cookies.token; // Assuming the token is stored in a cookie named 'token'
  if (!token) {
    return 'anonymous';
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
    return decoded.role; // Assuming the user ID is stored in the 'userId' field of the token payload
  } catch (error) {
    return 'anonymous';
  }
});
// Define the format for logging
const format = ':method :url :status :response-time ms - :user-id :role';

// Define the stream object with a write function to log to the database
const stream = {
  write: async (message) => {
    try {
      
      const logData = parseLogMessage(message);
      const logEntry = new RequestLog(logData);
      await logEntry.save();
      console.log('Request logged to database:', message);
    } catch (error) {
      console.error('Error logging request to database:', error);
    }
  },
};

// Create the Morgan middleware
const morganMiddleware = morgan(format, { stream });

// Function to parse the log message
const parseLogMessage = (message) => {
  const parts = message.split(' ');
  console.log('parts:', parts);
  console.log('message:', message);
  return {
    method: parts[0],
    url: parts[1],
    status: parseInt(parts[2], 10),
    responseTime: parseFloat(parts[3]),
    user: parts[6], // Assuming user information is included in the message
    role: parts[7], // Assuming user information is included in the message
  };
};


export default morganMiddleware;
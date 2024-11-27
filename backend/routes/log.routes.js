import express from 'express';
import { verifyRole } from '../middleware/roleMiddleware.js';
import RequestLog from '../models/log.model.js';

const router = express.Router();

router.get('/', verifyRole(['Admin']), async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 25;  // Default to 25 logs per page
    const skip = (page - 1) * limit;  // Calculate the number of logs to skip

    try {
        const logs = await RequestLog.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        const totalLogs = await RequestLog.countDocuments();  
        res.json({ logs, total: totalLogs });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
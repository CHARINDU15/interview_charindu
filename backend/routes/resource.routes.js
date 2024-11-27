// backend/routes/resource.routes.js
import express from 'express';
import { verifyRole } from '../middleware/roleMiddleware.js';
import { create, getAll, getById, update, deleteResource, comment, react } from '../controllers/resource.controller.js';

const router = express.Router();

router.post('/create', verifyRole(['Admin']), create);
router.get('/', getAll); // Public route to get all resources
router.get('/:id', getById); // Public route to get a single resource by ID
router.put('/:id', verifyRole(['Admin']), update);
router.delete('/:id', verifyRole(['Admin']), deleteResource);
router.post('/comment', verifyRole(['Admin', 'User']), comment);
router.post('/react', verifyRole(['Admin', 'User']), react);

export default router;
import express from 'express';
import { suggestSolution } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Only logged-in users can ask for AI help
// Endpoint: POST /api/ai/suggest-solution
router.post('/suggest-solution', protect, suggestSolution);

export default router;
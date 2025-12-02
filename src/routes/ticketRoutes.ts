import express from 'express';
import { createTicket, getMyTickets } from '../controllers/ticketController';
// Import the middleware you created during the Login/Auth phase
// (Make sure this path points to your actual auth middleware file)
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Apply 'protect' here to check the token BEFORE allowing access
router.route('/')
  .get(protect, getMyTickets)   // 1. Check Token -> 2. Get Tickets
  .post(protect, createTicket); // 1. Check Token -> 2. Create Ticket

export default router;
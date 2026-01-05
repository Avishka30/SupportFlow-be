🚀 SupportFlow API (Backend)

An AI-powered Support Ticket System API built with Node.js, Express, and TypeScript. This backend handles authentication, ticket management, real-time messaging, and AI integrations using Google Gemini.

🔗 Live API URL: https://test-new-be.vercel.app/


✨ Features

🔐 Secure Authentication: JWT-based auth with Access (15m) and Refresh Tokens (7d).

🎫 Ticket Management: Create, read, and manage support tickets.

🤖 AI Integration (Google Gemini):

Auto-Categorization: Automatically detects ticket category based on description.

Smart Priority: Assigns priority (Low/Medium/High) based on urgency.

Solution Suggestions: AI suggests fixes to users instantly.

Admin Drafts: AI writes polite reply drafts for support agents.

🛡️ Admin Panel: Dedicated endpoints for admins to view all tickets, change status, and assign agents.

💬 Messaging: Chat system within individual tickets.

🛠️ Tech Stack

Runtime: Node.js

Framework: Express.js

Language: TypeScript

Database: MongoDB (Mongoose)

AI Model: Google Gemini 

Deployment: Vercel

🚀 Getting Started Locally

1. Clone the Repository

git clone [https://github.com/Avishka30/SupportFlow-be.git]
cd SupportFlow-be

2. Install Dependencies

npm install


3. Configure Environment Variables

Create a .env file in the root directory and add the following:

# Server Configuration
PORT=5000
NODE_ENV=development

# Database Connection (MongoDB Atlas)
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/supportflow_db

# Security Secrets (Generate random strings for these)
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key

# Token Expiry Settings
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# AI Integration (Get key from aistudio.google.com)
GEMINI_API_KEY=AIzaSy...Your_Gemini_Key


4. Run the Server

# Development Mode (with hot reload)
npm run dev

# Production Build
npm run build
npm start


The server will start at http://localhost:5000.

📡 API Endpoints

Authentication

POST /api/auth/register - Create a new user account.

POST /api/auth/login - Login and receive Access/Refresh tokens.

POST /api/auth/refresh - Refresh an expired Access Token.

Tickets (User)

POST /api/tickets - Create a new ticket (AI auto-fills category/priority).

GET /api/tickets - Get all tickets for the logged-in user.

GET /api/tickets/:id - Get details of a specific ticket.

Chat System

GET /api/messages/:ticketId - Get chat history for a ticket.

POST /api/messages/:ticketId - Send a message to a ticket.

Admin Actions (Protected)

GET /api/admin/tickets - View ALL tickets from all users.

PATCH /api/admin/tickets/:id/status - Update status (Open/In Progress/Resolved).

PATCH /api/admin/tickets/:id/assign - Assign ticket to an agent.

AI Services

POST /api/ai/suggest-solution - Get immediate solution based on description.

POST /api/ai/draft-reply - Generate an admin response draft based on chat history.




import 'dotenv/config'; 
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173"], // frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());

app.use('/api/auth', authRouter);

// 1. Get the connection string from .env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// 2. Validation: Check if MONGO_URI exists
if (!MONGO_URI) {
  console.error("❌ Error: MONGO_URI is not defined in .env file.");
  process.exit(1); // Stop the app if no DB link
}

// 3. Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Database connected successfully!');
    console.log(`   Connected to: ${MONGO_URI}`); // Optional: helps debug which DB you are using
  })
  .catch(err => console.error('❌ Database connection error:', err));


// app.use('/api/auth', authRouter); // Uncomment later

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
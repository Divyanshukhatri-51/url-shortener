import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { generateUrl, getRecentUrls, reDirect } from './controllers/urlController.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());


const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urlshortener';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/shorten', generateUrl);

app.get('/api/recent', getRecentUrls);
app.get('/:shortCode', reDirect);

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
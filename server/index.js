import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database/db.js';

// Route Imports
import itemRoutes from './routes/items.js';
import bidRoutes from './routes/bids.js';

dotenv.config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Create the HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io and attach it to the server
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Update this to match your React frontend port
    methods: ['GET', 'POST'],
  },
});

// Attach the io instance to Express so your routes can broadcast
app.set('io', io);

// Apply routes
app.use('/api/items', itemRoutes);
app.use('/api/bids', bidRoutes);

// Basic Express Route for testing
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`🟢 User Connected: ${socket.id}`);

  socket.on('join_auction', (itemId) => {
    // TWEAK 3: Force itemId to be a String. Socket.io rooms act weird with integers.
    socket.join(String(itemId));
    console.log(`User ${socket.id} joined room: ${itemId}`);
  });

  socket.on('disconnect', () => {
    console.log(`🔴 User Disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

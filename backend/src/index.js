import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { clerkMiddleware } from '@clerk/express';
import predictionsRouter from './routes/predictions.js';
import sportsRouter from './routes/sports.js';
import signalsRouter from './routes/signals.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// WebSocket server for live updates
export const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');
  ws.send(JSON.stringify({ type: 'connected', message: 'Sports Oracle connected' }));
  ws.on('close', () => console.log('Client disconnected'));
});

export function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean)
}));
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/api/predictions', predictionsRouter);
app.use('/api/sports', sportsRouter);
app.use('/api/signals', signalsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString(), model: 'Sports Oracle v1' });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🏆 Sports Oracle backend running on port ${PORT}`);
});

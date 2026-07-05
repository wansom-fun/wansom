import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import { SolanaGeyserIngester } from './geyser';
import { OrchestratorJobQueue } from './queue';
import { WansomKeeperService } from './keeper';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Initialize Core Protocol Services
const geyser = new SolanaGeyserIngester(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  process.env.SOLANA_WSS_URL || 'wss://api.mainnet-beta.solana.com'
);
const queue = new OrchestratorJobQueue();
const keeper = new WansomKeeperService(
  process.env.KEEPER_TOKEN_MINT_ADDRESS || 'WAnSoMxY2tLm5wPQ8W2oB1zKzJn9q5Dk99A_MOCK'
);

// REST Middleware
app.use(express.json());

app.get('/api/v1/network/telemetry', (req, res) => {
  res.json({
    success: true,
    data: {
      active_nodes: 142,
      total_audits_24h: 41920,
      burned_tokens_total: 12048590.22,
      average_latency_ms: 118.5,
      historical_cu: [
        { timestamp: new Date(Date.now() - 3600000).toISOString(), cu: 780 },
        { timestamp: new Date(Date.now() - 1800000).toISOString(), cu: 810 },
        { timestamp: new Date().toISOString(), cu: 843 }
      ]
    }
  });
});

app.post('/api/v1/audit/execute', (req, res) => {
  const { address, bytecode } = req.body;
  if (!address) {
    return res.status(400).json({ success: false, error: 'Target Solana address required.' });
  }

  const job = queue.createJob(address, bytecode || 'MOCK_BYTECODE_PAYLOAD');
  queue.routeJob(job.id);

  res.json({
    success: true,
    message: 'Audit job queued successfully.',
    jobId: job.id
  });
});

// Setup WebSocket Routing
server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);

  if (pathname === '/ws/telemetry') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws: WebSocket) => {
  const mockNodeId = `Node-0x${Math.random().toString(16).substring(2, 6)}`;
  queue.addNode(mockNodeId);

  // Send periodic ping checks to client
  const pingInterval = setInterval(() => {
    ws.send(JSON.stringify({
      event: 'node_ping',
      timestamp: Date.now(),
      data: {
        node_id: mockNodeId,
        ping_ms: Math.floor(10 + Math.random() * 80),
        status: 'active'
      }
    }));
  }, 3000);

  ws.on('close', () => {
    clearInterval(pingInterval);
    queue.removeNode(mockNodeId);
  });
});

// Start Ingestion and Keeper services
geyser.subscribe();
keeper.start();

server.listen(port, () => {
  console.log(`[Orchestrator] Service online on port ${port}`);
  console.log(`[Orchestrator] gRPC socket geyser listener active`);
  console.log(`[Orchestrator] WebSocket Telemetry path active on wss://localhost:${port}/ws/telemetry`);
});

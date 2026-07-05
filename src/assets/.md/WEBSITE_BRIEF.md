# WANSOM Website & Platform Architecture Brief

This document outlines the visual specifications, interactive components, frontend layouts, and production-grade backend architecture for the Wansom web platform. The platform is designed to emulate the sleek, hyper-modern aesthetic of leading decentralized computing platforms (such as `c0mpute.ai`), tailored specifically for real-time Solana on-chain data streaming and autonomous trading telemetry.

---

## 1. Visual Identity & Aesthetic Guidelines

The platform must immediately project security, high-velocity intelligence, and decentralized protocol coordination. 

### I. Color Palette (HSL System)
*   **Background (Deep Abyss)**: `hsl(240, 15%, 4%)`
*   **Surface (Card Glassmorphism)**: `hsla(240, 10%, 8%, 0.7)` with `backdrop-filter: blur(12px)`
*   **Primary Accent (Solana Plasma Purple)**: `hsl(270, 85%, 60%)`
*   **Secondary Accent (Solana Cyber Green)**: `hsl(145, 80%, 50%)`
*   **Muted Foreground**: `hsl(240, 5%, 65%)`
*   **Active Borders**: `hsla(270, 70%, 50%, 0.2)` with hover transition to `0.5` opacity.

### II. Typography
*   **Display & Headings**: *Outfit* or *Space Grotesk* (Clean, high-tech, geometric sans-serif)
*   **Body Text**: *Inter* (High readability, neutral sans-serif)
*   **Code & Logs**: *JetBrains Mono* (Highly legible monospace, optimized for terminals)

### III. Layout Elements & Micro-Animations
*   **Glowing Grid Backdrop**: A CSS-based grid pattern overlaying a radial gradient center-point to create depth.
*   **Active Hover States**: 3D card tilts using CSS transforms, borders shifting from muted grey to neon purple gradients on hover.
*   **Pulse Status Indicators**: Pulsing green/purple keyframe animations on active nodes to signify real-time data flow.

---

## 2. Frontend Page Layout & User Experience

The website is structured as a single-page dashboard with four major functional tabs, preventing page reloads and ensuring an uninterrupted terminal telemetry experience:

```
┌────────────────────────────────────────────────────────────────────────┐
│  [WANSOM LOGO]      [Live Tel: 142 Nodes / 843 CU/s]     [Connect Wallet]│
├────────────────────────────────────────────────────────────────────────┤
│  [ TELEMETRY ]    [ SCOUT NODES ]    [ AUDIT PLAYGROUND ]   [ STAKING ]│
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────────────┐   ┌──────────────────────────────┐  │
│  │                               │   │                              │  │
│  │     Live Solana Ingress       │   │     Network Health           │  │
│  │     Terminal Logs (Realtime)  │   │     (TPS, CU, Burn Rate)     │  │
│  │                               │   │                              │  │
│  └───────────────────────────────┘   └──────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                                                                  │  │
│  │                  Interactive Node Performance Chart              │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Tab 1: Live Ingress Telemetry (The Homepage)
*   **Solana RPC Live Feed**: A simulated terminal printing real-time contract audits. E.g.:
    `[11:04:12] INGEST: Token mint detected [address: Fs9x...2aZq] on Pump.fun`
    `[11:04:13] AUDIT: Routing code signature to Node #74 (Location: Tokyo)`
    `[11:04:14] RESULT: safety_score = 94.2. Executing buy order via Jito Bundle.`
*   **Network Metrics Panel**: Three high-fidelity mini-cards:
    1.  *Active Compute Units (CU)*: Total network FLOPs/s currently dedicated to token scanning.
    2.  *Cumulative Audits*: Counter incrementing in real-time.
    3.  *Deflation Counter*: Total `$WANSOM` programmatically bought back and burned.

### Tab 2: Scout Node Portal
*   **Global Node Visualization**: A stylized interactive SVG map showing active nodes glowing based on workload density.
*   **Active Node List Table**: A clean table displaying:
    *   Node ID (e.g., `Node-0x8f3c...`)
    *   Hardware (e.g., `NVIDIA RTX 4090`)
    *   Latency (`42ms`)
    *   Reputation Score (`99.8%`)
    *   Total `$WANSOM` earned.
*   **Daemon Launch Prompt**: Technical instructions for running the worker (`npm install -g @wansom/worker && wansom-worker start --key <YOUR_STAKED_WALLET>`).

### Tab 3: LLM Audit Playground
*   **Interactive Sandbox**: A terminal input field where users can paste any Solana address.
*   **Real-time Streaming Response**: Clicking "Execute Audit" triggers a WebSocket request that streams the LLM audit output word-by-word into the terminal window, simulating a live inference call.

### Tab 4: Staking & Wallet Dashboard
*   **Wallet Integration**: Solana Wallet Adapter support (Phantom, Solflare, Backpack).
*   **Staking Controls**: Interfaces for locking `$WANSOM` to unlock custom agent profiles or upgrading a node to active status. Shows APY, lock durations, and claimable USDC yield pools.

---

## 3. Backend Architecture Design (Production-Ready)

To avoid any perception of the system being a "prototype," the backend is architected using robust, production-grade tools. In development or test environments, it uses local fallbacks, but the code structure is fully ready for scaling.

```
                             ┌───────────────────────┐
                             │  Solana Validator/RPC  │
                             └───────────┬───────────┘
                                         │ gRPC / WebSocket
                                         ▼
                             ┌───────────────────────┐
                             │ Solana Ingest Service │
                             └───────────┬───────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼ (Prod mode: Redis)                            ▼ (Fallbacks)
     ┌───────────────────────┐                       ┌───────────────────────┐
     │      Redis Cache      │                       │     Local SQLite      │
     └───────────┬───────────┘                       └───────────┬───────────┘
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         ▼
                             ┌───────────────────────┐
                             │  Express / NestJS     │
                             │  Application Server   │
                             └───────────┬───────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼ HTTP/REST                                     ▼ WebSockets
     ┌───────────────────────┐                       ┌───────────────────────┐
     │      REST API         │                       │   WS Telemetry Hub    │
     │ (/v1/nodes, /v1/audit)│                       │   (/ws/telemetry)     │
     └───────────────────────┘                       └───────────────────────┘
```

### I. Server Stack
*   **Language & Framework**: Node.js with TypeScript and Express.js (or NestJS for Enterprise structure).
*   **Real-time Layer**: `ws` or `socket.io` for high-frequency updates.
*   **Caching/Message Queuing**: Redis (for caching live network stats and managing the worker job queue).
*   **Database**: PostgreSQL (using Prisma ORM) for permanent node registry, user sessions, and staking history. SQLite is configured as an automatic database fallback for single-instance, simplified local testing.

### II. The Ingress Service & Simulation Layer
The backend handles Solana RPC rate limits gracefully:
*   **Production Path**: Subscribes to Solana gRPC (using Geyser plugins or Helius streams) to capture new token creation logs from program addresses `6EF8...` (Pump.fun) and `5Q2m...` (Raydium).
*   **Simulation / Fallback Path**: When RPC nodes are throttled or during test modes, the server initiates an internal event-loop generator (`SolanaIngressSimulator`). This generator mimics live blockchain feeds using authentic transaction hashes, wallet signatures, and real-time LLM responses to provide a fully functioning dashboard even without expensive RPC endpoints.

### III. Authentication Scheme: Solana Web3 Signature (Passwordless)
The server secures sensitive operations (staking, API key generation) using cryptographic verification:
1.  **Challenge Generation**: User requests a unique login challenge (a timestamped UUID).
2.  **Client Signature**: The user's wallet signs the message: `Sign("Authenticate Wansom Session: [UUID]", KeyPair)`.
3.  **Verification**: The backend verifies the signature using `tweetnacl` (`nacl.sign.detached.verify`). If valid, the server issues a JWT token. This completely bypasses traditional username/password authentication.

---

## 4. API & WebSocket Specifications

### WebSocket Path: `/ws/telemetry`
Upon connection, the client receives a stream of network events:

#### Payload: Node Latency Check
```json
{
  "event": "node_ping",
  "timestamp": 1719827300000,
  "data": {
    "node_id": "Node-0x9eA2",
    "ping_ms": 38,
    "status": "active"
  }
}
```

#### Payload: Real-time Audit Stream
```json
{
  "event": "audit_log",
  "timestamp": 1719827301200,
  "data": {
    "token_name": "TrenchQuantum",
    "token_symbol": "TRQ",
    "address": "9x8yZ...7w6v",
    "safety_score": 88.4,
    "verifying_nodes": ["Node-0x9eA2", "Node-0x4fBc", "Node-0x7aDf"],
    "action": "AUTO_STAKE_APPROVED"
  }
}
```

### REST Endpoint: `GET /api/v1/network/telemetry`
Returns the aggregated historical telemetry data to render the dashboard charts.

#### Response:
```json
{
  "success": true,
  "data": {
    "active_nodes": 142,
    "total_audits_24h": 41920,
    "burned_tokens_total": 12048590.22,
    "average_latency_ms": 118.5,
    "historical_cu": [
      { "timestamp": "2026-07-05T12:00:00Z", "cu": 780 },
      { "timestamp": "2026-07-05T13:00:00Z", "cu": 810 },
      { "timestamp": "2026-07-05T14:00:00Z", "cu": 843 }
    ]
  }
}
```

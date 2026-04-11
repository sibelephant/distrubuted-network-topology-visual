<div align="center">

# 🌐 Distributed Network Topology Visualizer (DNTV)

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/repo)
[![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white)](https://reactflow.dev/)

*A full-stack, real-time, browser-based drag-and-drop network topology simulation platform with multiplayer collaboration and active protocol rendering.*

</div>

---

## ✨ Key Features
- **🖌️ Interactive Canvas:** Build complex network architectures using routers, switches, hubs, and end-hosts. Powered by `React Flow`.
- **🤝 Real-Time Multiplayer:** WebSocket-driven synchronization. Multiple users can view, drag, and interact with the same topology simultaneously.
- **⚙️ Advanced Protocols:**
  - **Spanning Tree Protocol (STP):** Automatically detects Layer 2 loops and safely drops redundant paths (rendering blocked links in visually distinct ways).
  - **CSMA/CD:** Accurately simulates hub-based collision domains with exponential backoff animations!
- **⚡ Next-Gen Persistence:** Schema and data are cleanly maintained using **Prisma 7** coupled with PostgreSQL driver adapters (`@prisma/adapter-pg`).
- **📥 Educational Tools & Exports:** Instantly drop graphs into JSON payloads, SVG/PNG screenshots, `Mermaid` schemas, and best-effort **Cisco Packet Tracer (.pkt)** XML files.
- **🧮 Built-In Utilities:** Floating IPv4 / CIDR subnet calculator for rapid VLSM prototyping.

## 🏗️ Architecture Stack
This application is orchestrated as a fully-typed **Turborepo** Monorepo separating the frontend and backend microservices safely:

| Layer | Technology | Purpose |
| ---- | ---- | ---- |
| **Frontend Platform** | Next.js 14, React Flow, Zustand | Handles canvas interactions, floating tools, and global application state. |
| **Backend API** | NestJS, Socket.IO | Provides REST endpoints and stateful WebSocket gateways for simulations and multi-clients. |
| **Messaging** | Redis Pub/Sub | Cross-coordinates WebSocket states efficiently between concurrent node instances. |
| **Database** | PostgreSQL | Containerized via Docker storing persistent graphs and users. |
| **ORM** | Prisma v7 | Facilitates bleeding edge relational mapping within the workspace architecture. |

---

## 🚀 How to Start the App

### 1. Requirements
- **Node.js**: `v22+`
- **Docker Compose**: Running locally to handle the database layer.
- **NPM Package Manager**

### 2. Bootstrapping the Backend (Docker)
The required Redis and PostgreSQL clusters run seamlessly out-of-the-box locally.
```bash
# From the root directory, launch the data instances
docker compose up -d
```

### 3. Install Dependencies
```bash
# Pull down all necessary monorepo workspace dependencies via NPM
npm install
```

### 4. Push Database Schemas
You need to generate the Prisma clients and push your schemas before running for the first time.
```bash
npm run db:push --workspace=@dntv/database
npm run db:generate --workspace=@dntv/database
```

### 5. Launch both Servers (Web + API)
With `Turborepo` firmly configured, you can launch both environments effortlessly in one terminal.
```bash
# Launches both Next.js and NestJS workspaces in parallel
npm run dev
```

### 6. Access Application
Open your browser and navigate to:
- **Frontend Panel**: [http://localhost:3000](http://localhost:3000)
- **API Health Check**: [http://localhost:3002/health](http://localhost:3002/health)

---

## 💡 Usage Guide

1. **Drawing Graphs:** Drag components (Routers, Switches, PCs, Hubs) onto the canvas. Click and drag from edge handles to link devices via specific layer mediums.
2. **Network Protocol Sim:** Select a source and a destination node, then click the **Start Simulation** button in the floating toolbar. You will visually see the packet hop gracefully across your graph—obeying Dijkstra routing while factoring in CSMA/CD and STP metrics.
3. **Calculating Subnets:** Click the **Calculator Icon** in the bottom-left edge to compute subnets quickly while designing.
4. **Exporting Models:** Look to the top-right toolbar. You can save your topology to a JSON file, copy Mermaid code natively to Markdown, take a crisp hi-res PNG snapshot, or download an experimental **Cisco Packet Tracer configuration** payload.

*Made with ❤️ using Next.js & NestJS.*

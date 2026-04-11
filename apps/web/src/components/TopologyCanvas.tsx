'use client';

import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import RouterNode from './nodes/RouterNode';
import SwitchNode from './nodes/SwitchNode';
import HostNode from './nodes/HostNode';
import HubNode from './nodes/HubNode';
import NodeDrawer from './NodeDrawer';
import RemoteCursors from './RemoteCursors';
import { useTopologyStore } from '../store/useTopologyStore';
import { useSocket } from '../hooks/useSocket';

const nodeTypes = {
  router: RouterNode,
  switch: SwitchNode,
  host: HostNode,
  hub: HubNode,
};

const initialNodes = [
  { id: '1', type: 'router', position: { x: 250, y: 100 }, data: { label: 'Core Router' } },
  { id: '2', type: 'switch', position: { x: 250, y: 300 }, data: { label: 'Main Switch' } },
  { id: '3', type: 'host', position: { x: 50, y: 500 }, data: { label: 'Laptop A' } },
  { id: '4', type: 'host', position: { x: 450, y: 500 }, data: { label: 'Server B' } },
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
];

export default function TopologyCanvas() {
  const topologyId = 'demo-topology'; // Hardcoded for Phase 3 demo
  const userId = React.useMemo(() => Math.random().toString(36).substring(7), []);
  const { socket, isConnected } = useSocket(topologyId);
  const [remoteCursors, setRemoteCursors] = React.useState<any[]>([]);

  const { setSelectedNode, selectedNode: storeSelectedNode } = useTopologyStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: any) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onNodeDrag = useCallback(
    (_: React.MouseEvent, node: any) => {
      if (socket) {
        socket.emit('node:move', {
          topologyId,
          nodeId: node.id,
          position: node.position,
        });
      }
    },
    [socket, topologyId]
  );

  const lastEmitRef = React.useRef(0);
  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      const now = Date.now();
      if (socket && isConnected && now - lastEmitRef.current > 33) { // ~30fps
        socket.emit('cursor:move', {
          topologyId,
          userId,
          position: { x: event.clientX, y: event.clientY },
          color: '#f97316', // Orange-500 matching the branding
        });
        lastEmitRef.current = now;
      }
    },
    [socket, isConnected, topologyId, userId]
  );

  // Socket event listeners
  React.useEffect(() => {
    if (!socket) return;

    socket.on('node:move', (payload) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === payload.nodeId ? { ...node, position: payload.position } : node
        )
      );
    });

    socket.on('node:update', (payload) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === payload.nodeId ? { ...node, data: payload.data } : node
        )
      );
    });

    socket.on('cursor:move', (payload) => {
      setRemoteCursors((prev) => {
        const otherCursors = prev.filter((c) => c.userId !== payload.userId);
        return [...otherCursors, payload];
      });
    });

    return () => {
      socket.off('node:move');
      socket.off('node:update');
      socket.off('cursor:move');
    };
  }, [socket, setNodes]);

  // Sync store updates through socket
  React.useEffect(() => {
    if (storeSelectedNode && socket) {
      socket.emit('node:update', {
        topologyId,
        nodeId: storeSelectedNode.id,
        data: storeSelectedNode.data,
      });
    }
  }, [storeSelectedNode, socket, topologyId]);

  // Sync store updates back to local nodes state
  React.useEffect(() => {
    if (storeSelectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === storeSelectedNode.id
            ? { ...node, data: { ...node.data, ...storeSelectedNode.data } }
            : node
        )
      );
    }
  }, [storeSelectedNode, setNodes]);

  return (
    <div className="w-full h-full relative" onPointerMove={onPointerMove}>
      <div className="absolute top-4 left-4 z-10">
        <div className={`px-2 py-1 rounded text-[10px] font-mono ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isConnected ? '● SYNC ON' : '○ OFFLINE'}
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onNodeDrag={onNodeDrag}
        nodeTypes={nodeTypes}
        fitView
        colorMode="system"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <RemoteCursors cursors={remoteCursors} />
      <NodeDrawer />
    </div>
  );
}

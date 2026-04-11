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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes as any);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        colorMode="system"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

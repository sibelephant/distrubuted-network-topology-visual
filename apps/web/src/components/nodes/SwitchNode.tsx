'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Network } from 'lucide-react';

export type SwitchNodeData = {
  label: string;
};

export function SwitchNode({ data }: NodeProps<Node<SwitchNodeData>>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-green-100 text-green-600">
          <Network size={24} />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500 text-xs">Switch (L2)</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-stone-400!"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2 h-2 bg-stone-400!"
      />
       <Handle
        type="source"
        position={Position.Left}
        className="w-2 h-2 bg-stone-400!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 bg-stone-400!"
      />
    </div>
  );
}

export default memo(SwitchNode);

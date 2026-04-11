'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Layers } from 'lucide-react';

export type HubNodeData = {
  label: string;
};

export function HubNode({ data }: NodeProps<Node<HubNodeData>>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[120px]">
      <div className="flex flex-col items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600">
          <Layers size={24} />
        </div>
        <div className="mt-1 text-center">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-[10px] text-gray-500">Hub (L1)</div>
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
    </div>
  );
}

export default memo(HubNode);

'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Laptop } from 'lucide-react';

export type HostNodeData = {
  label: string;
};

export function HostNode({ data }: NodeProps<Node<HostNodeData>>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[120px]">
      <div className="flex flex-col items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-orange-100 text-orange-600">
          <Laptop size={24} />
        </div>
        <div className="mt-1 text-center">
          <div className="text-sm font-bold">{data.label}</div>
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="w-2 h-2 bg-stone-400!"
      />
    </div>
  );
}

export default memo(HostNode);

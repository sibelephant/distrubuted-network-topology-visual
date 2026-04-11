'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Router } from 'lucide-react';

export type RouterNodeData = {
  label: string;
  isSimulating?: boolean;
};

export function RouterNode({ data }: NodeProps<Node<RouterNodeData>>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400 min-w-[150px]">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600">
          <Router size={24} />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          <div className="text-gray-500 text-xs">Router</div>
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

export default memo(RouterNode);

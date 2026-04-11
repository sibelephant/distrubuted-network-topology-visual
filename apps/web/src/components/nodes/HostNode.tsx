'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Laptop } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type HostNodeData = {
  label: string;
  isActive?: boolean;
  isSource?: boolean;
  isDest?: boolean;
};

export function HostNode({ data }: NodeProps<Node<HostNodeData>>) {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-white border-2 transition-all duration-300 min-w-[120px]",
      data.isActive ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110" : 
      data.isSource ? "border-orange-500" :
      data.isDest ? "border-blue-500" : "border-stone-400"
    )}>
      {data.isActive && (
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className={cn(
          "rounded-full w-10 h-10 flex items-center justify-center transition-colors",
          data.isActive ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
        )}>
          <Laptop size={24} />
        </div>
        <div className="mt-1 text-center">
          <div className="text-sm font-bold">{data.label}</div>
          {data.isSource && <div className="text-[8px] font-bold text-orange-500">SOURCE</div>}
          {data.isDest && <div className="text-[8px] font-bold text-blue-500">DESTINATION</div>}
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

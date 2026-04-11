'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Layers } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type HubNodeData = {
  label: string;
  isActive?: boolean;
  isSource?: boolean;
  isDest?: boolean;
  isCollision?: boolean;
};

export function HubNode({ data }: NodeProps<Node<HubNodeData>>) {
  return (
    <div className={cn(
      "px-4 py-2 shadow-md rounded-md bg-white border-2 transition-all duration-300 min-w-[120px]",
      data.isCollision ? "border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.7)] animate-pulse scale-110" :
      data.isActive ? "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110" : 
      data.isSource ? "border-orange-500" :
      data.isDest ? "border-blue-500" : "border-stone-400"
    )}>
      {(data.isActive || data.isCollision) && (
        <div className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            data.isCollision ? "bg-red-400" : "bg-green-400"
          )}></span>
          <span className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            data.isCollision ? "bg-red-600" : "bg-green-500"
          )}></span>
        </div>
      )}
      <div className="flex flex-col items-center">
        <div className={cn(
          "rounded-full w-10 h-10 flex items-center justify-center transition-colors",
          data.isCollision ? "bg-red-100 text-red-700" :
          data.isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
        )}>
          <Layers size={24} />
        </div>
        <div className="mt-1 text-center">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="flex flex-col items-center gap-0">
            <span className="text-[10px] text-gray-500">Hub (L1)</span>
            {data.isCollision && <span className="text-[10px] font-bold text-red-600 animate-bounce">COLLISION!</span>}
            {data.isSource && !data.isCollision && <span className="text-[8px] font-bold text-orange-500">SOURCE</span>}
            {data.isDest && !data.isCollision && <span className="text-[8px] font-bold text-blue-500">DESTINATION</span>}
          </div>
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

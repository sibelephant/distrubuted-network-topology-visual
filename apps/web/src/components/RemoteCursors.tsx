'use client';

import React from 'react';
import { MousePointer2 } from 'lucide-react';

interface Cursor {
  userId: string;
  position: { x: number; y: number };
  color: string;
}

interface RemoteCursorsProps {
  cursors: Cursor[];
}

export default function RemoteCursors({ cursors }: RemoteCursorsProps) {
  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute pointer-events-none z-50 transition-all duration-75"
          style={{
            left: cursor.position.x,
            top: cursor.position.y,
            color: cursor.color,
          }}
        >
          <MousePointer2 size={16} fill="currentColor" />
          <div 
            className="ml-2 px-1.5 py-0.5 rounded text-[10px] text-white font-bold whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            User {cursor.userId.slice(0, 4)}
          </div>
        </div>
      ))}
    </>
  );
}

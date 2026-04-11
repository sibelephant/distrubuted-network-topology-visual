'use client';

import React from 'react';
import { Play, RotateCcw, Target, Radio } from 'lucide-react';

interface SimulationToolbarProps {
  onStart: () => void;
  onReset: () => void;
  sourceId: string | null;
  destId: string | null;
  isSimulating: boolean;
  setMode: (mode: 'source' | 'dest' | null) => void;
  mode: 'source' | 'dest' | null;
}

export default function SimulationToolbar({
  onStart,
  onReset,
  sourceId,
  destId,
  isSimulating,
  setMode,
  mode,
}: SimulationToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-2 bg-white/90 backdrop-blur shadow-lg border border-stone-200 rounded-full transition-all">
      <button
        onClick={() => setMode('source')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          mode === 'source' ? 'bg-orange-500 text-white' : sourceId ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
        }`}
      >
        <Target size={14} />
        {sourceId ? `Source: ${sourceId}` : 'Select Source'}
      </button>

      <div className="w-px h-4 bg-stone-300 mx-1" />

      <button
        onClick={() => setMode('dest')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          mode === 'dest' ? 'bg-blue-500 text-white' : destId ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
        }`}
      >
        <Radio size={14} />
        {destId ? `Dest: ${destId}` : 'Select Destination'}
      </button>

      <div className="w-px h-4 bg-stone-300 mx-1" />

      <button
        onClick={onStart}
        disabled={!sourceId || !destId || isSimulating}
        className={`p-2 rounded-full transition-all ${
          !sourceId || !destId || isSimulating
            ? 'bg-stone-100 text-stone-300 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 shadow-md shadow-green-200 scale-110 active:scale-95'
        }`}
      >
        <Play size={18} fill="currentColor" />
      </button>

      <button
        onClick={onReset}
        className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-all"
        title="Reset Selection"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
}

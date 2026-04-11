'use client';

import React from 'react';
import { useTopologyStore } from '../store/useTopologyStore';
import { X, Settings2, Trash2 } from 'lucide-react';

export default function NodeDrawer() {
  const { selectedNode, setSelectedNode, updateNodeData } = useTopologyStore();

  if (!selectedNode) return null;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(selectedNode.id, { label: e.target.value });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-stone-200 z-50 transition-transform duration-300 transform translate-x-0">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div className="flex items-center gap-2 font-bold text-stone-700">
          <Settings2 size={18} />
          <span>Node Configuration</span>
        </div>
        <button 
          onClick={() => setSelectedNode(null)}
          className="p-1 hover:bg-stone-200 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Basic Info */}
        <section className="space-y-4">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Common Properties</h3>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600 block">Identifier</label>
            <div className="px-3 py-2 bg-stone-100 rounded text-stone-500 text-sm font-mono border border-stone-200">
              {selectedNode.id}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600 block">Node Label</label>
            <input 
              type="text" 
              value={(selectedNode.data.label as string) || ''}
              onChange={handleLabelChange}
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="Enter node name..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-stone-600 block">Device Type</label>
            <div className="capitalize px-3 py-2 bg-orange-50 text-orange-700 rounded-md border border-orange-100 text-sm font-semibold">
              {selectedNode.type}
            </div>
          </div>
        </section>

        <hr className="border-stone-100" />

        {/* Actions */}
        <section className="space-y-4 pt-4">
          <button 
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors font-medium border border-red-100"
            onClick={() => {
                // Future implementation: delete node
                setSelectedNode(null);
            }}
          >
            <Trash2 size={16} />
            Remove Device
          </button>
        </section>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-stone-50 border-t border-stone-200 italic text-[10px] text-stone-400 text-center">
        Changes are synchronized in real-time.
      </div>
    </div>
  );
}

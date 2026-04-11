import { create } from 'zustand';
import { Node } from '@xyflow/react';

interface TopologyState {
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
  updateNodeData: (nodeId: string, data: any) => void;
}

export const useTopologyStore = create<TopologyState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
  updateNodeData: (nodeId, data) => 
    set((state) => {
      if (state.selectedNode?.id === nodeId) {
        return {
          selectedNode: {
            ...state.selectedNode,
            data: { ...state.selectedNode.data, ...data },
          },
        };
      }
      return state;
    }),
}));

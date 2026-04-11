import React from 'react';
import { Download, Code, Image as ImageIcon, FileJson } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Node, Edge } from '@xyflow/react';

interface ExportToolbarProps {
  nodes: Node[];
  edges: Edge[];
  topologyId: string;
}

export default function ExportToolbar({ nodes, edges, topologyId }: ExportToolbarProps) {
  
  const handleExportJson = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `topology-${topologyId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportImage = async () => {
    const element = document.querySelector('.react-flow') as HTMLElement;
    if (!element) return;
    try {
      const dataUrl = await toPng(element, {
        backgroundColor: '#ffffff',
        // Optional filters for ignoring controls/minimap can go here
        filter: (node) => {
          if (node?.classList?.contains('react-flow__controls') || 
              node?.classList?.contains('react-flow__minimap') ||
              node?.classList?.contains('react-flow__panel')) {
            return false;
          }
          return true;
        }
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `topology-${topologyId}.png`;
      a.click();
    } catch (error) {
      console.error('Failed to export image', error);
      alert('Failed to export image.');
    }
  };

  const handleExportMermaid = () => {
    let mermaid = 'graph TD;\n';
    
    nodes.forEach(n => {
      // Clean labels for mermaid
      const label = n.data?.label || n.id;
      const cleanLabel = String(label).replace(/['"]/g, '');
      mermaid += `  ${n.id}["${cleanLabel}"];\n`;
    });

    edges.forEach(e => {
      mermaid += `  ${e.source} --> ${e.target};\n`;
    });

    navigator.clipboard.writeText(mermaid).then(() => {
      alert('Mermaid syntax copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy mermaid', err);
    });
  };

  const handleExportPacketTracer = () => {
    // Navigates to the API route to trigger XML download
    window.location.href = `http://localhost:3002/export/${topologyId}/packet-tracer`;
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2 bg-white/90 backdrop-blur p-2 rounded-md shadow-md border border-stone-200">
      <button
        onClick={handleExportJson}
        className="flex items-center gap-1 p-2 rounded hover:bg-stone-100 text-stone-700 transition"
        title="Export JSON"
      >
        <FileJson size={16} /> <span className="text-xs font-semibold">JSON</span>
      </button>
      <button
        onClick={handleExportImage}
        className="flex items-center gap-1 p-2 rounded hover:bg-stone-100 text-stone-700 transition"
        title="Export PNG Screenshot"
      >
        <ImageIcon size={16} /> <span className="text-xs font-semibold">PNG</span>
      </button>
      <button
        onClick={handleExportMermaid}
        className="flex items-center gap-1 p-2 rounded hover:bg-stone-100 text-stone-700 transition"
        title="Copy Mermaid string to clipboard"
      >
        <Code size={16} /> <span className="text-xs font-semibold">Mermaid</span>
      </button>
      <button
        onClick={handleExportPacketTracer}
        className="flex items-center gap-1 p-2 rounded hover:bg-stone-100 text-blue-600 transition"
        title="Download Cisco Packet Tracer (.pkt) XML Configuration"
      >
        <Download size={16} /> <span className="text-xs font-semibold">Packet Tracer</span>
      </button>
    </div>
  );
}

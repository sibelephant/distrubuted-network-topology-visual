import React, { useState } from 'react';
import { Calculator, X } from 'lucide-react';

export default function IpCalculator() {
  const [open, setOpen] = useState(false);
  const [ip, setIp] = useState('192.168.1.0');
  const [prefix, setPrefix] = useState(24);

  const calculateSubnet = (): { 
    error?: string; 
    mask?: string; 
    network?: string; 
    broadcast?: string; 
    numHosts?: number; 
    firstHost?: string; 
    lastHost?: string; 
  } | null => {
    try {
      if (!ip) return null;
      const ipParts = ip.split('.').map(Number);
      if (ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return { error: 'Invalid IPv4 Address' };
      }

      if (prefix < 0 || prefix > 32) return { error: 'Invalid Prefix (0-32)' };

      // Calculate mask
      const maskBinary = '1'.repeat(prefix) + '0'.repeat(32 - prefix);
      const maskParts = [
        parseInt(maskBinary.substring(0, 8), 2),
        parseInt(maskBinary.substring(8, 16), 2),
        parseInt(maskBinary.substring(16, 24), 2),
        parseInt(maskBinary.substring(24, 32), 2),
      ];

      // Calculate Network
      const networkParts = ipParts.map((part, i) => part & maskParts[i]);
      
      // Calculate Broadcast
      const broadcastParts = networkParts.map((part, i) => part | (255 - maskParts[i]));

      const numHosts = Math.max(0, Math.pow(2, 32 - prefix) - 2);

      return {
        mask: maskParts.join('.'),
        network: networkParts.join('.'),
        broadcast: broadcastParts.join('.'),
        numHosts: prefix === 32 || prefix === 31 ? 0 : numHosts, // /32 and /31 edge cases
        firstHost: prefix >= 31 ? 'N/A' : [...networkParts.slice(0, 3), networkParts[3] + 1].join('.'),
        lastHost: prefix >= 31 ? 'N/A' : [...broadcastParts.slice(0, 3), broadcastParts[3] - 1].join('.'),
      };
    } catch (e) {
      return { error: 'Failed to calculate' };
    }
  };

  const result = calculateSubnet();

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="absolute bottom-4 left-4 z-10 flex items-center gap-2 bg-stone-800 text-white p-3 rounded-full shadow-lg hover:bg-stone-700 transition"
        title="Open IP Subnet Calculator"
      >
        <Calculator size={20} />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-10 w-80 bg-white shadow-2xl rounded-lg border border-stone-200 flex flex-col overflow-hidden">
      <div className="bg-stone-800 text-white p-3 flex justify-between items-center">
        <h3 className="font-semibold text-sm flex items-center gap-2"><Calculator size={16} /> IP / CIDR Calculator</h3>
        <button onClick={() => setOpen(false)} className="hover:text-stone-300">
          <X size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <input 
            type="text" 
            value={ip} 
            onChange={e => setIp(e.target.value)}
            className="border rounded px-2 py-1 flex-1 text-sm outline-none focus:border-blue-500"
            placeholder="IP Address (e.g. 10.0.0.1)"
          />
          <span className="text-xl font-light text-stone-400">/</span>
          <input 
            type="number" 
            value={prefix} 
            onChange={e => setPrefix(parseInt(e.target.value))}
            className="border rounded px-2 py-1 w-16 text-sm outline-none focus:border-blue-500"
            min="0" max="32"
          />
        </div>

        <div className="bg-stone-50 p-3 rounded border text-sm text-stone-700 flex flex-col gap-2">
          {result?.error ? (
            <div className="text-red-500 font-semibold">{result.error}</div>
          ) : result ? (
            <>
              <div className="flex justify-between border-b pb-1">
                <span className="text-stone-500">Subnet Mask:</span>
                <span className="font-mono">{result.mask}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-stone-500">Network ID:</span>
                <span className="font-mono">{result.network}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="text-stone-500">Broadcast:</span>
                <span className="font-mono">{result.broadcast}</span>
              </div>
              <div className="flex flex-col border-b pb-1">
                <span className="text-stone-500 text-xs">Usable Host Range:</span>
                <span className="font-mono text-[11px] text-right mt-1">{result.firstHost} - {result.lastHost}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-500">Usable Hosts:</span>
                <span className="font-bold text-blue-600">{(result.numHosts || 0).toLocaleString()}</span>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

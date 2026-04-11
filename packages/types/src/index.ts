export type NodeType =
  | "ROUTER"
  | "SWITCH_L3"
  | "SWITCH_L2"
  | "HUB"
  | "FIREWALL"
  | "CLIENT"
  | "AP"
  | "CLOUD";

export interface ACLRule {
  action: "ALLOW" | "DENY";
  protocol: string;
  srcIp?: string;
  destIp?: string;
  destPort?: number;
}

export interface PortConfig {
  id: string;
  name: string;
  status: "up" | "down";
  macAddress?: string;
  ipAddress?: string;
}

export interface NodeConfig {
  ipAddress?: string; // CIDR notation
  macAddress?: string;
  defaultGateway?: string;
  routingProtocol?: "static" | "rip" | "ospf";
  ospfAreaId?: number;
  vlans?: number[];
  aclRules?: ACLRule[];
}

export interface NodeDTO {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  config: NodeConfig;
  ports: PortConfig[];
  subnetId?: string;
}

export interface LinkDTO {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  type: "ethernet" | "fiber" | "serial" | "wireless";
  bandwidth: number; // Mbps
  latency: number; // ms
  packetLoss: number; // percentage
}

export interface SubnetDTO {
  id: string;
  name: string;
  cidr: string;
  color: string;
}

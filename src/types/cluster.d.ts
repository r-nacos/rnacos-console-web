export interface IClusterNode {
  nodeId: number;
  addr: string;
  currentNode: boolean;
  raftLeader: boolean;
  distroValid: boolean;
}

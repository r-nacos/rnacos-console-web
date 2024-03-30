export interface IServiceInfo {
  namespaceId: string
  groupName: string
  serviceName: string
  protectThreshold: Number
  metadata?: string
  selector?: string
}

export interface IServiceKey {
  namespaceId: string
  groupName: string
  serviceName: string
}

export interface IServiceInstance {
  serviceName: string
  groupName?: string
  ip: string
  port: string
  clusterName?: string
  namespaceId?: string
  weight?: Number
  metadata?: string
  enabled?: Boolean
  ephemeral?: Boolean
}

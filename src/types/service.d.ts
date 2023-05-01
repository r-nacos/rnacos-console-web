
export interface IServiceInfo {
  namespaceId:string,
  groupName:string,
  serviceName:string,
  protectThreshold:Number,
  metadata?:string,
  selector?:string,
}

export interface IServiceKey {
  namespaceId:string,
  groupName:string,
  serviceName:string,
}
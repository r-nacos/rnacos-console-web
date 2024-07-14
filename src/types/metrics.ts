export interface TimelineSummary {
  boundKeys: Array<string>;
  bounds: Array<number>;
  rpsData: Array<number>;
  averageData: Array<number>;
  countData: Array<number>;
  itemsData: Map<string, Array<number>>;
}

export interface TimelineQueryResponse {
  lastTime: number;
  fromNodeId: number;
  intervalSecond: number;
  timeIndex: Array<number>;
  gaugeData: Map<string, Array<number>>;
  summeryData: Map<string, TimelineSummary>;
}

export interface TimelineQueryParam {
  startTime: number;
  timelineGroupName: String; //LEAST | MINUTE
  keys: Array<string>;
  nodeId: number;
}

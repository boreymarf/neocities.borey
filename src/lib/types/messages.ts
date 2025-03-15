export interface BaseMessage {
  readonly type: string;
}

export interface BuildMessage {
  type: "build",
  data?: any
}

export interface ResultMessage extends BaseMessage {
  type: "result",
  status: "failure" | "success"
  data?: any
}

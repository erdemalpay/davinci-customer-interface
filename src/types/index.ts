export enum ButtonCallTypeEnum {
  TABLECALL = "TABLECALL",
  GAMEMASTERCALL = "GAMEMASTERCALL",
  ORDERCALL = "ORDERCALL",
  ORDERREADYCALL = "ORDERREADYCALL",
}

export enum ButtonCallType {
  ACTIVE = "active",
  ALL = "all",
}

export enum ButtonCallActionEnum {
  CREATE = "create",
  RECALL = "recall",
  CLOSE = "close",
  ASSIGN = "assign",
}

export interface ScreenImage {
  url: string;
}

export interface ButtonCallChangedPayload {
  location?: number;
  type?: ButtonCallTypeEnum;
  action?: ButtonCallActionEnum;
}

export enum LocationEnum {
  BAHCELI = 1,
  NEORAMA = 2,
}
export type Feedback = {
  _id: number;
  location: number;
  tableName: string;
  comment?: string;
  starRating?: number;
  table: number;
  createdAt: Date;
};
export enum GmCallReasonEnum {
  RECOMMENDATION = "RECOMMENDATION",
  EXPLANATION = "EXPLANATION",
  QUESTION = "QUESTION",
}
export type MinimalGame = {
  _id: number;
  name: string;
};
export type ButtonCall = {
  _id: string;
  tableName: string;
  location: number;
  locationName?: string;
  date: string;
  type: ButtonCallTypeEnum;
  startHour: string;
  finishHour?: string;
  createdBy?: string;
  cancelledBy?: string;
  cancelledByName?: string;
  gmCallReason?: GmCallReasonEnum;
  game?: number;
  assignedTo?: string;
  duration?: number;
  callCount: number;
};
// What the public cafe TV screen gets for an active call.
export type ScreenButtonCall = {
  _id: number;
  tableName: string;
  type: ButtonCallTypeEnum;
  startHour: string;
  assignedToName?: string;
};
export interface SocketEventType {
  event: string;
  invalidateKeys: string[];
}

export interface CloseButtonCallInput {
  tableName: string;
  location: number;
  hour: string;
  type: ButtonCallTypeEnum;
}

export interface FormElementsState {
  location: number | string;
  cancelledBy: string[];
  tableName: string;
  date: string;
  before: string;
  after: string;
  type: string[];
  sort: string;
  asc: boolean | undefined;
  search: string;
}

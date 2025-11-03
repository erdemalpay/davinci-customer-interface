export enum ButtonCallTypeEnum {
  TABLECALL = "TABLECALL",
  GAMEMASTERCALL = "GAMEMASTERCALL",
  ORDERCALL = "ORDERCALL",
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
  duration?: number;
  callCount: number;
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

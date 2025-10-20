import { ButtonCall } from "../../types";
import { Paths, useGet, useMutationApi } from "./factory";

const baseUrl = `${Paths.ButtonCalls}`;

export interface ButtonCallInput extends ButtonCall {
  hour: string;
}
export interface QueuePayload {
  isQueued: boolean;
  position: number;
  waitingCount: number;
  totalActive: number;
}
export type QueueResponse = Record<string, QueuePayload>;

export function useButtonCallMutations() {
  const { createItem: createButtonCall } = useMutationApi<ButtonCallInput>({
    baseQuery: baseUrl,
  });

  return { createButtonCall };
}
export function useGetQueue(location: number, tableName: string) {
  const queryString = new URLSearchParams({
    location: String(location),
    tableName: tableName ?? "",
  }).toString();

  const url = `${baseUrl}/queue?${queryString}`;
  return useGet<QueueResponse>(
    url,
    [baseUrl, "queue", location, tableName],
    true
  );
}

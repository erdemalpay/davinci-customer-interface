import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { post } from ".";
import {
  ButtonCall,
  ButtonCallType,
  CloseButtonCallInput,
  FormElementsState,
} from "../../types";
import { Paths, useGet, useGetList, useMutationApi } from "./factory";

const baseUrl = `${Paths.ButtonCalls}`;

export interface ButtonCallsPayload {
  data: ButtonCall[];
  totalNumber: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface UpdateButtonCallPayload {
  location: number;
  tableName: string;
  hour: string;
  type?: string;
}

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

  const closeButtonCallFromPanel = (payload: CloseButtonCallInput) => {
    return post<CloseButtonCallInput, ButtonCall>({
      path: `${baseUrl}/close-from-customer`,
      payload,
    });
  };

  return { createButtonCall, closeButtonCallFromPanel };
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

export function useGetActiveButtonCalls(
  location: number,
  type = ButtonCallType.ACTIVE
) {
  const today = new Date().toISOString().split("T")[0];
  return useGetList<ButtonCall>(
    `${Paths.ButtonCalls}?location=${location}&date=${today}&type=${type}`,
    [`${Paths.ButtonCalls}`, location, today, type]
  );
}

export function useGetButtonCalls() {
  return useGetList<ButtonCall>(Paths.ButtonCalls);
}

export function useGetQueryButtonCalls(
  page: number,
  limit: number,
  filters: FormElementsState
) {
  const parts = [
    `page=${page}`,
    `limit=${limit}`,
    filters.location && `location=${filters.location}`,
    filters.cancelledBy.length > 0 &&
      `cancelledBy=${filters.cancelledBy.join(",")}`,
    filters.tableName && `tableName=${filters.tableName}`,
    filters.date && `date=${filters.date}`,
    filters.before && `before=${filters.before}`,
    filters.after && `after=${filters.after}`,
    filters.type.length > 0 && `type=${filters.type.join(",")}`,
    filters.sort && `sort=${filters.sort}`,
    filters.asc !== undefined && `asc=${filters.asc}`,
    filters.search && `search=${filters.search.trim()}`,
  ];

  const queryString = parts.filter(Boolean).join("&");
  const url = `${baseUrl}/query?${queryString}`;

  return useGet<ButtonCallsPayload>(url, [url, page, limit, filters], true);
}

export function finishButtonCall({
  location,
  tableName,
  hour,
  type,
}: UpdateButtonCallPayload): Promise<ButtonCall> {
  return post<UpdateButtonCallPayload, ButtonCall>({
    path: `${Paths.ButtonCalls}/close-from-panel`,
    payload: {
      location: location,
      tableName: tableName,
      hour: hour,
      type: type,
    },
  });
}

export function useFinishButtonCallMutation(location: number) {
  const today = new Date().toISOString().split("T")[0];
  const queryClient = useQueryClient();
  const queryKey = [Paths.ButtonCalls, location, today];

  return useMutation({
    mutationFn: finishButtonCall,
    onMutate: async ({ tableName }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousButtonCalls =
        queryClient.getQueryData<ButtonCall[]>(queryKey) || [];

      const updatedButtonCalls = [...previousButtonCalls];

      for (let i = 0; i < updatedButtonCalls.length; i++) {
        if (updatedButtonCalls[i].tableName === tableName) {
          updatedButtonCalls[i] = {
            ...updatedButtonCalls[i],
          };
        }
      }

      queryClient.setQueryData(queryKey, updatedButtonCalls);

      return { previousButtonCalls };
    },
    onError: (_err: unknown, _newButtonCall, context) => {
      const previousButtonCallContext = context as {
        previousButtonCalls: ButtonCall[];
      };
      if (previousButtonCallContext?.previousButtonCalls) {
        const { previousButtonCalls } = previousButtonCallContext;
        queryClient.setQueryData<ButtonCall[]>(queryKey, previousButtonCalls);
      }
      const errorMessage =
        (_err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "An unexpected error occurred";
      setTimeout(() => toast.error(errorMessage), 200);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

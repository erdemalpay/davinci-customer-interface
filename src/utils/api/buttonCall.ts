import { ButtonCall } from "./../../types/index";
import { Paths, useMutationApi } from "./factory";

const baseUrl = `${Paths.ButtonCalls}`;
export interface ButtonCallInput extends ButtonCall {
  hour: string;
}
export function useButtonCallMutations() {
  const { createItem: createButtonCall } = useMutationApi<ButtonCallInput>({
    baseQuery: baseUrl,
  });

  return { createButtonCall };
}

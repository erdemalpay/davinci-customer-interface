import { Feedback } from "../../types";
import { Paths, useMutationApi } from "./factory";

const baseUrl = `${Paths.Tables}/feedback`;
export function useFeedbackMutations() {
  const { createItem: createFeedback } = useMutationApi<Feedback>({
    baseQuery: baseUrl,
  });
  return { createFeedback };
}

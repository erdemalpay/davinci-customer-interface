import axios from "../axios";

export const createFeedback = async (feedback: {
  location: number;
  tableName: string;
  starRating?: number;
  comment?: string;
}) => {
  const { data } = await axios.post("/tables/feedback", feedback);
  return data;
};

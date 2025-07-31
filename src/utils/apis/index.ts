import { ButtonCallTypeEnum } from "../../types";
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

export const callHelp = async (buttonCall: {
  location: number;
  type: ButtonCallTypeEnum;
  tableName: string;
  hour: string;
}) => {
  const { data } = await axios.post("/button-calls", buttonCall);
  return data;
};

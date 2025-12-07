import * as yup from "yup";
import { addLogSchema } from "../schema";

export interface IAddLogForm extends yup.InferType<typeof addLogSchema> {}

export interface IMinePayload {
  date: string;
}

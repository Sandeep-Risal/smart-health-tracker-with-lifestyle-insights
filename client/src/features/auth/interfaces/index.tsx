import * as yup from "yup";
import { loginSchema } from "../schema";

export interface ILoginForm extends yup.InferType<typeof loginSchema> {}

import * as yup from "yup";
import { loginSchema, registerSchema } from "../schema";

export interface ILoginForm extends yup.InferType<typeof loginSchema> {}

export interface IRegisterForm extends yup.InferType<typeof registerSchema> {}

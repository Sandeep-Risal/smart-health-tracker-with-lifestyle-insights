"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { constants } from "@/src/constants";
import { CookieKeys, TOAST_TYPES } from "@/src/enums";
import { IError } from "@/src/interfaces";
import PasswordInput from "@/src/shared/components/password-input";
import { Button } from "@/src/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/shared/components/ui/form";
import { Input } from "@/src/shared/components/ui/input";
import { showToast } from "@/src/shared/lib/toast-utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { ILoginForm } from "../../interfaces";
import { loginSchema } from "../../schema";
import { login } from "../../services";

const LoginForm = () => {
  const router = useRouter();
  const form = useForm<ILoginForm>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      form.reset();
      setCookie(CookieKeys.IS_LOGGED_IN, true);
      showToast(TOAST_TYPES.success, data?.data?.message);
      router.push("/");
    },
    onError: (error: IError) => {
      if (error?.key && Array.isArray(error?.key)) {
        error?.key.forEach((key) => {
          form.setError(key as "username" | "password", {
            message: error?.error,
          });
        });
      } else {
        showToast(TOAST_TYPES.error, constants?.messages?.SOMETHING_WENT_WRONG);
      }
    },
  });

  const onSubmit: SubmitHandler<ILoginForm> = (data) => {
    loginMutation.mutate(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          loading={loginMutation.isLoading}
          disabled={loginMutation.isLoading}
        >
          Login
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;

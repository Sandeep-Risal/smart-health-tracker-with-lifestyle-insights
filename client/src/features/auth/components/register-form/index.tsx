"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";

import { constants } from "@/src/constants";
import { TOAST_TYPES } from "@/src/enums";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { showToast } from "@/src/shared/lib/toast-utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { IRegisterForm } from "../../interfaces";
import { registerSchema } from "../../schema";
import { register } from "../../services";

export interface IErrMain {
  error: IError;
}

const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<IRegisterForm>({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      gender: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      form.reset();
      showToast(
        TOAST_TYPES.success,
        data?.data?.message || "Registration successful!"
      );
      router.push("/login");
    },
    onError: (err: IErrMain) => {
      const error = err?.error;
      console.log("error", error);
      if (error?.key && Array.isArray(error?.key)) {
        error?.key.forEach((key) => {
          form.setError(key as keyof IRegisterForm, {
            message: error?.error,
          });
        });
      } else {
        showToast(TOAST_TYPES.error, constants?.messages?.SOMETHING_WENT_WRONG);
      }
    },
  });

  const onSubmit: SubmitHandler<IRegisterForm> = (data) => {
    // console.log("data", data);
    registerMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          loading={registerMutation.isLoading}
          disabled={registerMutation.isLoading}
        >
          Register
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;

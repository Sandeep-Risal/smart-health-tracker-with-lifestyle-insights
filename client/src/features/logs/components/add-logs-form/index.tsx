"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import moment from "moment";

import { constants } from "@/src/constants";
import { TOAST_TYPES } from "@/src/enums";
import { IError } from "@/src/interfaces";
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
import { DatePicker } from "@/src/shared/components/ui/date-picker";
import { showToast } from "@/src/shared/lib/toast-utils";
import { yupResolver } from "@hookform/resolvers/yup";

import { IAddLogForm } from "../../interfaces/add-log-interface";
import { addLogSchema } from "../../schema";
import { createLog } from "../../services";

export interface IErrMain {
  error: IError;
}

const AddLogsForm = () => {
  const router = useRouter();
  const form = useForm<IAddLogForm>({
    resolver: yupResolver(addLogSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      date: moment().format("YYYY-MM-DD"),
      steps: "",
      sleep_hours: "",
      water_liters: "",
      calories: "",
      avg_heart_rate: "",
      energy_level: "",
    },
  });

  const createLogMutation = useMutation({
    mutationFn: createLog,
    onSuccess: async (data) => {
      form.reset();
      showToast(
        TOAST_TYPES.success,
        data?.data?.message || "Log saved successfully!"
      );
      router.back();
    },
    onError: (err: IErrMain) => {
      const error = err?.error;
      console.log("error", error);
      if (error?.key && Array.isArray(error?.key)) {
        error?.key.forEach((key) => {
          form.setError(key as keyof IAddLogForm, {
            message: error?.error,
          });
        });
      } else {
        showToast(TOAST_TYPES.error, constants?.messages?.SOMETHING_WENT_WRONG);
      }
    },
  });

  const onSubmit: SubmitHandler<IAddLogForm> = (data) => {
    const payload: any = {
      ...data,
      steps: Number(data.steps),
      sleep_hours: Number(data.sleep_hours),
      water_liters: parseFloat(data.water_liters),
      calories: Number(data.calories),
      avg_heart_rate: Number(data.avg_heart_rate),
      energy_level: Number(data.energy_level),
    };
    createLogMutation.mutate(payload);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col bg-[#f9fafc] p-7 rounded-2xl"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  label="Date"
                  disabled
                  value={
                    field.value
                      ? moment(field.value, "YYYY-MM-DD").toDate()
                      : new Date()
                  }
                  onChange={(date) => {
                    if (date) {
                      const formattedDate = moment(date).format("YYYY-MM-DD");
                      field.onChange(formattedDate);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="steps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Steps</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Steps"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sleep_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sleep Hours</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Sleep Hours"
                    step="0.1"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="water_liters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water (Liters)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Water in Liters"
                    step="0.1"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Calories</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Calories"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="avg_heart_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Average Heart Rate</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Average Heart Rate"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="energy_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Energy Level (0-10)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Energy Level"
                    min="0"
                    max="10"
                    {...field}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          loading={createLogMutation.isLoading}
          disabled={createLogMutation.isLoading}
        >
          Save Log
        </Button>
      </form>
    </Form>
  );
};

export default AddLogsForm;

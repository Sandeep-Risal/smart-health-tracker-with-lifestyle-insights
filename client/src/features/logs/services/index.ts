import httpRequest from "@/src/axios/axiosInstance";
import { HttpMethods } from "@/src/enums";

import { IAddLogForm, IMinePayload } from "../interfaces/add-log-interface";

const getLogs = (startDate?: string, endDate?: string) => {
  return httpRequest("/api/logs", HttpMethods.GET, {
    params: {
      startDate,
      endDate,
    },
  });
};

const createLog = (data: IAddLogForm) => {
  return httpRequest("/api/logs", HttpMethods.POST, data);
};

const mineLog = (data: IMinePayload) => {
  return httpRequest("/api/mine", HttpMethods.POST, data);
};

const getInsights = (date?: string) => {
  return httpRequest("/api/insights", HttpMethods.GET, {
    params: {
      date,
    },
  });
};

export { getLogs, createLog, mineLog, getInsights };

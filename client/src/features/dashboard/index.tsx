"use client";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useDashboard from "@/src/hooks/dashboard/useDashboardHook";
import { ChartConfig, ChartContainer } from "@/src/shared/components/ui/chart";
import { useProfileStore } from "@/src/shared/main-layout/sidebar/store/useProfile.store";
import { Card, CardContent, CardTitle } from "@/src/shared/components/ui/card";

const DashboardContent = () => {
  const { profileData } = useProfileStore();
  const { trendData, isLoading } = useDashboard();

  const stepsChartConfig = {
    steps: {
      label: "Steps",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const sleepChartConfig = {
    hours: {
      label: "Sleep Hours",
      color: "#6EE7B7",
    },
  } satisfies ChartConfig;

  const waterChartConfig = {
    amount: {
      label: "Water (In Liters)",
      color: "#60A5FA",
    },
  } satisfies ChartConfig;

  const heartChartConfig = {
    rate: {
      label: "Avg Heart Rate",
      color: "#F7B267",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <p className="text-3xl">
        {" "}
        Welcome!{" "}
        <span className="font-bold">
          {profileData.first_name} {profileData.last_name}
        </span>
      </p>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Step */}
        <Card>
          <CardContent>
            <CardTitle className="mb-3">Steps</CardTitle>
            <ChartContainer
              config={stepsChartConfig}
              className="min-h-[200px] w-full"
            >
              <LineChart accessibilityLayer data={trendData?.steps}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis width={100} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="step"
                  stroke="#8884d8"
                  isAnimationActive={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardContent>
            <CardTitle className="mb-3">Sleep</CardTitle>
            <ChartContainer
              config={sleepChartConfig}
              className="min-h-[200px] w-full"
            >
              <LineChart accessibilityLayer data={trendData?.sleep_hours}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis width={100} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#6EE7B7"
                  isAnimationActive={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Water */}
        <Card>
          <CardContent>
            <CardTitle className="mb-3">Water (in liters)</CardTitle>
            <ChartContainer
              config={waterChartConfig}
              className="min-h-[200px] w-full"
            >
              <LineChart accessibilityLayer data={trendData?.water}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis width={100} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#60A5FA"
                  isAnimationActive={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Heart Rate */}
        <Card>
          <CardContent>
            <CardTitle className="mb-3">Avg. Heart Rate</CardTitle>
            <ChartContainer
              config={heartChartConfig}
              className="min-h-[200px] w-full"
            >
              <LineChart accessibilityLayer data={trendData?.avg_heart_rate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis width={100} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#F7B267"
                  isAnimationActive={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;

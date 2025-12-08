import { getTrend } from "@/src/features/dashboard/services";
import { useQuery } from "react-query";

interface TrendStepEntry {
  date: string;
  step: number;
}

interface TrendWaterEntry {
  date: string;
  amount: number;
}

interface TrendSleepHoursEntry {
  date: string;
  hours: number;
}

interface TrendHeartRateEntry {
  date: string;
  rate: number;
}

interface ITrendData {
  steps: TrendStepEntry[];
  water: TrendWaterEntry[];
  sleep_hours: TrendSleepHoursEntry[];
  avg_heart_rate: TrendHeartRateEntry[];
}

interface IProps {
  data: {
    data: ITrendData;
  };
}

const useDashboard = () => {
  const { data, isLoading } = useQuery<IProps>({
    queryFn: getTrend,
    queryKey: ["getTrend"],
  });

  return { trendData: data?.data?.data, isLoading };
};

export default useDashboard;

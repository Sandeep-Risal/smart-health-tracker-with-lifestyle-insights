export interface ILogsData {
  data: ILogDetails[];
}
export interface ILogDetails {
  avg_heart_rate: number;
  calories: number;
  date: string;
  energy_level: number;
  log_id: number;
  sleep_hours: number;
  steps: number;
  water_liters: number;
}

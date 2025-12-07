import * as yup from "yup";

export const addLogSchema = yup.object().shape({
  date: yup
    .string()
    .required("Date is required.")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  steps: yup
    .string()
    .required("Steps is required.")
    .matches(/^\d+$/, "Steps must be a positive number."),
  sleep_hours: yup
    .string()
    .required("Sleep hours is required.")
    .matches(
      /^(?:[0-9]|1[0-9]|2[0-4])(?:\.\d+)?$/,
      "Sleep hours must be a positive number up to 24."
    ),
  water_liters: yup
    .string()
    .required("Water intake is required.")
    .matches(/^\d*\.?\d+$/, "Water intake must be a positive number."),
  calories: yup
    .string()
    .required("Calories is required.")
    .matches(/^\d+$/, "Calories must be a positive number."),
  avg_heart_rate: yup
    .string()
    .required("Average heart rate is required.")
    .matches(
      /^([0-9]{1,2}|1\d{2}|2[0-1][0-9]|220)$/,
      "Average heart rate must be a positive number up to 220."
    ),
  energy_level: yup
    .string()
    .required("Energy level is required.")
    .matches(/^([0-9]|10)$/, "Energy level must be between 0 and 10."),
});

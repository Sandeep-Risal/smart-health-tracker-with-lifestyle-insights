import * as yup from "yup";

const basicFieldsValidation = {
  fullName: yup
    .string()
    .required("Fullname is required.")
    .max(50, "Fullname must not exceed 50 characters."),
  phoneNum: yup
    .string()
    .required("Phone number is required.")
    .max(15, "Phone number must not exceed 15 numbers.")
    .matches(/^[0-9]+$/, "Phone number must contain only numbers."),
  address: yup.string().max(100, "Address must not exceed 100 characters"),
  email: yup
    .string()
    .required("Email is required.")
    .max(50, "Email must not exceed 50 characters.")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
      "Please enter a valid email address."
    ),
  username: yup
    .string()
    .required("Username is required.")
    .max(15, "Username must not exceed 15 characters."),
};

const passwordFieldsValidation = {
  password: yup
    .string()
    .required("Password is required.")
    .min(5, "Password must be atleast of 5 characters")
    .max(50, "Password must not exceed 50 characters."),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required.")
    .oneOf([yup.ref("password")], "Confirm password must match password."),
};

const loginSchema = yup.object().shape({
  email: basicFieldsValidation.email,
  password: yup.string().required("Password is required."),
});

const registerSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required.")
    .max(50, "First name must not exceed 50 characters."),
  last_name: yup
    .string()
    .required("Last name is required.")
    .max(50, "Last name must not exceed 50 characters."),
  email: basicFieldsValidation.email,
  password: passwordFieldsValidation.password,
  confirmPassword: passwordFieldsValidation.confirmPassword,
  dob: yup
    .string()
    .required("Date of birth is required.")
    .matches(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of birth must be in YYYY-MM-DD format."
    ),
  gender: yup
    .string()
    .required("Gender is required.")
    .oneOf(["Male", "Female", "Other"], "Please select a valid gender."),
});

export {
  basicFieldsValidation,
  passwordFieldsValidation,
  loginSchema,
  registerSchema,
};

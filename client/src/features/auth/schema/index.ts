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
  newPassword: yup
    .string()
    .required("Password is required.")
    .min(5, "Password must be atleast of 5 characters")
    .max(50, "Password must not exceed 50 characters."),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required.")
    .oneOf([yup.ref("newPassword")], "Confirm password must match password."),
};

const loginSchema = yup.object().shape({
  username: basicFieldsValidation.username,
  password: yup.string().required("Password is required."),
});

export { basicFieldsValidation, passwordFieldsValidation, loginSchema };

export const constants = {
  status: {
    UNPROCESSIBLE: 422,
    NOT_FOUND: 404,
    INTERNAL_SERVER: 500,
    FORBIDDEN: 403,
  },
  messages: {
    NOT_FOUND: "Record not found.",
    SOMETHING_WENT_WRONG: "Something went wrong.",
    SESSION_EXPIRED: "Your session has expired!",
    TIMEOUT: "Request timed out",
  },
};

export const authRoutes = ["/login", "/register", "/forgot-password", "/reset"];

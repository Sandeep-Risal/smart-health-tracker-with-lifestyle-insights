import Link from "next/link";
import React from "react";

import LoginForm from "@/src/features/auth/components/login-form";

const Login = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <LoginForm />
      <br />
      <hr />
      <p className="text-base mt-4">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <Link href="/register" className="text-bold underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;

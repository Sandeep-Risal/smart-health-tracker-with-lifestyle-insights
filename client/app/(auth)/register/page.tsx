import RegisterForm from "@/src/features/auth/components/register-form";
import Link from "next/link";
import React from "react";

const Register = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      <RegisterForm />
      <br />
      <hr />
      <p className="text-sm mt-4">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/login" className="text-bold underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;

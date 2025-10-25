import { Link } from "iconsax-react";
import React from "react";

const Register = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
      {/* FForm here */}
      <br />
      <hr />
      <p className="text-base mt-4">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/register" className="text-bold underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;

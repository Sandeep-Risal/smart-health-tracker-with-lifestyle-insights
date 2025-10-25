import { Eye, EyeSlash } from "iconsax-react";
import React, { InputHTMLAttributes, useState } from "react";

import { FormControl } from "../ui/form";
import { Input } from "../ui/input";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <FormControl>
        <Input
          type={showPassword ? "text" : "password"}
          className="pr-12 placeholder:text-gray-270 text-color"
          placeholder={placeholder}
          {...props}
        />
      </FormControl>
      <div
        onClick={toggleShowPassword}
        className="absolute top-2 right-4 p-0 h-auto cursor-pointer"
      >
        {showPassword ? (
          <Eye size="20" color="#84919A" variant="TwoTone" />
        ) : (
          <EyeSlash size="20" color="#84919A" variant="TwoTone" />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;

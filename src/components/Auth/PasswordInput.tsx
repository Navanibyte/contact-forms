import React from "react";
import { useState, type ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";


interface PasswordInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  name,
  required = true,
  disabled = false,
  className = "",
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  const toggleVisibility = () => {
    if (!disabled) {
      setShow(!show);
    }
  };

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`
          w-full border border-gray-300 p-3 rounded-lg pr-10
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          transition-colors
          ${disabled
            ? "bg-gray-100 cursor-not-allowed opacity-60"
            : "bg-white"
          }
          ${className}
        `}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        disabled={disabled}
        className={`
          absolute right-3 top-1/2 transform -translate-y-1/2
          text-gray-500 hover:text-gray-700 transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        `}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
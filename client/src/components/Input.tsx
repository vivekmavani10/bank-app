import React from "react";

interface InputProps {
  label: string;
  type?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  required = false,
  className = "",
}) => {
  return (
    <div className={`w-full space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-[#004466]">
        {label}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full h-10 px-4 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#004466] focus:border-[#004466] transition"
      />
    </div>
  );
};

export default Input;

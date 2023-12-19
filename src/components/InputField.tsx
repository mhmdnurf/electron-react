import React from "react";

interface Input {
  width: string;
  type: string;
  disabled?: boolean;
  name: string;
  value: string | number | Date;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  width,
  type,
  disabled,
  name,
  onChange,
  value,
}: Input): React.JSX.Element => {
  const formattedValue =
    typeof value === "number" || value instanceof Date
      ? value.toString()
      : value;
  return (
    <>
      <input
        type={type}
        className={`w-${width} border-4 p-2 rounded-md`}
        disabled={disabled}
        name={name}
        onChange={onChange}
        value={formattedValue}
      />
    </>
  );
};

export default InputField;

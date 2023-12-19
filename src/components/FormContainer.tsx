import React from "react";

interface Form {
  children: React.ReactNode;
}

const FormContainer = ({ children }: Form) => {
  return (
    <div className="mx-10 mt-2 flex flex-col w-1/3 h-full">{children}</div>
  );
};

export default FormContainer;

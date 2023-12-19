import React from "react";

interface Label {
  title: string;
}

const Label = ({ title }: Label): React.JSX.Element => {
  return (
    <>
      <label className="mb-2 text-xl mt-8 font-semibold text-slate-700">
        {title}
      </label>
    </>
  );
};

export default Label;

import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<Props> = ({ title, children }) => (
  <div className="bg-white shadow-sm rounded-lg p-6">
    <h2 className="text-xl font-semibold text-[#004466] mb-4">{title}</h2>
    {children}
  </div>
);

export default Section;

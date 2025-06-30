import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<Props> = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 mt-6">
    <h2 className="text-lg sm:text-xl font-semibold text-[#004466] mb-4 border-b border-gray-200 pb-2">
      {title}
    </h2>
    <div className="text-gray-700">{children}</div>
  </div>
);

export default Section;

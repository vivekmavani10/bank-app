import React from "react";

interface Props {
  title: string;
  value: string;
}

const SummaryCard: React.FC<Props> = ({ title, value }) => (
  <div className="bg-white shadow rounded-lg p-5 text-center border-t-4 border-[#004466]">
    <p className="text-sm text-gray-600">{title}</p>
    <p className="text-xl font-bold text-[#004466] mt-1">{value}</p>
  </div>
);

export default SummaryCard;

import React from "react";

interface Props {
  label: string;
  value: string;
}

const Info: React.FC<Props> = ({ label, value }) => (
  <div className="mb-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-800">{value || "-"}</p>
  </div>
);

export default Info;

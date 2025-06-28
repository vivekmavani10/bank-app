import React from "react";
import Button from "./Button";

interface PopupProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Popup: React.FC<PopupProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-6">
        {title && (
          <h2 className="text-xl font-bold text-[#004466] text-center mb-4">
            {title}
          </h2>
        )}
        <p className="text-center text-gray-700 mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          <Button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-gray-800 hover:bg-gray-500"
          >
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

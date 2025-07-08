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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md mx-4 transition-all duration-300">
        {/* Title */}
        {title && (
          <h2 className="text-2xl font-bold text-[#004466] text-center mb-4">
            {title}
          </h2>
        )}

        {/* Message */}
        <p className="text-center text-gray-600 text-base mb-6 leading-relaxed">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <Button
            type="button"
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;

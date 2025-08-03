import React from "react";
import Button from "./Button";

interface Props {
  replyText: string;
  onChange: (text: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isEdit?: boolean;
}

const ReplyQuery: React.FC<Props> = ({
  replyText,
  onChange,
  onClose,
  onSubmit,
  isEdit,
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004466] mb-8 text-center">
          {isEdit ? "Edit Reply" : "Reply to Query"}
        </h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Your Reply
          </label>
          <textarea
            rows={5}
            value={replyText}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your reply here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>

          <Button onClick={onSubmit}>
            {isEdit ? "Update Reply" : "Send Reply"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplyQuery;

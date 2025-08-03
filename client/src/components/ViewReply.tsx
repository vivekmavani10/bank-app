import React from "react";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  name: string;
  phone: string;
  account: string;
  query: string;
  reply?: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ViewReply: React.FC<Props> = ({
  name,
  phone,
  account,
  query,
  reply,
  onClose,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004466] mb-8 text-center">
          Query Details
        </h2>

        {/* Horizontal User Info */}
        <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-700 mb-6 gap-2 sm:gap-y-2">
          <div>
            <span className="font-medium text-gray-600">User:</span> {name}
          </div>
          <div>
            <span className="font-medium text-gray-600">Phone:</span> {phone}
          </div>
          <div>
            <span className="font-medium text-gray-600">Account:</span> {account}
          </div>
        </div>

        {/* Query Block */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-1">User Query</h4>
          <div className="bg-gray-100 border rounded-md px-4 py-3 text-gray-800 text-sm whitespace-pre-wrap break-words">
            {query}
          </div>
        </div>

        {/* Reply Section */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-600 mb-1">
                {reply ? "Your Reply" : "No Reply Yet"}
              </h4>
              {reply ? (
                <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-gray-800 text-sm whitespace-pre-wrap break-words">
                  {reply}
                </div>
              ) : (
                <p className="italic text-gray-400">
                  You haven't responded to this query yet.
                </p>
              )}
            </div>

            {reply && (
              <div className="flex gap-2 mt-1 sm:mt-7">
                <button
                  onClick={onEdit}
                  title="Edit Reply"
                  className="p-2 rounded-full bg-white hover:bg-blue-100 transition border"
                >
                  <Pencil className="text-blue-600" size={18} />
                </button>
                <button
                  onClick={onDelete}
                  title="Delete Reply"
                  className="p-2 rounded-full bg-white hover:bg-red-100 transition border"
                >
                  <Trash2 className="text-red-600" size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReply;

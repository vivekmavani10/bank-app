import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import { toast } from "react-toastify";

const dummyQueries = [
  {
    id: 1,
    name: "Amit Kumar",
    phone: "9876543210",
    account: "1234567890",
    query: "I can't see my last transaction.",
  },
  {
    id: 2,
    name: "Priya Shah",
    phone: "9123456780",
    account: "9876543210",
    query: "How do I update my phone number?",
  },
];

const AllQueries = () => {
  const [queries] = useState(dummyQueries);
  const [replyModal, setReplyModal] = useState({ show: false, id: null, isEdit: false });
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState({});
  const [checkedStatus, setCheckedStatus] = useState({});
  const [viewMode, setViewMode] = useState("table"); // "table" or "cards"

  const handleReplySubmit = () => {
    if (!replyText.trim()) {
      toast.warn("Please write a reply.");
      return;
    }

    setReplies((prev) => ({
      ...prev,
      [replyModal.id]: replyText,
    }));

    setReplyText("");
    setReplyModal({ show: false, id: null, isEdit: false });
    
    if (replyModal.isEdit) {
      toast.success("Reply updated!");
    } else {
      toast.success("Reply submitted!");
    }
  };

  const handleCheckboxChange = (id, value) => {
    setCheckedStatus((prev) => ({ ...prev, [id]: value }));
  };

  const openReplyModal = (id, isEdit = false) => {
    if (isEdit && replies[id]) {
      setReplyText(replies[id]);
    } else {
      setReplyText("");
    }
    setReplyModal({ show: true, id, isEdit });
  };

  const closeReplyModal = () => {
    setReplyText("");
    setReplyModal({ show: false, id: null, isEdit: false });
  };

  const handleDeleteReply = (id) => {
    setReplies((prev) => {
      const newReplies = { ...prev };
      delete newReplies[id];
      return newReplies;
    });
    toast.success("Reply deleted!");
  };

  const confirmDeleteReply = (id) => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      handleDeleteReply(id);
    }
  };

  return (
    <PageContainer title="All User Queries">
      {/* View Toggle */}
      <div className="mb-6 flex gap-4">
        <Button
          className={`px-4 py-2 ${viewMode === "table" ? "bg-[#004466]" : "bg-gray-400"}`}
          onClick={() => setViewMode("table")}
        >
          Table View
        </Button>
        <Button
          className={`px-4 py-2 ${viewMode === "cards" ? "bg-[#004466]" : "bg-gray-400"}`}
          onClick={() => setViewMode("cards")}
        >
          Card View
        </Button>
      </div>

      {/* Reply Modal */}
      {replyModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-5 text-gray-600 hover:text-black"
              onClick={closeReplyModal}
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {replyModal.isEdit ? "Edit Reply" : "Reply to Query"}
            </h2>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 resize-none h-32 mb-4"
              placeholder="Write your reply here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <Button className="w-full" onClick={handleReplySubmit}>
              {replyModal.isEdit ? "Update Reply" : "Send Reply"}
            </Button>
          </div>
        </div>
      )}

      {/* Card View */}
      {viewMode === "cards" && (
        <div className="space-y-6">
          {queries.map((q) => (
            <div key={q.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              {/* Query Header */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">{q.name}</h3>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={checkedStatus[q.id] || false}
                        onChange={(e) => handleCheckboxChange(q.id, e.target.checked)}
                      />
                      <span className="text-sm font-medium">
                        {checkedStatus[q.id] ? "Resolved" : "Pending"}
                      </span>
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Phone:</span> {q.phone}
                  </div>
                  <div>
                    <span className="font-medium">Account:</span> {q.account}
                  </div>
                </div>
              </div>

              {/* Query */}
              <div className="mb-4">
                <div className="font-medium text-gray-800 mb-2">Query:</div>
                <div className="bg-gray-50 rounded-lg p-3 text-gray-700">
                  {q.query}
                </div>
              </div>

              {/* Reply Section */}
              <div className="border-t pt-4">
                {replies[q.id] ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-medium text-gray-800">Reply:</div>
                      <div className="flex gap-2">
                        <Button
                          className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600"
                          onClick={() => openReplyModal(q.id, true)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600"
                          onClick={() => confirmDeleteReply(q.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-gray-700">
                      {replies[q.id]}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button
                      className="px-4 py-2"
                      onClick={() => openReplyModal(q.id, false)}
                    >
                      Add Reply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {queries.length === 0 && (
            <div className="text-center py-8 text-gray-500 italic">
              No user queries found.
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="mt-6">
          <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[700px] text-sm text-gray-700 text-left">
              <thead className="bg-[#004466] text-white">
                <tr>
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4">Query</th>
                  <th className="py-3 px-4 text-center">Reply</th>
                  <th className="py-3 px-4 text-center">Resolved?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {queries.map((q) => (
                  <React.Fragment key={q.id}>
                    <tr className="hover:bg-gray-100 transition">
                      <td className="py-3 px-4">{q.name}</td>
                      <td className="py-3 px-4">{q.phone}</td>
                      <td className="py-3 px-4">{q.account}</td>
                      <td className="py-3 px-4 whitespace-pre-wrap">{q.query}</td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          className="text-sm"
                          onClick={() => openReplyModal(q.id, false)}
                        >
                          Reply
                        </Button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <label className="inline-flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={checkedStatus[q.id] || false}
                            onChange={(e) =>
                              handleCheckboxChange(q.id, e.target.checked)
                            }
                          />
                          <span>{checkedStatus[q.id] ? "Yes" : "No"}</span>
                        </label>
                      </td>
                    </tr>

                    {/* Reply Display Row */}
                    {replies[q.id] && (
                      <tr>
                        <td colSpan={6} className="py-2 px-4 bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="text-gray-800 font-medium mb-1">
                                Reply:
                              </div>
                              <div className="text-gray-700">
                                {replies[q.id]}
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600"
                                onClick={() => openReplyModal(q.id, true)}
                              >
                                Edit
                              </Button>
                              <Button
                                className="text-xs px-3 py-1 bg-red-500 hover:bg-red-600"
                                onClick={() => confirmDeleteReply(q.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {queries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center italic text-gray-500">
                      No user queries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default AllQueries;
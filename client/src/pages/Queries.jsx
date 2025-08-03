import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import { toast } from "react-toastify";

const Queries = () => {
  const [showModal, setShowModal] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [submittedQueries, setSubmittedQueries] = useState([
    {
      id: 1,
      text: "I'm having trouble logging into my account. When I enter my credentials, it shows 'Invalid password' even though I'm sure the password is correct.",
      submittedAt: "2025-08-01 14:30:22",
      isRead: false,
      reply: "Thank you for contacting us. We've identified the issue with your account. Please try resetting your password using the 'Forgot Password' link on the login page. If the issue persists, please contact our technical team directly."
    },
    {
      id: 2,
      text: "The dashboard page is loading very slowly and sometimes shows a blank screen. This happens on both Chrome and Firefox browsers.",
      submittedAt: "2025-07-30 09:15:45",
      isRead: true,
      reply: "We acknowledge the performance issue you're experiencing. Our development team is currently working on optimizing the dashboard loading speed. We expect to deploy the fix by next week. Thank you for your patience."
    }
  ]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingQuery, setEditingQuery] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState("");

  // Handle form submission
  const handleSubmit = () => {
    if (!queryText.trim()) {
      toast.warn("Please enter your query.");
      return;
    }

    const newQuery = {
      id: Date.now(),
      text: queryText,
      submittedAt: new Date().toLocaleString(),
      isRead: false,
      reply: ""
    };

    setSubmittedQueries(prev => [...prev, newQuery]);
    setQueryText("");
    setShowModal(false);
    toast.success("Query submitted successfully!");
  };

  // View query details and mark as read
  const viewQueryDetails = (query) => {
    // Mark as read when viewing
    if (!query.isRead) {
      setSubmittedQueries(prev => 
        prev.map(q => q.id === query.id ? { ...q, isRead: true } : q)
      );
    }
    setSelectedQuery({ ...query, isRead: true });
    setShowDetailsModal(true);
  };

  // Edit query
  const handleEdit = (query) => {
    setEditingQuery(query);
    setEditText(query.text);
    setShowEditModal(true);
  };

  // Save edited query
  const saveEdit = () => {
    if (!editText.trim()) {
      toast.warn("Please enter your query.");
      return;
    }

    setSubmittedQueries(prev =>
      prev.map(q => q.id === editingQuery.id ? { ...q, text: editText } : q)
    );
    setShowEditModal(false);
    setEditingQuery(null);
    setEditText("");
    toast.success("Query updated successfully!");
  };

  // Delete query
  const handleDelete = (queryId) => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      setSubmittedQueries(prev => prev.filter(q => q.id !== queryId));
      toast.success("Query deleted successfully!");
    }
  };

  return (
    <PageContainer
      title="Support Queries"
      actions={
        <Button className="w-full mt-2 sm:mt-0" onClick={() => setShowModal(true)}>
          Submit New Query
        </Button>
      }
    >
      {/* Submit Query Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Submit Your Query</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  onClick={() => setShowModal(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Query Description *
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Please describe your issue in detail..."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <Button onClick={handleSubmit}>
                  Submit Query
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Query Modal */}
      {showEditModal && editingQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Edit Query</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  onClick={() => setShowEditModal(false)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Query Description *
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Please describe your issue in detail..."
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
              <div className="flex gap-3 justify-end">
                <button
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <Button onClick={saveEdit}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Query Details Modal */}
      {showDetailsModal && selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Query #{selectedQuery.id}</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleEdit(selectedQuery);
                    }}
                    className="px-3 py-1 bg-[#004466] hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDelete(selectedQuery.id);
                    }}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Submitted: {selectedQuery.submittedAt}</span>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-800 mb-2">Your Query:</h3>
                <p className="text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border">
                  {selectedQuery.text}
                </p>
              </div>

              {selectedQuery.reply && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Support Reply:</h3>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedQuery.reply}
                    </p>
                  </div>
                </div>
              )}

              {!selectedQuery.reply && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    <span className="font-medium">Status:</span> Waiting for support team response
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Queries List */}
      <div className="mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead className="bg-[#004466] text-white">
                <tr>
                  <th className="py-4 px-4 text-left font-semibold">#</th>
                  <th className="py-4 px-4 text-left font-semibold">Query Description</th>
                  <th className="py-4 px-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submittedQueries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No queries submitted yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click "Submit New Query" to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  submittedQueries.map((query, idx) => (
                    <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium text-gray-900">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <p className="text-gray-800">
                              {query.text.length > 120 ? `${query.text.substring(0, 120)}...` : query.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{query.submittedAt}</p>
                          </div>
                          {!query.isRead && (
                            <div className="flex-shrink-0">
                              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewQueryDetails(query)}
                            className="px-3 py-1 bg-[#004466] hover:bg-blue-600 text-white text-xs rounded-md transition-colors"
                          >
                            View
                          </button>
                          
                         
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Queries;
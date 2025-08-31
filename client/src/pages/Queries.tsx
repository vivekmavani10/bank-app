import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import SubmitQuery from "../components/SubmitQuery";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import {
  getQueries,
  submitQuery as submitQueryAPI,
  updateQuery as updateQueryAPI,
  deleteQuery as deleteQueryAPI,
  QueryResponse,
} from "../api/queryApi";
import { toast } from "react-toastify";

const Queries: React.FC = () => {
  const [submittedQueries, setSubmittedQueries] = useState<QueryResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [editUuid, setEditUuid] = useState<string | null>(null);

  const [viewQuery, setViewQuery] = useState<QueryResponse | null>(null);

  const fetchQueries = async () => {
    try {
      const data = await getQueries();
      setSubmittedQueries(data);
    } catch (err) {
      console.error("Failed to fetch queries.");
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleSubmit = async () => {
    if (!queryText.trim()) {
      toast.warn("Please enter your query.");
      return;
    }

    try {
      if (editUuid) {
        await updateQueryAPI(editUuid, { query: queryText.trim() });
      } else {
        await submitQueryAPI({ query: queryText.trim() });
      }

      setQueryText("");
      setEditUuid(null);
      setShowModal(false);
      fetchQueries();
    } catch (err) {
      toast.error("Something went wrong while submitting the query.");
    }
  };

  const handleEdit = (query: QueryResponse) => {
    setQueryText(query.query);
    setEditUuid(query.query_uuid);
    setShowModal(true);
  };

  const handleDelete = async (query_uuid: string) => {
    try {
      await deleteQueryAPI(query_uuid);
      fetchQueries();
    } catch (err) {
      toast.error("Failed to delete query.");
    }
  };

  const handleView = (query: QueryResponse) => {
    setViewQuery(query);
  };

  return (
    <PageContainer
      title="Support Queries"
      actions={
        <Button
          className="w-full mt-2 sm:mt-0"
          onClick={() => setShowModal(true)}
        >
          Submit New Query
        </Button>
      }
    >
      {/* Submit New Query Modal */}
      {showModal && (
        <SubmitQuery
          queryText={queryText}
          onChange={setQueryText}
          onClose={() => {
            setShowModal(false);
            setEditUuid(null);
          }}
          onSubmit={handleSubmit}
        />
      )}

      {/* View Query Modal */}
      {viewQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative min-h-60">
            {/* Close Button (text-based instead of icon) */}
            <button
              onClick={() => setViewQuery(null)}
              className="absolute top-4 right-4 text-sm font-semibold text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004466] mb-8 text-center">
              Query Details
            </h2>

            {/* Query Content */}
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-800">
                  <span className="font-semibold text-[#004466]">Query:</span>{" "}
                  {viewQuery.query}
                </p>
              </div>

              <div className="flex justify-between text-sm text-gray-500">
                <p>
                  Submitted:{" "}
                  {new Date(viewQuery.created_at).toLocaleString("en-IN")}
                </p>
                {viewQuery.updated_at && (
                  <p>
                    Updated:{" "}
                    {new Date(viewQuery.updated_at).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              {/* Reply Section */}
              {viewQuery.is_replied && viewQuery.reply ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <p className="font-semibold text-[#004466] mb-2">Reply:</p>
                  <p className="text-gray-700">{viewQuery.reply}</p>
                </div>
              ) : (
                <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="italic text-gray-500">No reply yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List of Queries */}
      <div className="mt-6 space-y-6">
        {submittedQueries.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No queries submitted yet
          </div>
        ) : (
          submittedQueries.map((q) => (
            <div
              key={q.query_uuid}
              className={`border border-gray-200 rounded-xl p-5 shadow-sm ${
                q.is_replied ? "bg-emerald-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="text-gray-800 font-medium text-base">
                  {q.query}
                </div>
                <div className="flex gap-4 text-gray-500">
                  <Eye
                    className="w-5 h-5 cursor-pointer hover:text-blue-600"
                    onClick={() => handleView(q)}
                  />
                  <Pencil
                    className="w-5 h-5 cursor-pointer hover:text-green-600"
                    onClick={() => handleEdit(q)}
                  />
                  <Trash2
                    className="w-5 h-5 cursor-pointer hover:text-red-600"
                    onClick={() => handleDelete(q.query_uuid)}
                  />
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Submitted At: {new Date(q.created_at).toLocaleString("en-IN")}
                {q.updated_at && (
                  <div className="mt-1">
                    Updated At: {new Date(q.updated_at).toLocaleString("en-IN")}
                  </div>
                )}
              </div>

              {q.is_replied && q.reply ? (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                  <strong className="text-gray-800 block mb-1">Reply:</strong>
                  {q.reply}
                </div>
              ) : (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 italic">
                  No reply yet
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default Queries;

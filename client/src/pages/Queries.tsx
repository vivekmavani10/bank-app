import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import SubmitQuery from "../components/SubmitQuery";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2 } from "lucide-react";
import {
  getQueries,
  submitQuery as submitQueryAPI,
  updateQuery as updateQueryAPI,
  deleteQuery as deleteQueryAPI,
  QueryResponse,
} from "../api/queryApi";

const Queries: React.FC = () => {
  const [submittedQueries, setSubmittedQueries] = useState<QueryResponse[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [editUuid, setEditUuid] = useState<string | null>(null);

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
    } catch (err) {}
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
    } catch (err) {}
  };

  const handleView = (query: QueryResponse) => {
    toast.info(`Query: ${query.query}`);
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

      <div className="mt-6 space-y-6">
        {submittedQueries.length === 0 ? (
          <div className="text-center text-gray-500 italic">No queries submitted yet</div>
        ) : (
          submittedQueries.map((q) => (
            <div
              key={q.query_uuid}
              className={`border border-gray-200 rounded-xl p-5 shadow-sm ${
                q.is_replied ? "bg-emerald-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="text-gray-800 font-medium text-base">{q.query}</div>
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

              {q.is_replied && q.reply && (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                  <strong className="text-gray-800 block mb-1">Reply:</strong>
                  {q.reply}
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

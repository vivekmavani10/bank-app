import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import Button from "../components/Button";
import SubmitQuery from "../components/SubmitQuery";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface Query {
  id: number;
  text: string;
  submittedAt: string;
  isRead: boolean;
  reply: string;
  repliedAt?: string;
}

const Queries: React.FC = () => {
  const [submittedQueries, setSubmittedQueries] = useState<Query[]>([
    {
      id: 1,
      text: "I'm having trouble logging into my account. When I enter my credentials, it shows 'Invalid password' even though I'm sure the password is correct.",
      submittedAt: "2025-08-01 14:30:22",
      isRead: false,
      reply:
        "Thank you for contacting us. We've identified the issue with your account. Please try resetting your password using the 'Forgot Password' link on the login page. If the issue persists, please contact our technical team directly.",
      repliedAt: "2025-08-01 15:10:00",
    },
    {
      id: 2,
      text: "The dashboard page is loading very slowly and sometimes shows a blank screen. This happens on both Chrome and Firefox browsers.",
      submittedAt: "2025-07-30 09:15:45",
      isRead: true,
      reply:
        "We acknowledge the performance issue you're experiencing. Our development team is currently working on optimizing the dashboard loading speed. We expect to deploy the fix by next week. Thank you for your patience.",
      repliedAt: "2025-07-30 10:20:00",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [queryText, setQueryText] = useState("");

  const handleSubmit = () => {
    if (!queryText.trim()) {
      toast.warn("Please enter your query.");
      return;
    }

    const newQuery: Query = {
      id: Date.now(),
      text: queryText.trim(),
      submittedAt: new Date().toLocaleString("en-IN"),
      isRead: false,
      reply: "",
    };

    setSubmittedQueries((prev) => [newQuery, ...prev]);
    setQueryText("");
    setShowModal(false);
    toast.success("Query submitted successfully!");
  };

  const handleEdit = (query: Query) => {
    setQueryText(query.text);
    setShowModal(true);
    // Optionally: Track the query being edited using a state if needed
  };

  const handleDelete = (id: number) => {
    setSubmittedQueries((prev) => prev.filter((q) => q.id !== id));
    toast.success("Query deleted.");
  };

  const handleView = (query: Query) => {
    toast.info(`Query #${query.id}: ${query.text}`);
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
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}

      <div className="mt-6 space-y-6">
        {submittedQueries.length === 0 ? (
          <div className="text-center text-gray-500 italic">No queries submitted yet</div>
        ) : (
          submittedQueries.map((q) => (
            <div
              key={q.id}
              className={`border border-gray-200 rounded-xl p-5 shadow-sm ${
                q.reply ? "bg-emerald-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="text-gray-800 font-medium text-base">{q.text}</div>
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
                    onClick={() => handleDelete(q.id)}
                  />
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Submitted At: {q.submittedAt}
                {q.reply && q.repliedAt && (
                  <div className="mt-1">Replied At: {q.repliedAt}</div>
                )}
              </div>

              {q.reply && (
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

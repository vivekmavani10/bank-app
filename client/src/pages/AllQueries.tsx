import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import { MessageCircle, Eye } from "lucide-react";
import ReplyQuery from "../components/ReplyQuery";
import ViewReply from "../components/ViewReply";
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
  const [replies, setReplies] = useState<Record<number, string>>({});
  const [replyText, setReplyText] = useState("");
  const [activeId, setActiveId] = useState<number | null>(null);
  const [modalType, setModalType] = useState<"reply" | "view" | null>(null);
  const isEdit = activeId !== null && replies[activeId];

  const openReply = (id: number) => {
    setActiveId(id);
    setReplyText(replies[id] || "");
    setModalType("reply");
  };

  const openView = (id: number) => {
    setActiveId(id);
    setModalType("view");
  };

  const closeModal = () => {
    setActiveId(null);
    setReplyText("");
    setModalType(null);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      toast.warn("Please write a reply.");
      return;
    }

    setReplies((prev) => ({ ...prev, [activeId!]: replyText }));
    toast.success(isEdit ? "Reply updated!" : "Reply submitted!");
    closeModal();
  };

  const handleDelete = () => {
    if (window.confirm("Delete this reply?")) {
      setReplies((prev) => {
        const updated = { ...prev };
        delete updated[activeId!];
        return updated;
      });
      toast.success("Reply deleted.");
      closeModal();
    }
  };

  const selected = queries.find((q) => q.id === activeId);

  return (
    <PageContainer title="All User Queries">
      {/* Reply Modal */}
      {modalType === "reply" && (
        <ReplyQuery
          replyText={replyText}
          onChange={setReplyText}
          onClose={closeModal}
          onSubmit={handleSubmitReply}
          isEdit={!!isEdit}
        />
      )}

      {/* View Modal */}
      {modalType === "view" && selected && (
        <ViewReply
          name={selected.name}
          phone={selected.phone}
          account={selected.account}
          query={selected.query}
          reply={replies[selected.id]}
          onClose={closeModal}
          onEdit={() => openReply(selected.id)}
          onDelete={handleDelete}
        />
      )}

      <div className="w-full overflow-x-auto rounded-xl border border-gray-200 mt-6">
        <table className="w-full min-w-[700px] text-sm text-gray-700 text-center">
          <thead className="bg-[#004466] text-white">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Account</th>
              <th className="py-3 px-4">Query</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {queries.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                  No queries found.
                </td>
              </tr>
            ) : (
              queries.map((q) => (
                <tr key={q.id} className="hover:bg-gray-100 transition">
                  <td className="py-3 px-4">{q.name}</td>
                  <td className="py-3 px-4">{q.phone}</td>
                  <td className="py-3 px-4">{q.account}</td>
                  <td className="py-3 px-4 whitespace-pre-wrap">{q.query}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-3">
                      <span title="Reply">
                        <MessageCircle
                          className="text-blue-600 cursor-pointer"
                          size={18}
                          onClick={() => openReply(q.id)}
                        />
                      </span>
                      <span title="View">
                        <Eye
                          className="text-gray-600 cursor-pointer"
                          size={18}
                          onClick={() => openView(q.id)}
                        />
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default AllQueries;

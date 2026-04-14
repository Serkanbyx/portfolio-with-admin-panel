import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiMail,
  FiTrash2,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiInbox,
} from "react-icons/fi";

import GlassCard from "../components/ui/GlassCard";
import ConfirmModal from "../components/ui/ConfirmModal";
import Skeleton from "../components/ui/Skeleton";
import * as messageService from "../services/messageService";

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await messageService.getMessages();
      setMessages(res.data?.data || []);
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleToggleExpand = async (msg) => {
    const isExpanding = expandedId !== msg._id;
    setExpandedId(isExpanding ? msg._id : null);

    if (isExpanding && !msg.isRead) {
      try {
        await messageService.markAsRead(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, isRead: true } : m))
        );
      } catch {
        /* silent — non-critical */
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await messageService.deleteMessage(deleteTarget._id);
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      if (expandedId === deleteTarget._id) setExpandedId(null);
    } catch {
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Messages | Admin</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1 className="text-2xl font-bold text-dark-50 mb-8">Messages</h1>
        <GlassCard padding="p-0">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </GlassCard>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Messages | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-dark-50">Messages</h1>
          {unreadCount > 0 && (
            <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <GlassCard className="text-center py-16">
          <FiInbox className="w-12 h-12 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-dark-200 mb-2">
            No messages yet
          </h3>
          <p className="text-dark-400 text-sm">
            Messages from your contact form will appear here.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-2">
          {messages.map((msg) => {
            const isExpanded = expandedId === msg._id;

            return (
              <GlassCard key={msg._id} padding="p-0">
                <button
                  type="button"
                  onClick={() => handleToggleExpand(msg)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-dark-800/30 transition-colors rounded-xl"
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      msg.isRead ? "bg-dark-600" : "bg-primary-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium text-dark-100 truncate">
                        {msg.name}
                      </span>
                      <span className="text-dark-500 text-xs truncate">
                        {msg.email}
                      </span>
                    </div>
                    <p className="text-dark-400 text-sm truncate mt-0.5">
                      {msg.message}
                    </p>
                  </div>
                  <span className="text-dark-500 text-xs whitespace-nowrap shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  {isExpanded ? (
                    <FiChevronUp className="w-4 h-4 text-dark-400 shrink-0" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 text-dark-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-dark-800">
                        <div className="grid grid-cols-2 gap-4 mt-4 mb-4 text-sm">
                          <div>
                            <span className="text-dark-500 text-xs uppercase tracking-wider">
                              From
                            </span>
                            <p className="text-dark-100 font-medium">
                              {msg.name}
                            </p>
                          </div>
                          <div>
                            <span className="text-dark-500 text-xs uppercase tracking-wider">
                              Email
                            </span>
                            <p>
                              <a
                                href={`mailto:${msg.email}`}
                                className="text-primary-400 hover:text-primary-300 transition-colors"
                              >
                                {msg.email}
                              </a>
                            </p>
                          </div>
                          <div className="col-span-2">
                            <span className="text-dark-500 text-xs uppercase tracking-wider">
                              Received
                            </span>
                            <p className="text-dark-300 text-sm">
                              {new Date(msg.createdAt).toLocaleString("en-US", {
                                dateStyle: "full",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="bg-dark-800/50 rounded-lg p-4 mb-4">
                          <p className="text-dark-200 text-sm whitespace-pre-wrap leading-relaxed">
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <a
                            href={`mailto:${msg.email}?subject=Re: Portfolio Contact`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-primary-400 hover:bg-primary-500/10 transition-colors"
                          >
                            <FiMail className="w-4 h-4" />
                            Reply
                          </a>
                          {!msg.isRead && (
                            <button
                              type="button"
                              onClick={() => handleToggleExpand(msg)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-dark-400 hover:text-dark-100 hover:bg-dark-700/50 transition-colors"
                            >
                              <FiCheck className="w-4 h-4" />
                              Mark Read
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(msg)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-dark-400 hover:text-error-500 hover:bg-dark-700/50 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Message"
        message={`Delete message from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
        isLoading={isDeleting}
      />
    </>
  );
};

export default AdminMessagesPage;

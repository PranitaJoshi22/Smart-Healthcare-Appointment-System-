import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaPaperPlane, FaSearch } from "react-icons/fa";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchInbox(); }, []);

  useEffect(() => {
    if (selectedUser) fetchMessages(selectedUser._id);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/messages/inbox");
      setConversations(data.conversations || []);
    } finally { setLoading(false); }
  };

  const fetchMessages = async (userId) => {
    try {
      const { data } = await api.get(`/messages/${userId}`);
      setMessages(data.messages || []);
    } catch { setMessages([]); }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      await api.post("/messages", { receiverId: selectedUser._id, content: newMessage.trim() });
      setNewMessage("");
      fetchMessages(selectedUser._id);
    } catch { }
  };

  const getOtherUser = (conv) => {
    const sender = conv.sender;
    const receiver = conv.receiver;
    return sender._id === user?._id ? receiver : sender;
  };

  const filteredConvs = conversations.filter(c => {
    const other = getOtherUser(c);
    return other.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div className="container"><h1>Messages</h1><p>Communicate with your healthcare team</p></div>
      </div>

      <div className="container" style={{ paddingBottom: "2rem" }}>
        <div style={{ display: "flex", gap: "1rem", height: "calc(100vh - 280px)", minHeight: 500, background: "white", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: 280, borderRight: "1px solid var(--gray-100)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--gray-100)" }}>
              <div style={{ position: "relative" }}>
                <FaSearch style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)", fontSize: "0.875rem" }} />
                <input type="text" className="form-input" style={{ paddingLeft: "2.25rem", fontSize: "0.875rem" }}
                  placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading ? <div style={{ textAlign: "center", padding: "2rem" }}><div className="loader" /></div> :
                filteredConvs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray-400)", fontSize: "0.875rem" }}>No conversations</div>
                ) : (
                  filteredConvs.map((conv) => {
                    const other = getOtherUser(conv);
                    const isSelected = selectedUser?._id === other._id;
                    return (
                      <div key={conv._id} onClick={() => setSelectedUser(other)} style={{ padding: "0.875rem 1rem", display: "flex", gap: "0.75rem", alignItems: "center", cursor: "pointer", background: isSelected ? "var(--sky-50)" : "transparent", borderLeft: isSelected ? "3px solid var(--sky-500)" : "3px solid transparent", transition: "all 0.15s" }}
                        onMouseEnter={(e) => !isSelected && (e.currentTarget.style.background = "var(--gray-50)")}
                        onMouseLeave={(e) => !isSelected && (e.currentTarget.style.background = "transparent")}>
                        <div style={{ width: 40, height: 40, background: "linear-gradient(135deg, var(--sky-400), var(--sky-600))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, flexShrink: 0 }}>
                          {other.name?.[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--gray-800)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{other.name}</p>
                            {conv.unreadCount > 0 && <span style={{ background: "var(--sky-500)", color: "white", borderRadius: "var(--radius-full)", padding: "0.1rem 0.4rem", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>{conv.unreadCount}</span>}
                          </div>
                          <p style={{ fontSize: "0.75rem", color: "var(--gray-400)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{conv.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {!selectedUser ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray-400)", flexDirection: "column", gap: "0.75rem" }}>
                <FaComments style={{ fontSize: "3rem", color: "var(--sky-200)" }} />
                <p style={{ fontWeight: 600, color: "var(--gray-500)" }}>Select a conversation</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--gray-100)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, var(--sky-400), var(--sky-600))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                    {selectedUser.name?.[0]}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, color: "var(--gray-800)", fontSize: "0.9375rem" }}>{selectedUser.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--sky-600)", fontWeight: 600, textTransform: "capitalize" }}>{selectedUser.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--gray-400)", fontSize: "0.875rem" }}>No messages yet. Say hello!</div>
                  ) : messages.map((msg) => {
                    const isMe = msg.sender._id === user?._id;
                    return (
                      <div key={msg._id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                        <div style={{ maxWidth: "70%", padding: "0.625rem 0.875rem", borderRadius: isMe ? "var(--radius-lg) var(--radius-lg) 4px var(--radius-lg)" : "var(--radius-lg) var(--radius-lg) var(--radius-lg) 4px", background: isMe ? "linear-gradient(135deg, var(--sky-500), var(--sky-600))" : "var(--gray-100)", color: isMe ? "white" : "var(--gray-800)", fontSize: "0.875rem", lineHeight: 1.5 }}>
                          <p>{msg.content}</p>
                          <p style={{ fontSize: "0.7rem", opacity: 0.7, marginTop: "0.25rem", textAlign: "right" }}>
                            {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} style={{ padding: "1rem", borderTop: "1px solid var(--gray-100)", display: "flex", gap: "0.75rem" }}>
                  <input type="text" className="form-input" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} style={{ flex: 1 }} />
                  <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                    <FaPaperPlane />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

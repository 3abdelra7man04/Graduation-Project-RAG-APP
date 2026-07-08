// ── Chat Inbox — paginated log of user chats with confidence + feedback ─

const InboxPage = ({ t, lang, theme, user }) => {
  const { useState, useMemo, useEffect } = React;
  const isDark = theme === "dark";
  const primaryColor = "#1A9BB3";
  const secondaryColor = "#3D81F6";
  const isAr = lang === "ar";

  const projectId = (user && user.projectId) ? user.projectId : "0";

  const [selectedChatId, setSelectedChatId] = useState("chat-1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [monitorData, setMonitorData] = useState(null);
  const [expandedTraceIdx, setExpandedTraceIdx] = useState(null);

  const [allChats, setAllChats] = useState([]);
  const [avgLatencyVal, setAvgLatencyVal] = useState("1.4s");
  const [avgLatencyDelta, setAvgLatencyDelta] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/v1/dashboard/avg_latency/${projectId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.overall_avg_latency !== undefined) {
          setAvgLatencyVal(`${data.overall_avg_latency}s`);
          const d = data.delta_latency;
          const sign = d > 0 ? `+${d}s` : `${d}s`;
          setAvgLatencyDelta(`${sign} ${isAr ? "تحسن" : "improved"}`);
        }
      })
      .catch(err => console.error("Error fetching avg latency for inbox:", err));
  }, [projectId, isAr]);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/v1/chat_inbox/list")
      .then(res => res.json())
      .then(data => {
        if (data && data.all_chats) {
          setAllChats(data.all_chats);
          if (data.all_chats.length > 0) {
            setSelectedChatId(data.all_chats[0].id);
          }
        }
      })
      .catch(err => console.error("Error fetching chats:", err));
  }, []);

  useEffect(() => {
    if (selectedChatId && selectedChatId !== "chat-1") {
      fetch(`http://localhost:5000/api/v1/monitor/conversation/${selectedChatId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.conversation) {
            setMonitorData(data.conversation);
          } else {
            setMonitorData(null);
          }
        })
        .catch(err => {
          console.error("Error fetching monitor data:", err);
          setMonitorData(null);
        });
    } else {
      setMonitorData(null);
    }
  }, [selectedChatId]);

  // Filtering based on date range
  const filteredChats = useMemo(() => {
    return allChats.filter((c) => {
      if (startDate && c.date < startDate) return false;
      if (endDate && c.date > endDate) return false;
      return true;
    });
  }, [startDate, endDate, allChats]);

  const selectedChat = filteredChats.find(c => c.id === selectedChatId) || filteredChats[0] || null;
  const convCost = (monitorData && monitorData.total_conversation_cost !== undefined) ? monitorData.total_conversation_cost : ((selectedChat && selectedChat.total_conversation_cost) || 0);
  const convLatency = (monitorData && monitorData.avg_latency_seconds !== undefined) ? monitorData.avg_latency_seconds : ((selectedChat && selectedChat.avg_latency_seconds) || 0);
  const convTokensIn = (monitorData && monitorData.total_tokens_in !== undefined) ? monitorData.total_tokens_in : ((selectedChat && selectedChat.total_tokens_in) || 0);
  const convTokensOut = (monitorData && monitorData.total_tokens_out !== undefined) ? monitorData.total_tokens_out : ((selectedChat && selectedChat.total_tokens_out) || 0);

  // KPIs
  const totalChats = allChats.length;
  const totalQueries = allChats.reduce((acc, chat) => acc + chat.queries.length, 0);
  
  // A simple representation for 'chats this week' (e.g. date >= 2026-06-19 assuming today is 2026-06-25)
  const chatsThisWeek = allChats.filter(c => c.date >= "2026-06-19").length;

  // Group filtered chats by date
  const groupedChats = useMemo(() => {
    const groups = {};
    filteredChats.forEach(chat => {
      const dateLabel = chat.date === "2026-06-25" ? (isAr ? "اليوم" : "Today") 
                      : chat.date === "2026-06-24" ? (isAr ? "أمس" : "Yesterday") 
                      : chat.date;
      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(chat);
    });
    return groups;
  }, [filteredChats, isAr]);

  const confColor = (c) =>
    c > 0.7 ? primaryColor : c > 0.4 ? secondaryColor : "#ff4d4f";

  const cardStyle = {
    backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
    border: `1px solid ${isDark ? "#333" : "#f3f4f6"}`,
    borderRadius: "15px",
    transition: "all 0.3s ease",
  };

  const inputStyle = {
    backgroundColor: isDark ? "#2a2a2a" : "#f9fafb",
    border: `1px solid ${isDark ? "#444" : "#e5e7eb"}`,
    color: isDark ? "#fff" : "#121212",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div
      className="content"
      style={{
        padding: "24px",
        backgroundColor: isDark ? "#121212" : "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Summary row ── */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: isAr ? "إجمالي المحادثات" : "Total Chats", value: totalChats, color: primaryColor },
          { label: isAr ? "محادثات هذا الأسبوع" : "Chats This Week", value: chatsThisWeek, color: primaryColor },
          { label: isAr ? "إجمالي الاستفسارات" : "Total Queries", value: totalQueries, color: secondaryColor },
          { label: isAr ? "متوسط وقت الاستجابة" : "Avg. Response Time", value: avgLatencyVal, color: primaryColor },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              ...cardStyle,
              padding: "16px 20px",
              flex: "1 1 calc(25% - 12px)",
              minWidth: "150px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                color: "#9ca3af",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {s.label}
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "900", color: s.color }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Date Range Filter ── */}
      <div style={{
          ...cardStyle,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <span
          style={{
            fontWeight: "900",
            fontSize: "18px",
            color: isDark ? "#fff" : "#121212",
          }}
        >
          {t("queryInbox") || "Chat Inbox"}
        </span>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "14px", color: isDark ? "#ccc" : "#555", fontWeight: "500" }}>
            {isAr ? "من:" : "From:"}
          </span>
          <input 
            type="date" 
            style={inputStyle} 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
          <span style={{ fontSize: "14px", color: isDark ? "#ccc" : "#555", fontWeight: "500" }}>
            {isAr ? "إلى:" : "To:"}
          </span>
          <input 
            type="date" 
            style={inputStyle} 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
          <span
            style={{
              fontSize: "12px",
              color: primaryColor,
              fontWeight: "bold",
              cursor: "pointer",
              marginLeft: "8px"
            }}
          >
            {t("exportLog")}
          </span>
        </div>
      </div>

      {/* ── Chat Container (Sidebar + Main Area) ── */}
      <div style={{ display: "flex", gap: "24px", flex: 1, minHeight: "60vh" }}>
        
        {/* Sidebar */}
        <div style={{
          ...cardStyle,
          width: "300px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: `1px solid ${isDark ? "#333" : "#f3f4f6"}`,
            fontWeight: "bold",
            color: isDark ? "#fff" : "#121212"
          }}>
            {isAr ? "المحادثات حسب التاريخ" : "Chats by Date"}
          </div>
          
          <div style={{ overflowY: "auto", flex: 1, padding: "12px" }}>
            {Object.keys(groupedChats).length === 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: "#9ca3af", fontSize: "14px" }}>
                 {isAr ? "لا توجد محادثات." : "No chats found."}
              </div>
            )}
            {Object.keys(groupedChats).map(dateGroup => (
              <div key={dateGroup} style={{ marginBottom: "16px" }}>
                <div style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  fontWeight: "bold",
                  marginBottom: "8px",
                  paddingLeft: "8px",
                  paddingRight: "8px"
                }}>
                  {dateGroup}
                </div>
                {groupedChats[dateGroup].map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      backgroundColor: selectedChatId === chat.id 
                        ? (isDark ? "#2a2a2a" : "#f0f9fa") 
                        : "transparent",
                      borderLeft: selectedChatId === chat.id && !isAr ? `3px solid ${primaryColor}` : "3px solid transparent",
                      borderRight: selectedChatId === chat.id && isAr ? `3px solid ${primaryColor}` : "3px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      marginBottom: "4px"
                    }}
                  >
                    <div style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: selectedChatId === chat.id 
                        ? primaryColor 
                        : (isDark ? "#e5e7eb" : "#374151"),
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}>
                      {chat.date} {chat.time}
                    </div>
                    <div style={{
                      fontSize: "11px",
                      color: isDark ? "#6b7280" : "#9ca3af",
                      marginTop: "4px"
                    }}>
                      {chat.time} • {chat.queries.length} {isAr ? "رسائل" : "messages"}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div style={{
          ...cardStyle,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          {!selectedChat ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#9ca3af" }}>
              {isAr ? "يرجى تحديد محادثة لعرضها." : "Please select a chat to view."}
            </div>
          ) : (
            <>
              <div style={{
                padding: "20px 24px",
                borderBottom: `1px solid ${isDark ? "#333" : "#f3f4f6"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}>
                <div style={{ fontWeight: "bold", fontSize: "16px", color: isDark ? "#fff" : "#121212" }}>
                  {selectedChat.date} {selectedChat.time}
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                    border: `1px solid ${primaryColor}30`,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    💰 {isAr ? "التكلفة:" : "Cost:"} ${Number(convCost).toFixed(6)}
                  </span>
                  <span style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    backgroundColor: `${secondaryColor}15`,
                    color: secondaryColor,
                    border: `1px solid ${secondaryColor}30`,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    ⚡ {isAr ? "متوسط الزمن:" : "Avg Latency:"} {Number(convLatency).toFixed(2)}s
                  </span>
                  <span style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: "bold",
                    backgroundColor: isDark ? "#2a2a2a" : "#f3f4f6",
                    color: isDark ? "#e5e7eb" : "#4b5563",
                    border: `1px solid ${isDark ? "#444" : "#e5e7eb"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}>
                    📥 {isAr ? "مدخلات:" : "In:"} {convTokensIn} | 📤 {isAr ? "مخرجات:" : "Out:"} {convTokensOut} {isAr ? "توكن" : "tokens"}
                  </span>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {selectedChat && selectedChat.queries && selectedChat.queries.map((q, i) => {
                    const monQuery = (monitorData && monitorData.queries && monitorData.queries[i]) || q || {};
                    return (
                    <div key={q.id} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                      
                      {/* User Message (Anonymous) */}
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", alignItems: "flex-start" }}>
                          <div style={{
                              maxWidth: "75%",
                              padding: "16px 20px",
                              backgroundColor: primaryColor,
                              color: "#fff",
                              borderRadius: isAr ? "20px 20px 0px 20px" : "20px 20px 0px 20px",
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              lineHeight: "1.6",
                              fontSize: "15px"
                          }}>
                              <div style={{ fontWeight: "500" }}>
                                 {isAr ? q.qAr : q.q}
                              </div>
                              <div style={{ fontSize: "11px", opacity: 0.7, textAlign: "right", marginTop: "8px" }}>
                                 {selectedChat.date} • {q.time}
                              </div>
                          </div>
                          <div style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: isDark ? "#333" : "#e5e7eb",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: isDark ? "#aaa" : "#6b7280",
                              fontSize: "14px",
                              fontWeight: "bold",
                              flexShrink: 0,
                              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)"
                          }}>
                              U
                          </div>
                      </div>

                      {/* Assistant Message */}
                      <div style={{ display: "flex", justifyContent: "flex-start", gap: "16px", alignItems: "flex-start" }}>
                          <div style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "12px",
                              fontWeight: "bold",
                              flexShrink: 0,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                          }}>
                              Uni
                          </div>
                          <div style={{
                              maxWidth: "75%",
                              padding: "16px 20px",
                              backgroundColor: isDark ? "#252525" : "#ffffff",
                              color: isDark ? "#e5e7eb" : "#374151",
                              borderRadius: isAr ? "20px 20px 20px 0px" : "20px 20px 20px 0px",
                              border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#e5e7eb"}`,
                              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                              lineHeight: "1.6",
                              fontSize: "15px"
                          }}>
                              <div style={{ whiteSpace: "pre-wrap" }}>
                                  {isAr ? q.answerAr : q.answer}
                              </div>

                              {/* Metadata & Actions for Assistant Response */}
                              <div style={{ 
                                  display: "flex", 
                                  alignItems: "center", 
                                  gap: "10px", 
                                  flexWrap: "wrap", 
                                  marginTop: "16px", 
                                  paddingTop: "16px", 
                                  borderTop: `1px solid ${isDark ? "#333" : "#e5e7eb"}` 
                              }}>
                                  <span
                                      style={{
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          fontWeight: "bold",
                                          backgroundColor: `${primaryColor}15`,
                                          color: primaryColor,
                                      }}
                                  >
                                      💰 {isAr ? "تكلفة الاستعلام:" : "Query Cost:"} ${Number((monQuery && (monQuery.query_cost || monQuery.total_cost)) || 0).toFixed(6)}
                                  </span>

                                  <span
                                      style={{
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          fontWeight: "bold",
                                          backgroundColor: `${secondaryColor}15`,
                                          color: secondaryColor,
                                      }}
                                  >
                                      ⚡ {isAr ? "الزمن:" : "Latency:"} {Number((monQuery && (monQuery.latency || monQuery.latency_seconds)) || 0).toFixed(2)}s
                                  </span>

                                  <span
                                      style={{
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          fontWeight: "bold",
                                          backgroundColor: isDark ? "#2a2a2a" : "#f3f4f6",
                                          color: isDark ? "#e5e7eb" : "#4b5563",
                                      }}
                                  >
                                      📥 {isAr ? "مدخلات:" : "In:"} {(monQuery && monQuery.tokens_in) || 0} | 📤 {isAr ? "مخرجات:" : "Out:"} {(monQuery && monQuery.tokens_out) || 0}
                                  </span>

                                  <button
                                      onClick={() => setExpandedTraceIdx(expandedTraceIdx === i ? null : i)}
                                      style={{
                                          marginLeft: isAr ? 0 : "auto",
                                          marginRight: isAr ? "auto" : 0,
                                          backgroundColor: expandedTraceIdx === i ? `${primaryColor}25` : "transparent",
                                          border: `1px solid ${primaryColor}40`,
                                          color: primaryColor,
                                          fontWeight: "bold",
                                          fontSize: "12px",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "5px",
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          transition: "all 0.2s"
                                      }}
                                  >
                                      <Icon.Eye size={14} /> {expandedTraceIdx === i ? (isAr ? "إخفاء المسار" : "Hide Trace") : (isAr ? "عرض مسار الوكيل" : "View Agent Trace")}
                                  </button>
                              </div>
                              
                              {expandedTraceIdx === i && monQuery && monQuery.trace && Array.isArray(monQuery.trace) && monQuery.trace.length > 0 && (
                                  <div style={{
                                      marginTop: "16px",
                                      padding: "16px",
                                      backgroundColor: isDark ? "#1a1a1a" : "#f8fafc",
                                      borderRadius: "10px",
                                      border: `1px solid ${isDark ? "#333" : "#e2e8f0"}`,
                                      width: "100%",
                                      fontSize: "13px"
                                  }}>
                                      <div style={{ fontWeight: "bold", marginBottom: "12px", color: primaryColor }}>
                                          🛠️ {isAr ? "خطوات تنفيذ الوكيل (Agent Trace):" : "Agent Execution Trace:"}
                                      </div>
                                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                          {monQuery.trace.map((step, sIdx) => {
                                              const stepType = (step && step.step_type) || "STEP";
                                              const stepTitle = (step && step.title) || stepType;
                                              const stepContent = step && step.content !== undefined ? step.content : "";
                                              const isTool = stepType.indexOf('TOOL') !== -1;
                                              const borderColor = stepType === 'TOOL_CALL' ? secondaryColor : stepType === 'TOOL_RESULT' ? '#10b981' : primaryColor;
                                              return (
                                              <div key={sIdx} style={{
                                                  padding: "10px 14px",
                                                  backgroundColor: isDark ? "#222" : "#fff",
                                                  borderRadius: "8px",
                                                  borderLeft: `3px solid ${borderColor}`,
                                                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                                              }}>
                                                  <div style={{ fontWeight: "bold", fontSize: "12px", color: isDark ? "#ccc" : "#475569", marginBottom: "4px" }}>
                                                      {stepTitle}
                                                  </div>
                                                  <div style={{ fontFamily: isTool ? "monospace" : "inherit", whiteSpace: "pre-wrap", color: isDark ? "#eee" : "#1e293b", fontSize: "12px", wordBreak: "break-all" }}>
                                                      {typeof stepContent === 'object' ? JSON.stringify(stepContent, null, 2) : String(stepContent)}
                                                  </div>
                                              </div>
                                              );
                                          })}
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

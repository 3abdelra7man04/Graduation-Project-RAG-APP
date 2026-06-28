// ── Chat Inbox — paginated log of user chats with confidence + feedback ─

const InboxPage = ({ t, lang, theme }) => {
  const { useState, useMemo } = React;
  const isDark = theme === "dark";
  const primaryColor = "#1A9BB3";
  const secondaryColor = "#3D81F6";
  const isAr = lang === "ar";

  const [selectedChatId, setSelectedChatId] = useState("chat-1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // BACKEND: GET /api/chats?page=1&limit=20 → paginated chat history
  const allChats = [
    {
      id: "chat-1",
      title: "Vacation Policy & Password",
      date: "2026-06-25",
      time: "10:30 AM",
      queries: [
        {
          id: 1,
          q: "What is the vacation policy?",
          qAr: "ما هي سياسة الإجازات؟",
          answer: "According to Company Policy 2024, employees are entitled to 21 days of paid time off per year, which increases to 30 days after 5 years of service. Please make sure to request time off at least two weeks in advance.",
          answerAr: "وفقاً لسياسة الشركة 2024، يحق للموظفين الحصول على 21 يوماً من الإجازة مدفوعة الأجر سنوياً، والتي تزيد إلى 30 يوماً بعد 5 سنوات من الخدمة. يرجى التأكد من طلب الإجازة قبل أسبوعين على الأقل.",
          confidence: 0.94,
          source: "Company Policy 2024.pdf",
          time: "10:30 AM",
          liked: true,
        },
        {
          id: 2,
          q: "How do I reset my password?",
          qAr: "كيف أعيد تعيين كلمة المرور؟",
          answer: "To reset your password, navigate to the portal login page and click 'Forgot Password'. You will receive an email with a secure link to create a new password. The link expires in 15 minutes.",
          answerAr: "لإعادة تعيين كلمة المرور، انتقل إلى صفحة تسجيل الدخول في البوابة وانقر على 'نسيت كلمة المرور'. ستتلقى بريداً إلكترونياً يحتوي على رابط آمن لإنشاء كلمة مرور جديدة. تنتهي صلاحية الرابط خلال 15 دقيقة.",
          confidence: 0.88,
          source: "Onboarding Guide.md",
          time: "11:15 AM",
          liked: null,
        }
      ]
    },
    {
      id: "chat-2",
      title: "Enterprise Billing Options",
      date: "2026-06-24",
      time: "02:20 PM",
      queries: [
        {
          id: 3,
          q: "What are the enterprise billing options?",
          qAr: "ما هي خيارات الفوترة للمؤسسات؟",
          answer: "I could not find a confident answer in the available knowledge base regarding enterprise billing options. Please contact the sales team directly for enterprise pricing details.",
          answerAr: "لم أجد إجابة واثقة في قاعدة المعرفة المتاحة بخصوص خيارات الفوترة للمؤسسات. يرجى الاتصال بفريق المبيعات مباشرة للحصول على تفاصيل أسعار المؤسسات.",
          confidence: 0.15,
          source: null,
          time: "02:20 PM",
          liked: false,
        }
      ]
    },
    {
      id: "chat-3",
      title: "Code Review Process",
      date: "2026-06-20",
      time: "09:00 AM",
      queries: [
        {
          id: 4,
          q: "Explain the code review process",
          qAr: "اشرح عملية مراجعة الكود",
          answer: "The engineering runbook states that all pull requests must be reviewed by at least one senior engineer before merging. The code must pass all CI/CD pipelines, have over 80% test coverage, and address any inline comments.",
          answerAr: "تنص وثيقة التشغيل الهندسي على أنه يجب مراجعة جميع طلبات السحب بواسطة مهندس أول واحد على الأقل قبل الدمج. يجب أن يمر الكود بجميع مسارات CI/CD، وأن يحقق تغطية اختبار تزيد عن 80%، ويعالج أي تعليقات مضمنة.",
          confidence: 0.79,
          source: "Engineering Runbook.txt",
          time: "09:00 AM",
          liked: true,
        }
      ]
    }
  ];

  // Filtering based on date range
  const filteredChats = useMemo(() => {
    return allChats.filter((c) => {
      if (startDate && c.date < startDate) return false;
      if (endDate && c.date > endDate) return false;
      return true;
    });
  }, [startDate, endDate]);

  const selectedChat = filteredChats.find(c => c.id === selectedChatId) || filteredChats[0];

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
        ].map((s, i) => (
          <div
            key={i}
            style={{
              ...cardStyle,
              padding: "16px 20px",
              flex: "1 1 calc(33% - 12px)",
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
                fontWeight: "bold",
                fontSize: "16px",
                color: isDark ? "#fff" : "#121212"
              }}>
                {selectedChat.date} {selectedChat.time}
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {selectedChat.queries.map((q, i) => (
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
                                          fontSize: "12px",
                                          fontWeight: "900",
                                          color: confColor(q.confidence),
                                      }}
                                      >
                                      {Math.round(q.confidence * 100)}% {t("conf")}
                                  </span>

                                  {q.source && (
                                      <span
                                      style={{
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          fontWeight: "bold",
                                          backgroundColor: `${primaryColor}15`,
                                          color: primaryColor,
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "4px",
                                      }}
                                      >
                                      <Icon.Doc size={12} /> {q.source}
                                      </span>
                                  )}

                                  {q.liked === true && (
                                      <span
                                      style={{
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          fontWeight: "bold",
                                          backgroundColor: "#f0fdf4",
                                          color: "#166534",
                                      }}
                                      >
                                      {t("helpful")}
                                      </span>
                                  )}
                                  {q.liked === false && (
                                      <span
                                      style={{
                                          padding: "4px 10px",
                                          borderRadius: "6px",
                                          fontSize: "11px",
                                          fontWeight: "bold",
                                          backgroundColor: "#fef2f2",
                                          color: "#991b1b",
                                      }}
                                      >
                                      {t("unhelpful")}
                                      </span>
                                  )}

                                  <button
                                      style={{
                                          marginLeft: isAr ? 0 : "auto",
                                          marginRight: isAr ? "auto" : 0,
                                          backgroundColor: "transparent",
                                          border: "none",
                                          color: primaryColor,
                                          fontWeight: "bold",
                                          fontSize: "12px",
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "5px",
                                          padding: "4px 8px",
                                          borderRadius: "6px",
                                          transition: "background-color 0.2s"
                                      }}
                                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = `${primaryColor}15`}
                                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                  >
                                      <Icon.Eye size={14} /> {t("viewFull")}
                                  </button>
                              </div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Gap Analysis — LLM-powered topic coverage and unanswered query review ─

const AnalysisPage = ({ t, theme, language, user }) => {
  const { useState, useEffect } = React;
  const isDark = theme === "dark";
  const primaryColor = "#1A9BB3";
  const secondaryColor = "#3D81F6";
  const isAr = language === "ar";
  const projectId = "0";

  // الألوان المشتقة من اللون الأساسي
  const fallbackTopics = [
    { nameKey: "hrPolicies", covered: 92, queries: 340, color: "#1A9BB3" }, // اللون الأساسي
    { nameKey: "productFeatures", covered: 78, queries: 280, color: "#25A9C2" }, // درجة أفتح
    { nameKey: "onboarding", covered: 85, queries: 210, color: "#3D81F6" }, // اللون الثانوي
    { nameKey: "technicalDocs", covered: 61, queries: 190, color: "#5294FF" }, // درجة أفتح من الثانوي
    { nameKey: "legalCompliance", covered: 34, queries: 150, color: "#158296" }, // درجة أغمق
    { nameKey: "billingFinance", covered: 20, queries: 120, color: "#0E5C6A" }, // درجة أغمق جداً
  ];

  const [topics, setTopics] = useState(fallbackTopics);

  const fetchTopics = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/gap_analysis/topics/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.topics)) {
          const colors = [
            "#1A9BB3",
            "#25A9C2",
            "#3D81F6",
            "#5294FF",
            "#158296",
            "#0E5C6A",
            "#1e40af",
            "#0369a1",
          ];
          const formatted = data.topics.map((item, idx) => ({
            nameKey: item.topic || item.nameKey || "Topic",
            covered: item.percentage !== undefined ? item.percentage : item.covered,
            queries: item.count !== undefined ? item.count : item.queries,
            color: colors[idx % colors.length],
          }));
          setTopics(formatted);
        }
      }
    } catch (err) {
      console.error("Error fetching gap analysis topics:", err);
    }
  };

  const fallbackOverview = [
    { labelKey: "wellCovered", color: primaryColor, pct: 68, pctStr: "68%" },
    { labelKey: "gapDetected", color: secondaryColor, pct: 32, pctStr: "32%" },
  ];
  const [coverageOverview, setCoverageOverview] = useState(fallbackOverview);

  const fetchWellCovered = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/gap_analysis/well_covered/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        const wellPct = data.well_covered_percentage !== undefined ? data.well_covered_percentage : 100;
        const failedPct = data.failed_percentage !== undefined ? data.failed_percentage : 0;
        setCoverageOverview([
          {
            labelKey: "wellCovered",
            color: primaryColor,
            pct: wellPct,
            pctStr: `${wellPct}%`,
            count: data.well_covered_queries
          },
          {
            labelKey: "gapDetected",
            color: secondaryColor,
            pct: failedPct,
            pctStr: `${failedPct}%`,
            count: data.failed_queries
          }
        ]);
      }
    } catch (err) {
      console.error("Error fetching well covered gap analysis:", err);
    }
  };

  const fallbackUnanswered = [
    {
      q: "What is the refund policy for enterprise plans?",
      qAr: "ما هي سياسة الاسترداد لخطط المؤسسات؟",
      hits: 0,
      confidence: 0.12,
    },
    {
      q: "How to configure SSO with Okta?",
      qAr: "كيفية إعداد SSO مع Okta؟",
      hits: 1,
      confidence: 0.31,
    },
    {
      q: "Data retention period under GDPR?",
      qAr: "مدة الاحتفاظ بالبيانات وفق GDPR؟",
      hits: 0,
      confidence: 0.08,
    },
    {
      q: "Invoice generation for custom contracts?",
      qAr: "كيفية إنشاء فاتورة للعقود المخصصة؟",
      hits: 0,
      confidence: 0.15,
    },
    {
      q: "How to appeal a performance review?",
      qAr: "كيفية الاعتراض على تقييم الأداء؟",
      hits: 2,
      confidence: 0.42,
    },
  ];
  const [unanswered, setUnanswered] = useState(fallbackUnanswered);
  const [suggestModalOpen, setSuggestModalOpen] = useState(false);
  const [selectedQueryForSuggest, setSelectedQueryForSuggest] = useState(null);
  const [suggestDocText, setSuggestDocText] = useState("");
  const [suggestLoading, setSuggestLoading] = useState(false);

  const fetchUnanswered = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/gap_analysis/unanswered/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.queries)) {
          const formatted = data.queries.map((item) => ({
            id: item._id || item.id,
            q: item.query_text || item.q || "Unanswered query",
            qAr: item.query_text || item.qAr || "استفسار غير مجاب",
            topic: item.query_topic || "general",
            hits: item.tool_calls_count !== undefined ? item.tool_calls_count : 0,
            confidence: item.confidence !== undefined ? item.confidence : 0.1,
          }));
          setUnanswered(formatted);
        }
      }
    } catch (err) {
      console.error("Error fetching unanswered queries:", err);
    }
  };

  const dismissQuery = async (queryId) => {
    if (!queryId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/gap_analysis/dismiss/${projectId}/${queryId}`,
        {
          method: "PUT",
        }
      );
      if (res.ok) {
        setUnanswered((prev) => prev.filter((item) => item.id !== queryId));
        fetchWellCovered();
      }
    } catch (err) {
      console.error("Error dismissing query:", err);
    }
  };

  const openSuggestModal = (query) => {
    setSelectedQueryForSuggest(query);
    setSuggestDocText("");
    setSuggestModalOpen(true);
  };

  const handleSuggestSubmit = async () => {
    if (!selectedQueryForSuggest || !suggestDocText.trim()) return;
    const queryId = selectedQueryForSuggest.id;
    const queryText = isAr
      ? selectedQueryForSuggest.qAr
      : selectedQueryForSuggest.q;

    setSuggestLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/gap_analysis/suggest_document/${projectId}/${queryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document_text: suggestDocText.trim(),
            metadata: { query_id: queryId, query_text: queryText },
          }),
        }
      );
      if (res.ok) {
        setUnanswered((prev) => prev.filter((item) => item.id !== queryId));
        fetchWellCovered();
        setSuggestModalOpen(false);
        setSelectedQueryForSuggest(null);
        setSuggestDocText("");
      }
    } catch (err) {
      console.error("Error suggesting document:", err);
    } finally {
      setSuggestLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
    fetchWellCovered();
    fetchUnanswered();
  }, [projectId]);

  return (
    <div
      className="content"
      style={{
        padding: "24px",
        backgroundColor: isDark ? "#121212" : "#ffffff",
        minHeight: "100vh",
        transition: "all 0.4s",
      }}
    >
      <div
        className="grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* ── Topic coverage bars ── */}
        <div
          className="card"
          style={{
            backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
            borderRadius: "20px",
            border: `1px solid ${isDark ? "#333" : "#f3f4f6"}`,
            padding: "24px",
          }}
        >
          <div
            className="card-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <span
              className="card-title"
              style={{
                fontWeight: "900",
                fontSize: "18px",
                color: isDark ? "#fff" : "#121212",
              }}
            >
              {t("topicCoverage")}
            </span>
            <span
              className="card-action"
              onClick={fetchTopics}
              style={{
                fontSize: "12px",
                color: primaryColor,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {t("reAnalyze")}
            </span>
          </div>
          <div className="card-body">
            {topics.map((topic, i) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      color: isDark ? "#eee" : "#374151",
                    }}
                  >
                    {t(topic.nameKey)}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                      {topic.queries} {t("queries")}
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: "900",
                        color: topic.color,
                      }}
                    >
                      {topic.covered}%
                    </span>
                  </div>
                </div>
                <div
                  className="coverage-bar"
                  style={{
                    height: "8px",
                    background: isDark ? "#333" : "#f3f4f6",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="coverage-fill"
                    style={{
                      width: `${topic.covered}%`,
                      height: "100%",
                      background: topic.color,
                      borderRadius: "10px",
                      transition: "width 1s ease-in-out",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Coverage donut ── */}
        <div
          className="card"
          style={{
            backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
            borderRadius: "20px",
            border: `1px solid ${isDark ? "#333" : "#f3f4f6"}`,
            padding: "24px",
          }}
        >
          <div
            className="card-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <span
              className="card-title"
              style={{
                fontWeight: "900",
                fontSize: "18px",
                color: isDark ? "#fff" : "#121212",
              }}
            >
              {t("coverageOverview")}
            </span>
            <span
              className="card-action"
              onClick={fetchWellCovered}
              style={{
                fontSize: "12px",
                color: primaryColor,
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {t("fullReport")}
            </span>
          </div>
          <div
            className="card-body"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              paddingTop: "10px",
            }}
          >
            {/* Donut Chart يستخدم تدرج الهوية */}
            <div
              style={{ position: "relative", width: "150px", height: "150px" }}
            >
              <DonutChart
                segments={coverageOverview.map((item) => ({
                  pct: item.pct,
                  color: item.color,
                }))}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              {coverageOverview.map((l, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "12px",
                  }}
                >
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: l.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontWeight: "bold",
                      color: isDark ? "#aaa" : "#6b7280",
                    }}
                  >
                    {t(l.labelKey)} {l.count !== undefined ? `(${l.count})` : ""}
                  </span>
                  <span style={{ fontWeight: "900", color: l.color }}>
                    {l.pctStr}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Low-confidence query list ── */}
      <div
        className="card"
        style={{
          backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
          borderRadius: "20px",
          border: `1px solid ${isDark ? "#333" : "#f3f4f6"}`,
          padding: "8px 0",
        }}
      >
        <div
          className="card-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 24px",
          }}
        >
          <span
            className="card-title"
            style={{
              fontWeight: "900",
              fontSize: "18px",
              color: isDark ? "#fff" : "#121212",
            }}
          >
            {t("unansweredQueries")}
          </span>
          <span
            className="card-action"
            onClick={fetchUnanswered}
            style={{
              fontSize: "12px",
              color: primaryColor,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            {t("exportGaps")}
          </span>
        </div>
        <div className="card-body">
          {unanswered.map((u, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 24px",
                borderBottom:
                  i < unanswered.length - 1
                    ? `1px solid ${isDark ? "#333" : "#f3f4f6"}`
                    : "none",
                transition: "background 0.2s",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: isDark ? "#eee" : "#374151",
                    marginBottom: "4px",
                  }}
                >
                  {isAr ? u.qAr : u.q}
                </div>
                {u.topic && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#9ca3af",
                      fontWeight: "500",
                    }}
                  >
                    {`${t("topic")}: ${u.topic}`}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => openSuggestModal(u)}
                  style={{
                    backgroundColor: "transparent",
                    border: `1px solid ${primaryColor}`,
                    color: primaryColor,
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {t("suggestDoc")}
                </button>
                <button
                  onClick={() => dismissQuery(u.id)}
                  style={{
                    backgroundColor: isDark ? "#333" : "#f3f4f6",
                    border: "none",
                    color: isDark ? "#aaa" : "#6b7280",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  {t("dismiss")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {suggestModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setSuggestModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
              border: `1px solid ${isDark ? "#333" : "#e5e7eb"}`,
              borderRadius: "16px",
              padding: "24px",
              width: "90%",
              maxWidth: "520px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: isDark ? "#fff" : "#111827",
                marginBottom: "8px",
              }}
            >
              {isAr
                ? "اقتراح مستند للإجابة على الاستفسار"
                : "Suggest Document for Query"}
            </div>
            {selectedQueryForSuggest && (
              <div
                style={{
                  fontSize: "13px",
                  color: primaryColor,
                  backgroundColor: isDark ? "#2a2a2a" : "#f3f4f6",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  marginBottom: "16px",
                  fontWeight: "500",
                }}
              >
                "
                {isAr
                  ? selectedQueryForSuggest.qAr
                  : selectedQueryForSuggest.q}
                "
              </div>
            )}
            <textarea
              rows={6}
              value={suggestDocText}
              onChange={(e) => setSuggestDocText(e.target.value)}
              placeholder={
                isAr
                  ? "اكتب أو الصق محتوى المستند المقترح هنا ليتم فهرسته في قاعدة البيانات..."
                  : "Type or paste the suggested document content here to index into knowledge base..."
              }
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: `1px solid ${isDark ? "#444" : "#d1d5db"}`,
                backgroundColor: isDark ? "#121212" : "#f9fafb",
                color: isDark ? "#eee" : "#1f2937",
                fontSize: "14px",
                outline: "none",
                resize: "vertical",
                marginBottom: "20px",
                fontFamily: "inherit",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setSuggestModalOpen(false)}
                disabled={suggestLoading}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: `1px solid ${isDark ? "#444" : "#d1d5db"}`,
                  backgroundColor: "transparent",
                  color: isDark ? "#ccc" : "#4b5563",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: suggestLoading ? "not-allowed" : "pointer",
                }}
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleSuggestSubmit}
                disabled={suggestLoading || !suggestDocText.trim()}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor:
                    suggestLoading || !suggestDocText.trim()
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    suggestLoading || !suggestDocText.trim() ? 0.6 : 1,
                }}
              >
                {suggestLoading
                  ? isAr
                    ? "جاري الفهرسة..."
                    : "Indexing..."
                  : isAr
                  ? "إضافة وفهرسة"
                  : "Add & Index"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

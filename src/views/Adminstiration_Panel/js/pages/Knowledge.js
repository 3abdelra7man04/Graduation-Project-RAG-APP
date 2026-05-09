// ── Knowledge Base — document upload, list, search, delete ───────────────
const KnowledgePage = ({ t, theme, language }) => {
  const { useState, useRef, useCallback } = React;

  const [docs, setDocs] = useState(INIT_DOCS);
  const [search, setSearch] = useState("");
  const [drag, setDrag] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const filtered = docs.filter((d) =>
    (d.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const handleUpload = useCallback(() => {
    setUploading(true);
    setTimeout(() => {
      setDocs((prev) => [
        {
          id: Date.now(),
          name: "New Document.pdf",
          type: "PDF",
          size: "1.2 MB",
          status: "processing",
          chunks: 0,
          uploadedAt: "just now",
          uploadedBy: "Alex Johnson",
        },
        ...prev,
      ]);
      setUploading(false);
    }, 1400);
  }, []);

  const deleteDoc = (id) => setDocs(docs.filter((d) => d.id !== id));

  const statusBadge = (s) => {
    let badgeStyle = {};
    if (s === "indexed") {
      badgeStyle = {
        backgroundColor: theme === "dark" ? "rgba(34, 197, 94, 0.1)" : "#f0fdf4",
        color: theme === "dark" ? "#4ade80" : "#166534",
      };
    } else if (s === "processing") {
      badgeStyle = {
        backgroundColor: theme === "dark" ? "rgba(26, 155, 179, 0.1)" : "rgba(26, 155, 179, 0.05)",
        color: "#1A9BB3",
      };
    } else {
      badgeStyle = {
        backgroundColor: theme === "dark" ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
        color: theme === "dark" ? "#f87171" : "#991b1b",
      };
    }
    return (
      <span style={{ ...badgeStyle, padding: "4px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "bold" }}>
        {t(s)}
      </span>
    );
  };

  return (
    <div
      className="content"
      style={{
        padding: "24px",
        minHeight: "100vh",
        backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#374151",
        transition: "all 0.4s ease-in-out",
        direction: language === "ar" ? "rtl" : "ltr",
      }}
    >
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h2 style={{ fontSize: "24px", fontWeight: "900", margin: "0" }}>
            {language === "ar" ? "المكتبة" : "Knowledge Base"}
          </h2>
          <div style={{ fontSize: "13px", color: theme === "dark" ? "#9ca3af" : "#6b7280", marginTop: "5px" }}>
            {docs.length} {t("documents")} ·{" "}
            <span style={{ color: "#1A9BB3", fontWeight: "bold" }}>
              {docs.filter((d) => d.status === "indexed").reduce((a, d) => a + d.chunks, 0).toLocaleString()}
            </span>{" "}
            {t("chunksIndexed")}
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            backgroundColor: "#1A9BB3", color: "white", padding: "12px 24px",
            borderRadius: "12px", border: "none", fontWeight: "bold", cursor: "pointer",
            display: "flex", alignItems: "center", gap: "10px",
            boxShadow: theme === "dark" ? "none" : "0 4px 12px rgba(26, 155, 179, 0.2)",
            transition: "all 0.3s",
          }}
        >
          <Icon.Upload size={18} />
          {uploading ? t("uploading") : t("uploadDocument")}
        </button>
      </div>

      {/* Upload Zone */}
      <div
        style={{
          border: `2px dashed ${drag ? "#1A9BB3" : theme === "dark" ? "#374151" : "#e5e7eb"}`,
          backgroundColor: drag
            ? theme === "dark" ? "rgba(26, 155, 179, 0.1)" : "rgba(26, 155, 179, 0.05)"
            : theme === "dark" ? "#1e1e1e" : "#f9fafb",
          padding: "50px 20px", borderRadius: "20px", textAlign: "center",
          cursor: "pointer", marginBottom: "30px", transition: "all 0.3s ease",
        }}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handleUpload(); }}
        onClick={() => fileRef.current?.click()}
      >
        <input type="file" ref={fileRef} style={{ display: "none" }} multiple accept=".pdf,.docx,.txt,.md" onChange={handleUpload} />
        <div style={{ color: "#1A9BB3", marginBottom: "15px" }}><Icon.Upload size={40} /></div>
        <div style={{ fontWeight: "900", fontSize: "18px" }}>{t("dropFilesHere")}</div>
        <div style={{ fontSize: "13px", color: "#9ca3af", marginTop: "8px" }}>{t("dropFilesHint")}</div>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px",
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#f3f4f6",
          borderRadius: "15px", marginBottom: "30px",
          border: `1px solid ${theme === "dark" ? "#333" : "#e5e7eb"}`,
        }}
      >
        <Icon.Search size={20} style={{ opacity: 0.4 }} />
        <input
          placeholder={t("searchDocuments")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: "none", border: "none", outline: "none", color: "inherit", width: "100%", fontWeight: "bold" }}
        />
      </div>

      {/* Card & Table */}
      <div
        className="card"
        style={{
          backgroundColor: theme === "dark" ? "#1e1e1e" : "#ffffff",
          borderRadius: "20px", overflow: "hidden",
          border: `1px solid ${theme === "dark" ? "#333" : "#f3f4f6"}`,
          boxShadow: theme === "dark" ? "none" : "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: language === "ar" ? "right" : "left" }}>
          <thead>
            <tr style={{ backgroundColor: theme === "dark" ? "rgba(255,255,255,0.03)" : "#f9fafb" }}>
              {[t("document"), t("size"), t("status"), t("chunks"), t("uploadedBy"), t("date"), t("actions")].map((h, i) => (
                <th key={i} style={{ padding: "20px", fontSize: "11px", textTransform: "uppercase", color: "#9ca3af", letterSpacing: "1px", fontWeight: 600 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => (
              <tr
                key={doc.id}
                style={{ borderTop: `1px solid ${theme === "dark" ? "#333" : "#f3f4f6"}`, transition: "background 0.2s" }}
              >
                {/* Document */}
                <td style={{ padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ padding: "5px 10px", borderRadius: "8px", background: "linear-gradient(135deg, #1A9BB3 0%, #3D81F6 100%)", color: "white", fontSize: "10px", fontWeight: "bold" }}>
                      {doc.type}
                    </div>
                    <span style={{ fontWeight: "bold", fontSize: "14px" }}>{doc.name}</span>
                  </div>
                </td>

                {/* Size */}
                <td style={{ padding: "20px", fontSize: "13px", color: "#9ca3af" }}>{doc.size}</td>

                {/* Status */}
                <td style={{ padding: "20px" }}>{statusBadge(doc.status)}</td>

                {/* Chunks */}
                <td style={{ padding: "20px", fontSize: "13px", color: theme === "dark" ? "#aaa" : "#6b7280" }}>
                  {doc.chunks > 0 ? doc.chunks.toLocaleString() : "—"}
                </td>

                {/* Uploaded By */}
                <td style={{ padding: "20px", fontSize: "13px", color: theme === "dark" ? "#aaa" : "#6b7280" }}>
                  {doc.uploadedBy}
                </td>

                {/* Date */}
                <td style={{ padding: "20px", fontSize: "13px", color: "#9ca3af" }}>{doc.uploadedAt}</td>

                {/* Actions */}
                <td style={{ padding: "20px" }}>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", padding: "5px" }}>
                      <Icon.Eye size={20} />
                    </button>
                    <button onClick={() => deleteDoc(doc.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "5px" }}>
                      <Icon.Trash size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
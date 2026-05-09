// ── App — root component: routing, dark mode, language, RTL, ReactDOM mount

const App = () => {
  const { useState, useEffect } = React;

  const [page, setPage] = useState("dashboard");
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("en"); // 'en' | 'ar'

  const t = makeT(lang);
  const isAr = lang === "ar";

  // توحيد مسمى الثيم واللغة ليتوافق مع الـ Props في المكونات التي عدلناها
  const theme = dark ? "dark" : "light";
  const language = lang;

  // Apply dark mode class and RTL direction to <html>
  useEffect(() => {
    document.documentElement.dir = isAr ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.body.className = dark ? "dark" : "";

    // تأكد من إلغاء أي margin أو padding افتراضي من المتصفح في الـ body
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, [dark, lang]);

  const PAGE_TITLES_LOCAL = {
    dashboard: t("dashboard"),
    knowledge: t("knowledgeBase"),
    analysis: t("gapAnalysis"),
    inbox: t("queryInbox"),
    admins: t("admins"),
    settings: t("settings"),
  };

  const renderPage = () => {
    // تمرير theme و language للمكونات لتعمل الألوان الجديدة
    const props = { t, lang, theme, language };
    switch (page) {
      case "dashboard":
        return <DashboardPage {...props} />;
      case "knowledge":
        return <KnowledgePage {...props} />;
      case "analysis":
        return <AnalysisPage {...props} />;
      case "inbox":
        return <InboxPage {...props} />;
      case "admins":
        return <AdminsPage {...props} />;
      case "settings":
        return <SettingsPage {...props} />;
      default:
        return <DashboardPage {...props} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundColor: dark ? "#121212" : "#ffffff",
      }}
    >
      {/* السايدبار ملتصق تماماً باليسار (أو اليمين في العربي) */}
      <Sidebar
        page={page}
        setPage={setPage}
        t={t}
        theme={theme}
        language={language}
      />

      {/* منطقة المحتوى: الهيدر + الصفحة الحالية */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden", // يمنع السكرول الخارجي
          position: "relative",
        }}
      >
        <Topbar
          title={PAGE_TITLES_LOCAL[page]}
          dark={dark}
          setDark={setDark}
          lang={lang}
          setLang={setLang}
          theme={theme} // تمرير الثيم للهيدر أيضاً
        />

        {/* حاوية الصفحة مع سكرول داخلي فقط */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            backgroundColor: dark ? "#121212" : "#ffffff",
            padding: "0", // التحكم في البادينج يكون داخل الصفحات نفسها
          }}
        >
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

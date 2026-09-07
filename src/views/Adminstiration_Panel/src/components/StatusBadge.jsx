// ── StatusBadge — shared status indicator, two vocabularies, two shapes ────
// Knowledge.js needs a filled pill (indexed / processing / error-fallback);
// Admins.js needs a small colored dot + text (active / inactive / pending).
// This component only shares the *rendering* — each page still owns its own
// status → style map and its own (translated) label text, since the two
// vocabularies are unrelated and shouldn't be merged.
//
// config shape: { [status]: { color, bg?, dotColor? }, default?: {...} }
//   - "pill" variant uses color + bg
//   - "dot" variant uses color (text) + dotColor (falls back to color)

const StatusBadge = ({ status, label, config, variant = "pill" }) => {
  const style = config[status] || config.default || {};

  if (variant === "dot") {
    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          color: style.color,
          fontWeight: "bold",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: style.dotColor ?? style.color,
          }}
        />
        {label}
      </span>
    );
  }

  return (
    <span
      style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "4px 12px",
        borderRadius: "8px",
        fontSize: "11px",
        fontWeight: "bold",
      }}
    >
      {label}
    </span>
  );
};

export default StatusBadge;

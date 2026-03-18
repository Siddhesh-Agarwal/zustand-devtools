import type { CSSProperties } from "react";

const FONT_MONO =
  "'JetBrains Mono', 'Fira Code', Consolas, 'Courier New', monospace";

export const colors = {
  bg: "#0a0a0a",
  bgLight: "#1a1a1a",
  bgHover: "#252525",
  border: "#2a2a2a",
  text: "#e0e0e0",
  textMuted: "#888",
  accent: "#3ecf8e",
  accentHover: "#34b87c",
  string: "#a8d8a8",
  number: "#7caff5",
  boolean: "#f47067",
  null: "#888",
  flash: "#fbbf2440",
} as const;

export const basePanel: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: colors.bg,
  color: colors.text,
  fontFamily: FONT_MONO,
  fontSize: 13,
  overflow: "hidden",
};

export const sidebar: CSSProperties = {
  display: "flex",
  gap: 2,
  padding: "6px 8px",
  borderBottom: `1px solid ${colors.border}`,
  background: colors.bgLight,
  flexWrap: "wrap",
};

export const sidebarTab: CSSProperties = {
  padding: "4px 10px",
  border: "none",
  borderRadius: 4,
  background: "transparent",
  color: colors.textMuted,
  fontFamily: FONT_MONO,
  fontSize: 12,
  cursor: "pointer",
};

export const sidebarTabActive: CSSProperties = {
  ...sidebarTab,
  background: colors.accent,
  color: "#000",
  fontWeight: 600,
};

export const toolbar: CSSProperties = {
  display: "flex",
  gap: 6,
  padding: "6px 8px",
  borderBottom: `1px solid ${colors.border}`,
  background: colors.bgLight,
  alignItems: "center",
};

export const toolbarButton: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 8px",
  border: `1px solid ${colors.border}`,
  borderRadius: 4,
  background: "transparent",
  color: colors.textMuted,
  fontFamily: FONT_MONO,
  fontSize: 11,
  cursor: "pointer",
};

export const mainArea: CSSProperties = {
  display: "flex",
  flex: 1,
  overflow: "hidden",
};

export const treePane: CSSProperties = {
  flex: 1,
  overflow: "auto",
  padding: 8,
};

export const historyPane: CSSProperties = {
  width: 220,
  borderLeft: `1px solid ${colors.border}`,
  overflow: "auto",
  padding: 8,
  background: colors.bgLight,
};

export const historyItem: CSSProperties = {
  display: "block",
  width: "100%",
  padding: "4px 6px",
  border: "none",
  borderRadius: 4,
  background: "none",
  fontFamily: "inherit",
  fontSize: 11,
  textAlign: "left",
  cursor: "pointer",
  color: colors.textMuted,
};

export const historyItemActive: CSSProperties = {
  ...historyItem,
  background: colors.bgHover,
  color: colors.text,
};

export const jsonKey: CSSProperties = {
  color: colors.accent,
};

export const jsonString: CSSProperties = {
  color: colors.string,
};

export const jsonNumber: CSSProperties = {
  color: colors.number,
};

export const jsonBoolean: CSSProperties = {
  color: colors.boolean,
};

export const jsonNull: CSSProperties = {
  color: colors.null,
  fontStyle: "italic",
};

export const flashHighlight: CSSProperties = {
  background: colors.flash,
  transition: "background 1s ease-out",
};

export const toggleArrow: CSSProperties = {
  display: "inline-block",
  width: 14,
  padding: 0,
  border: "none",
  background: "none",
  cursor: "pointer",
  userSelect: "none",
  color: colors.textMuted,
  fontFamily: "inherit",
  fontSize: 10,
  lineHeight: "inherit",
};

export const treeRow: CSSProperties = {
  lineHeight: "20px",
  whiteSpace: "nowrap",
};

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import * as styles from "./styles";

interface JsonTreeProps {
  data: unknown;
  label?: string;
  path?: string;
  changedPaths?: Set<string>;
  defaultExpanded?: boolean;
  depth?: number;
}

function sanitize(value: unknown): unknown {
  const seen = new WeakSet();
  function walk(val: unknown): unknown {
    if (typeof val === "function") return "[Function]";
    if (typeof val === "undefined") return "[undefined]";
    if (val === null || typeof val !== "object") return val;
    if (seen.has(val as object)) return "[Circular]";
    seen.add(val as object);
    if (Array.isArray(val)) return val.map(walk);
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      result[k] = walk(v);
    }
    return result;
  }
  return walk(value);
}

function PrimitiveValue({ value }: { value: unknown }) {
  if (value === null) return <span style={styles.jsonNull}>null</span>;
  if (value === "[undefined]")
    return <span style={styles.jsonNull}>undefined</span>;
  if (value === "[Function]")
    return <span style={styles.jsonNull}>[Function]</span>;
  if (value === "[Circular]")
    return <span style={styles.jsonNull}>[Circular]</span>;

  switch (typeof value) {
    case "string":
      return <span style={styles.jsonString}>"{value}"</span>;
    case "number":
      return <span style={styles.jsonNumber}>{String(value)}</span>;
    case "boolean":
      return <span style={styles.jsonBoolean}>{String(value)}</span>;
    default:
      return <span>{String(value)}</span>;
  }
}

export function JsonTree({
  data,
  label,
  path = "",
  changedPaths,
  defaultExpanded,
  depth = 0,
}: JsonTreeProps) {
  const safe = depth === 0 ? sanitize(data) : data;
  const isExpanded = defaultExpanded ?? depth < 2;
  const [expanded, setExpanded] = useState(isExpanded);

  const hasFlash = changedPaths && path && changedPaths.has(path);
  const rowStyle: React.CSSProperties = {
    ...styles.treeRow,
    paddingLeft: depth * 14,
    ...(hasFlash ? styles.flashHighlight : {}),
  };

  // Primitive
  if (safe === null || typeof safe !== "object") {
    return (
      <div style={rowStyle}>
        {label !== undefined && <span style={styles.jsonKey}>{label}: </span>}
        <PrimitiveValue value={safe} />
      </div>
    );
  }

  const entries = Object.entries(safe as Record<string, unknown>);
  const isArray = Array.isArray(safe);
  const bracketOpen = isArray ? "[" : "{";
  const bracketClose = isArray ? "]" : "}";

  // Empty object/array
  if (entries.length === 0) {
    return (
      <div style={rowStyle}>
        {label !== undefined && <span style={styles.jsonKey}>{label}: </span>}
        <span style={{ color: styles.colors.textMuted }}>
          {bracketOpen}
          {bracketClose}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div style={rowStyle}>
        <button
          type="button"
          style={styles.toggleArrow}
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {label !== undefined && <span style={styles.jsonKey}>{label}: </span>}
        {!expanded && (
          <span style={{ color: styles.colors.textMuted }}>
            {bracketOpen}...{bracketClose}{" "}
            <span style={{ fontSize: 10 }}>({entries.length})</span>
          </span>
        )}
        {expanded && (
          <span style={{ color: styles.colors.textMuted }}>{bracketOpen}</span>
        )}
      </div>
      {expanded &&
        entries.map(([key, value]) => {
          const childPath = path ? `${path}.${key}` : key;
          return (
            <JsonTree
              key={key}
              data={value}
              label={isArray ? key : key}
              path={childPath}
              changedPaths={changedPaths}
              depth={depth + 1}
            />
          );
        })}
      {expanded && (
        <div style={{ ...styles.treeRow, paddingLeft: depth * 14 }}>
          <span style={{ color: styles.colors.textMuted }}>{bracketClose}</span>
        </div>
      )}
    </div>
  );
}

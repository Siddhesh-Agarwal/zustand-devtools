/**
 * Compute deep diff between two objects, returning a Set of dot-notation paths that changed.
 */
export function deepDiff(
  prev: unknown,
  next: unknown,
  prefix = "",
): Set<string> {
  const changed = new Set<string>();

  if (prev === next) return changed;

  if (
    typeof prev !== "object" ||
    typeof next !== "object" ||
    prev === null ||
    next === null
  ) {
    if (prefix) changed.add(prefix);
    return changed;
  }

  const prevObj = prev as Record<string, unknown>;
  const nextObj = next as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(prevObj), ...Object.keys(nextObj)]);

  for (const key of allKeys) {
    const path = prefix ? `${prefix}.${key}` : key;
    const childDiff = deepDiff(prevObj[key], nextObj[key], path);
    for (const p of childDiff) changed.add(p);
  }

  return changed;
}

/**
 * Shallow diff returning top-level changed keys.
 */
export function shallowDiff(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): Set<string> {
  const changed = new Set<string>();
  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  for (const key of allKeys) {
    if (prev[key] !== next[key]) changed.add(key);
  }
  return changed;
}

/**
 * Safe JSON.stringify that handles circular references, functions, and undefined.
 */
export function safeStringify(value: unknown, indent = 2): string {
  const seen = new WeakSet();
  return JSON.stringify(
    value,
    (_key, val) => {
      if (typeof val === "function") return "[Function]";
      if (typeof val === "undefined") return "[undefined]";
      if (typeof val === "object" && val !== null) {
        if (seen.has(val)) return "[Circular]";
        seen.add(val);
      }
      return val;
    },
    indent,
  );
}

/**
 * Copy text to clipboard with textarea fallback.
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

/**
 * Format a Date to HH:MM:SS string.
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

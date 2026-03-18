import { useEffect, useRef, useState } from "react";
import { Check, Clipboard, RotateCcw, Trash2 } from "./icons";
import { JsonTree } from "./JsonTree";
import * as styles from "./styles";
import type { Snapshot, StoreConfig } from "./types";
import { copyToClipboard, deepDiff, formatTime, safeStringify } from "./utils";

interface ZustandPanelProps {
  stores: StoreConfig[];
}

export function ZustandPanel({ stores }: ZustandPanelProps) {
  const [activeStore, setActiveStore] = useState(stores[0]?.name ?? "");
  const [storeStates, setStoreStates] = useState<
    Record<string, Record<string, unknown>>
  >({});
  const [snapshots, setSnapshots] = useState<Record<string, Snapshot[]>>({});
  const [changedPaths, setChangedPaths] = useState<Record<string, Set<string>>>(
    {},
  );
  const [viewingSnapshot, setViewingSnapshot] = useState<number | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const flashTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const snapshotIdRef = useRef(0);

  // Subscribe to all stores
  useEffect(() => {
    const unsubs: (() => void)[] = [];

    for (const { name, store } of stores) {
      // Initialize with current state
      const initial = store.getState() as Record<string, unknown>;
      setStoreStates((prev) => ({ ...prev, [name]: initial }));

      const unsub = store.subscribe((state, prevState) => {
        const current = state as Record<string, unknown>;
        const prev = prevState as Record<string, unknown>;

        setStoreStates((s) => ({ ...s, [name]: current }));

        // Compute diff
        const diff = deepDiff(prev, current);
        if (diff.size > 0) {
          setChangedPaths((cp) => ({ ...cp, [name]: diff }));

          // Clear flash after 1s
          if (flashTimers.current[name]) {
            clearTimeout(flashTimers.current[name]);
          }
          flashTimers.current[name] = setTimeout(() => {
            setChangedPaths((cp) => ({ ...cp, [name]: new Set() }));
          }, 1000);

          // Push snapshot
          const changedKeys = [...diff].map((p) => p.split(".")[0]);
          const uniqueKeys = [...new Set(changedKeys)];
          const snapshot: Snapshot = {
            id: ++snapshotIdRef.current,
            timestamp: formatTime(new Date()),
            label: uniqueKeys.join(", "),
            state: { ...current },
            changedKeys: uniqueKeys,
          };
          setSnapshots((s) => {
            const existing = s[name] ?? [];
            return { ...s, [name]: [snapshot, ...existing].slice(0, 20) };
          });
        }
      });
      unsubs.push(unsub);
    }

    return () => {
      unsubs.forEach((u) => {
        u();
      });
      for (const timer of Object.values(flashTimers.current)) {
        clearTimeout(timer);
      }
    };
  }, [stores]);

  const currentState = storeStates[activeStore] ?? {};
  const currentSnapshots = snapshots[activeStore] ?? [];
  const currentChangedPaths = changedPaths[activeStore] ?? new Set<string>();

  const displayState =
    viewingSnapshot !== null
      ? (currentSnapshots[viewingSnapshot]?.state ?? currentState)
      : currentState;

  const handleCopy = async () => {
    await copyToClipboard(safeStringify(displayState));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  };

  const handleClearHistory = () => {
    setSnapshots((s) => ({ ...s, [activeStore]: [] }));
    setViewingSnapshot(null);
  };

  return (
    <div style={styles.basePanel}>
      {/* Store tabs */}
      <div style={styles.sidebar}>
        {stores.map(({ name }) => (
          <button
            type="button"
            key={name}
            style={
              name === activeStore ? styles.sidebarTabActive : styles.sidebarTab
            }
            onClick={() => {
              setActiveStore(name);
              setViewingSnapshot(null);
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <button type="button" style={styles.toolbarButton} onClick={handleCopy}>
          {copyFeedback ? (
            <>
              <Check size={12} /> Copied!
            </>
          ) : (
            <>
              <Clipboard size={12} /> Copy JSON
            </>
          )}
        </button>
        <button
          type="button"
          style={styles.toolbarButton}
          onClick={handleClearHistory}
        >
          <Trash2 size={12} /> Clear History
        </button>
        {viewingSnapshot !== null && (
          <button
            type="button"
            style={{
              ...styles.toolbarButton,
              borderColor: styles.colors.accent,
              color: styles.colors.accent,
            }}
            onClick={() => setViewingSnapshot(null)}
          >
            <RotateCcw size={12} /> Back to Live
          </button>
        )}
        {viewingSnapshot !== null && (
          <span
            style={{
              fontSize: 11,
              color: styles.colors.textMuted,
              marginLeft: 4,
            }}
          >
            Viewing snapshot: {currentSnapshots[viewingSnapshot]?.timestamp}
          </span>
        )}
      </div>

      {/* Main area */}
      <div style={styles.mainArea}>
        {/* Tree pane */}
        <div style={styles.treePane}>
          <JsonTree
            data={displayState}
            changedPaths={
              viewingSnapshot === null ? currentChangedPaths : undefined
            }
          />
        </div>

        {/* Snapshot history */}
        <div style={styles.historyPane}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: styles.colors.textMuted,
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            History
          </div>
          {currentSnapshots.length === 0 && (
            <div style={{ fontSize: 11, color: styles.colors.textMuted }}>
              No changes yet
            </div>
          )}
          {currentSnapshots.map((snap, i) => (
            <button
              type="button"
              key={snap.id}
              style={
                viewingSnapshot === i
                  ? styles.historyItemActive
                  : styles.historyItem
              }
              onClick={() => setViewingSnapshot(i)}
            >
              <span>{snap.timestamp}</span>{" "}
              <span style={{ color: styles.colors.accent, fontSize: 10 }}>
                ({snap.label})
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

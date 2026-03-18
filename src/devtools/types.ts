import type { StoreApi } from "zustand";

export interface StoreConfig<T = unknown> {
  name: string;
  store: StoreApi<T>;
}

export interface ZustandDevtoolsPluginOptions {
  stores: StoreConfig[];
  id?: string;
  name?: string;
  defaultOpen?: boolean;
}

export interface Snapshot {
  id: number;
  timestamp: string;
  label: string;
  state: Record<string, unknown>;
  changedKeys: string[];
}

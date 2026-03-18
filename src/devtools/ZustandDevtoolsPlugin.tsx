import type { ReactElement } from "react";
import type { ZustandDevtoolsPluginOptions } from "./types";
import { ZustandPanel } from "./ZustandPanel";

/**
 * The shape of a plugin accepted by `<TanStackDevtools plugins={[...]} />`.
 * We define our own compatible interface to avoid relying on the export
 * being available from `@tanstack/react-devtools`.
 */
export interface TanStackDevtoolsReactPluginCompat {
  id?: string;
  name: string | ReactElement;
  defaultOpen?: boolean;
  render: ReactElement | ((el: HTMLElement) => ReactElement);
  destroy?: (pluginId: string) => void;
}

declare const process: { env: { NODE_ENV?: string } };

/**
 * Creates a TanStack Devtools plugin for inspecting Zustand stores.
 *
 * In production, returns a no-op plugin to enable dead-code elimination.
 */
export function ZustandDevtoolsPlugin(
  options: ZustandDevtoolsPluginOptions,
): TanStackDevtoolsReactPluginCompat {
  const {
    stores,
    id = "zustand-devtools",
    name = "Zustand",
    defaultOpen = false,
  } = options;

  if (process.env.NODE_ENV !== "development") {
    return {
      id,
      name,
      defaultOpen: false,
      render: <div />,
    };
  }

  return {
    id,
    name,
    defaultOpen,
    render: <ZustandPanel stores={stores} />,
  };
}

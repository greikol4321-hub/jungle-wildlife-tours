import { useEffect } from "react";

type Shortcut = {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  handler: () => void;
};

export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function onKeyDown(e: KeyboardEvent) {
      for (const s of shortcuts) {
        const mod = s.ctrl || s.meta;
        const matchMod = !mod || e.ctrlKey || e.metaKey;
        const matchKey = e.key.toLowerCase() === s.key.toLowerCase();
        if (matchKey && matchMod) {
          if (mod || !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
            e.preventDefault();
            s.handler();
          }
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shortcuts, enabled]);
}

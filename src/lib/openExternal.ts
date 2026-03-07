/**
 * Opens a URL in a real browser tab, escaping iframe/webview contexts.
 * Falls back gracefully if popups are blocked.
 */
export function openExternal(url: string) {
  try {
    // If running inside an iframe, use the top-level window
    const context = window.top ?? window;
    const w = context.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      // Popup blocked — try top-level navigation as last resort
      if (window.top && window.top !== window) {
        window.top.location.href = url;
      } else {
        window.location.href = url;
      }
    }
  } catch {
    // Cross-origin iframe — can't access window.top, use window.open
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) {
      window.location.href = url;
    }
  }
}

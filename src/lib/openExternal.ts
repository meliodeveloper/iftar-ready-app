/**
 * Opens a URL externally, with multiple fallback strategies.
 * Returns true if it believes the open succeeded, false if blocked.
 */
export function openExternal(url: string): boolean {
  const isInIframe = window !== window.top;
  console.log("[openExternal] isInIframe:", isInIframe, "url:", url);

  // Strategy 1: window.open
  try {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (w) {
      console.log("[openExternal] window.open succeeded");
      return true;
    }
    console.log("[openExternal] window.open returned null (blocked)");
  } catch (e) {
    console.log("[openExternal] window.open threw:", e);
  }

  // Strategy 2: Programmatic anchor click
  try {
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log("[openExternal] anchor click fired");
    return true;
  } catch (e) {
    console.log("[openExternal] anchor click failed:", e);
  }

  console.log("[openExternal] all strategies failed");
  return false;
}

/**
 * Detects if the app is running inside an iframe (e.g. Lovable preview).
 */
export function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin iframe — definitely embedded
    return true;
  }
}

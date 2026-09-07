/** CSS var for the live visual viewport height (iOS Safari URL/tab chrome). */
export const INVITE_VH_VAR = "--invite-vh";

/**
 * Keep `--invite-vh` in sync with the visible screen, including when Safari
 * collapses or expands the bottom tab bar / URL bar.
 */
export function bindInviteViewportHeight(): () => void {
  const root = document.documentElement;

  const apply = () => {
    const height = Math.round(window.visualViewport?.height ?? window.innerHeight);
    root.style.setProperty(INVITE_VH_VAR, `${height}px`);
  };

  apply();
  window.visualViewport?.addEventListener("resize", apply);
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);

  return () => {
    window.visualViewport?.removeEventListener("resize", apply);
    window.removeEventListener("resize", apply);
    window.removeEventListener("orientationchange", apply);
  };
}

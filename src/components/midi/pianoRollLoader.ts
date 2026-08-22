/**
 * Loads the vendored webaudio-pianoroll web component (public/vendor/) once.
 * It's a plain script that registers the <webaudio-pianoroll> custom element
 * on load — not a module, so it's injected as a script tag.
 */

let pending: Promise<void> | null = null;

export function loadPianoRoll(): Promise<void> {
  if (customElements.get("webaudio-pianoroll")) return Promise.resolve();
  if (!pending) {
    pending = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "/vendor/webaudio-pianoroll.js";
      script.onload = () => resolve();
      script.onerror = () => {
        pending = null;
        script.remove();
        reject(new Error("Failed to load webaudio-pianoroll.js"));
      };
      document.head.appendChild(script);
    });
  }
  return pending;
}

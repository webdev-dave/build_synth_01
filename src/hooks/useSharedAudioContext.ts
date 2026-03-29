/**
 * Re-export useSharedAudioContext from the context provider.
 * This maintains backwards compatibility with existing imports.
 *
 * The AudioContext is now managed by AudioContextProvider in the root layout,
 * ensuring it persists across page navigations.
 */
export { useSharedAudioContext } from "@/contexts/AudioContext";

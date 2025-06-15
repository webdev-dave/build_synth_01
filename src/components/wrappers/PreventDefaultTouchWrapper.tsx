import React, { ReactNode, CSSProperties } from "react";

interface PreventDefaultTouchWrapperProps {
  /** The content to be rendered within the wrapper. */
  children: ReactNode;
  /** Optional custom styles to be applied to the wrapper div. */
  style?: CSSProperties;
  /** Optional CSS class name for the wrapper div. */
  className?: string;
  /**
   * If true, prevents the browser's context menu from appearing on right-click or long-press.
   * @default true
   */
  preventContextMenu?: boolean;
  /**
   * If true, allows basic scrolling while still preventing other touch actions like pinch-to-zoom.
   * When enabled, uses touchAction: "pan-y" instead of "none" to allow vertical scrolling.
   * @default false
   */
  allowScroll?: boolean;
}

/**
 * A wrapper component that prevents default browser actions for touch and mouse events,
 * such as pinch-to-zoom, scrolling, context menus, and text selection. This is ideal for
 * creating interactive surfaces like virtual instruments or drawing pads where default
 * browser behaviors can interfere with the user experience.
 *
 * @known_issue Windows Tablet Triple-finger Touch
 * Currently, on Windows tablets, the three-finger touch gesture still triggers the Windows
 * task switcher overlay, which can interfere with playing chords. This is a system-level
 * gesture that we haven't found a way to prevent yet. Future investigation needed into:
 * - Potential Windows-specific touch event handling
 * - System-level gesture prevention APIs
 * - Alternative touch input handling strategies
 *
 * @example
 * ```tsx
 * <PreventDefaultTouchWrapper>
 *   <MyInteractiveComponent />
 * </PreventDefaultTouchWrapper>
 * ```
 *
 * @example
 * ```tsx
 * <PreventDefaultTouchWrapper allowScroll={true}>
 *   <MyScrollableComponent />
 * </PreventDefaultTouchWrapper>
 * ```
 */
const PreventDefaultTouchWrapper: React.FC<PreventDefaultTouchWrapperProps> = ({
  children,
  style,
  className,
  preventContextMenu = true,
  allowScroll = false,
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    if (preventContextMenu) {
      e.preventDefault();
    }
  };

  const wrapperStyle: CSSProperties = {
    // Allow scrolling when requested, otherwise disable all touch actions
    touchAction: allowScroll ? "pan-y" : "none", // "pan-y" allows vertical scrolling, "none" disables all touch actions
    overscrollBehavior: "none", // Prevents scroll chaining and browser navigation gestures.
    userSelect: "none", // Prevents text selection.
    WebkitTouchCallout: "none", // Disables the callout menu on long-press (iOS).
    WebkitTapHighlightColor: "transparent", // Removes the tap highlight color on mobile browsers.
    ...style,
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      style={wrapperStyle}
      className={className}
    >
      {children}
    </div>
  );
};

export default PreventDefaultTouchWrapper;

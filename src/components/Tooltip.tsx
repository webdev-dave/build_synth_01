"use client";

import {
  useState,
  cloneElement,
  isValidElement,
  useRef,
  useLayoutEffect,
  useEffect,
  useId,
} from "react";
import { createPortal } from "react-dom";
import { useTooltipConfig } from "./TooltipContext";

interface TooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** The tooltip text */
  message: string;
  /** Placement of tooltip relative to trigger */
  placement?: "top" | "bottom" | "left" | "right";
  /** Horizontal alignment of tooltip relative to trigger */
  alignX?: "left" | "center" | "right";
  /** Show tooltip regardless of global toggle */
  forceEnabled?: boolean;
}

export default function Tooltip({
  children,
  message,
  placement = "top",
  alignX = "left",
  forceEnabled = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const { enabled: tooltipsEnabled } = useTooltipConfig();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const longPressTimer = useRef<number | null>(null);
  const LONG_PRESS_MS = 550;
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [transform, setTransform] = useState<string>("translate(-50%, -100%)");
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Accessibility ID
  const tooltipId = useId();

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": tooltipId,
      } as React.HTMLAttributes<HTMLElement>)
    : children;

  // Calculate tooltip position when it becomes visible or on window resize
  const calculatePosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;
    let baseTransform = "";

    const offset = 6;

    switch (placement) {
      case "bottom": {
        top = rect.bottom + offset;
        // horizontal alignment
        if (alignX === "left") {
          left = rect.left;
          baseTransform = "translate(0, 0)";
        } else if (alignX === "right") {
          left = rect.right;
          baseTransform = "translate(-100%, 0)";
        } else {
          left = rect.left + rect.width / 2;
          baseTransform = "translate(-50%, 0)";
        }
        break;
      }
      case "left": {
        left = rect.left - offset;
        top = rect.top + rect.height / 2;
        baseTransform = "translate(-100%, -50%)";
        break;
      }
      case "right": {
        left = rect.right + offset;
        top = rect.top + rect.height / 2;
        baseTransform = "translate(0, -50%)";
        break;
      }
      case "top":
      default: {
        top = rect.top - offset;
        // horizontal alignment
        if (alignX === "left") {
          left = rect.left;
          baseTransform = "translate(0, -100%)";
        } else if (alignX === "right") {
          left = rect.right;
          baseTransform = "translate(-100%, -100%)";
        } else {
          left = rect.left + rect.width / 2;
          baseTransform = "translate(-50%, -100%)";
        }
        break;
      }
    }

    setPosition({ top, left });
    setTransform(baseTransform);
  };

  // Initial calculation when visible changes
  useLayoutEffect(() => {
    if (visible) {
      calculatePosition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, placement, alignX]);

  // Auto-nudging removed per request

  useEffect(() => {
    if (!visible) return;
    const handleResize = () => calculatePosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, placement, alignX]);

  // Track last interaction method
  useEffect(() => {
    const handleKeyDown = () => setIsKeyboardNav(true);
    const handlePointerDown = () => setIsKeyboardNav(false);

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("pointerdown", handlePointerDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, []);

  // The actual tooltip element rendered via portal
  const tooltipElement = (
    <span
      ref={tooltipRef}
      id={tooltipId}
      role="tooltip"
      className={`pointer-events-none fixed z-[1000] whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white transition-opacity duration-100 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ top: position.top, left: position.left, transform }}
    >
      {message}
    </span>
  );

  return (
    <span
      ref={triggerRef}
      className="relative inline-block focus-visible:outline-none"
      onPointerEnter={(e) => {
        if (!tooltipsEnabled && !forceEnabled) return;
        if (e.pointerType === "mouse") setVisible(true);
      }}
      onPointerLeave={(e) => {
        if (!tooltipsEnabled && !forceEnabled) return;
        if (e.pointerType === "mouse") setVisible(false);
        if (e.pointerType !== "mouse") {
          if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
          setVisible(false);
        }
      }}
      onPointerDown={(e) => {
        if (!tooltipsEnabled && !forceEnabled) return;
        if (e.pointerType !== "mouse") {
          // start long-press timer
          longPressTimer.current = window.setTimeout(() => {
            setVisible(true);
          }, LONG_PRESS_MS);
        }
      }}
      onPointerUp={(e) => {
        if (!tooltipsEnabled && !forceEnabled) return;
        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
        }
        if (e.pointerType !== "mouse") {
          setVisible(false);
        }
      }}
      onFocus={() => {
        if (!tooltipsEnabled && !forceEnabled) return;
        if (isKeyboardNav) setVisible(true);
      }}
      onBlur={() => setVisible(false)}
    >
      {trigger}
      {(tooltipsEnabled || forceEnabled) &&
        visible &&
        createPortal(tooltipElement, document.body)}
    </span>
  );
}

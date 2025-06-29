import { useState, cloneElement, isValidElement } from "react";
import { useRef, useLayoutEffect } from "react";

interface TooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** The tooltip text */
  message: string;
  /** Placement of tooltip relative to trigger */
  placement?: "top" | "bottom" | "left" | "right";
}

export default function Tooltip({
  children,
  message,
  placement = "top",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Ensure we can pass aria-describedby for accessibility
  const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 11)}`;

  const trigger = isValidElement(children)
    ? cloneElement(children, {
        "aria-describedby": tooltipId,
      })
    : children;

  const placementClasses = {
    top: "bottom-full mb-1 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-1 left-1/2 -translate-x-1/2",
    left: "right-full mr-1 top-1/2 -translate-y-1/2",
    right: "left-full ml-1 top-1/2 -translate-y-1/2",
  } as const;

  // Keep tooltip inside viewport
  useLayoutEffect(() => {
    if (!visible || !tooltipRef.current) return;
    const rect = tooltipRef.current.getBoundingClientRect();
    let offsetX = 0;
    if (rect.left < 4) {
      offsetX = 4 - rect.left;
    } else if (rect.right > window.innerWidth - 4) {
      offsetX = window.innerWidth - 4 - rect.right;
    }
    if (offsetX !== 0) {
      tooltipRef.current.style.transform += ` translateX(${offsetX}px)`;
    }
  }, [visible]);

  return (
    <span
      className="relative inline-block focus-visible:outline-none"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {trigger}
      <span
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 ${
          placementClasses[placement]
        } ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {message}
      </span>
    </span>
  );
}

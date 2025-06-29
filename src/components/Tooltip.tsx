import {
  useState,
  cloneElement,
  isValidElement,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactElement;
  /** The tooltip text */
  message: string;
  /** Placement of tooltip relative to trigger */
  placement?: "top" | "bottom" | "left" | "right";
  /** Horizontal alignment of tooltip relative to trigger */
  alignX?: "left" | "center" | "right";
}

export default function Tooltip({
  children,
  message,
  placement = "top",
  alignX = "left",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [transform, setTransform] = useState<string>("translate(-50%, -100%)");
  const tooltipRef = useRef<HTMLSpanElement>(null);

  // Accessibility ID
  const tooltipId = `tooltip-${Math.random().toString(36).slice(2, 11)}`;

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
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {trigger}
      {visible && createPortal(tooltipElement, document.body)}
    </span>
  );
}

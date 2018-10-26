import { useEffect, useState } from "react";

function normalizeRect(rect) {
  if (rect.width === undefined) {
    rect.width = rect.right - rect.left;
  }

  if (rect.height === undefined) {
    rect.height = rect.bottom - rect.top;
  }

  return rect;
}

const DEFAULT_OPTIONS = {
  intervalCheck: false,
  containment: null,
  scrollCheck: false
};

export default function(ref, opts) {
  /*
    Get options
  */
  const { containment, intervalCheck, scrollCheck } = Object.assign(
    {},
    DEFAULT_OPTIONS,
    opts
  );
  /*
    Create local state
  */
  const [isVisible, setIsVisible] = useState(null);

  /*
    Check visibility
  */
  function checkVisibility() {
    let containmentRect;
    if (containment) {
      const containmentDOMRect = containment.getBoundingClientRect();
      containmentRect = {
        top: containmentDOMRect.top,
        left: containmentDOMRect.left,
        bottom: containmentDOMRect.bottom,
        right: containmentDOMRect.right
      };
    } else {
      containmentRect = {
        top: 0,
        left: 0,
        bottom: window.innerHeight || document.documentElement.clientHeight,
        right: window.innerWidth || document.documentElement.clientWidth
      };
    }

    const rect = normalizeRect(ref.current.getBoundingClientRect());
    const hasSize = rect.height > 0 && rect.width > 0;

    const visibilityRect = {
      top: rect.top >= containmentRect.top,
      left: rect.left >= containmentRect.left,
      bottom: rect.bottom <= containmentRect.bottom,
      right: rect.right <= containmentRect.right
    };

    return (
      hasSize &&
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right
    );
  }

  function updateIsVisible() {
    setIsVisible(checkVisibility());
  }

  // If interval check is needed
  useEffect(() => {
    if (intervalCheck && intervalCheck > 0) {
      const intervalTimer = setInterval(updateIsVisible, intervalCheck);
      return () => {
        clearInterval(intervalTimer);
      };
    }
  });

  // If scroll check is needed
  useEffect(() => {
    if (scrollCheck) {
      updateIsVisible();
      containment.addEventListener("scroll", updateIsVisible);
      return () => {
        containment.removeEventListener("scroll", updateIsVisible);
      };
    }
  }, []);

  return isVisible;
}

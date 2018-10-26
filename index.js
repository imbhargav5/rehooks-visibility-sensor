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
  partialVisibility: true,
  containment: null,
  scrollCheck: false,
  scrollDebounce: 250,
  scrollThrottle: -1,
  resizeCheck: false,
  resizeDebounce: 250,
  resizeThrottle: -1,
  shouldCheckOnMount: true,
  minTopValue: 0
};

export default function(ref, opts) {
  /*
    Get options
  */
  const {
    containment,
    intervalCheck,
    scrollCheck,
    shouldCheckOnMount,
    scrollDebounce,
    scrollThrottle,
    resizeCheck,
    resizeDebounce,
    resizeThrottle,
    partialVisibility,
    minTopValue
  } = Object.assign({}, DEFAULT_OPTIONS, opts);

  function getContainer() {
    return containment || window;
  }

  /*
    Create local state
  */
  const [isVisible, setIsVisible] = useState(null);
  const [visibilityRect, setVisibilityRect] = useState({});

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

    let isVisible =
      hasSize &&
      visibilityRect.top &&
      visibilityRect.left &&
      visibilityRect.bottom &&
      visibilityRect.right;

    // check for partial visibility
    if (hasSize && partialVisibility) {
      let partialVisible =
        rect.top <= containmentRect.bottom &&
        rect.bottom >= containmentRect.top &&
        rect.left <= containmentRect.right &&
        rect.right >= containmentRect.left;

      // account for partial visibility on a single edge
      if (typeof partialVisibility === "string") {
        partialVisible = visibilityRect[partialVisibility];
      }

      // if we have minimum top visibility set by props, lets check, if it meets the passed value
      // so if for instance element is at least 200px in viewport, then show it.
      isVisible = minTopValue
        ? partialVisible && rect.top <= containmentRect.bottom - minTopValue
        : partialVisible;
    }
    return isVisible;
  }

  function updateIsVisible() {
    const newIsVisible = checkVisibility();
    if (newIsVisible !== isVisible) {
      setIsVisible(newIsVisible);
    }
  }

  // run only once, hence empty array as second argument
  useEffect(() => {
    shouldCheckOnMount && updateIsVisible();
  }, []);

  // If interval check is needed
  useEffect(() => {
    if (intervalCheck && intervalCheck > 0) {
      const intervalTimer = setInterval(updateIsVisible, intervalCheck);
      return () => {
        clearInterval(intervalTimer);
      };
    }
  });

  function createListener(debounce, throttle) {
    let timeout;
    let listener;
    const later = () => {
      timeout = null;
      updateIsVisible();
    };
    if (throttle > -1) {
      listener = () => {
        if (!timeout) {
          timeout = setTimeout(later, throttle || 0);
        }
      };
    } else {
      listener = () => {
        clearTimeout(timeout);
        timeout = setTimeout(later, debounce || 0);
      };
    }
    return {
      listener,
      timeout
    };
  }

  // If scroll check is needed
  useEffect(() => {
    if (scrollCheck) {
      const { listener, timeout } = createListener(
        scrollDebounce,
        scrollThrottle
      );
      const container = getContainer();
      container.addEventListener("scroll", listener);
      return () => {
        clearTimeout(timeout);
        container.removeEventListener("scroll", listener);
      };
    }
  }, []);

  // if resize check is needed

  useEffect(() => {
    if (resizeCheck) {
      const { listener, timeout } = createListener(
        resizeDebounce,
        resizeThrottle
      );
      const container = getContainer();
      container.addEventListener("resize", listener);
      return () => {
        clearTimeout(timeout);
        container.removeEventListener("resize", listener);
      };
    }
  }, []);

  return isVisible;
}

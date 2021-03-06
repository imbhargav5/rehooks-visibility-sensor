interface RefObject<T> {
  // immutable
  readonly current: T | null;
}

interface Options {
  intervalCheck: boolean | number;
  partialVisibility: boolean | string;
  containment: null;
  scrollCheck: boolean;
  scrollDebounce: number;
  scrollThrottle: number;
  resizeCheck: boolean;
  resizeDebounce: number;
  resizeThrottle: number;
  shouldCheckOnMount: boolean | string;
  minTopValue: number;
}

interface VisibilitySensor {
  isVisible: Object | boolean;
  visibilityRect: Object;
}

export default function useVisibilitySensor(
  RefObject,
  Options
): VisibilitySensor;

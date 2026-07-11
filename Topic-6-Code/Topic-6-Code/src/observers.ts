// Observers API wrappers (IntersectionObserver, ResizeObserver, MutationObserver)

export class ObserverManager {
  // 1. Setup IntersectionObserver for lazy loading elements detection
  static createIntersectionObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    return new IntersectionObserver(callback, options);
  }

  // 2. Setup ResizeObserver for layout shift tracking
  static createResizeObserver(callback: ResizeObserverCallback): ResizeObserver {
    return new ResizeObserver(callback);
  }

  // 3. Setup MutationObserver for DOM alterations detection
  static createMutationObserver(callback: MutationCallback): MutationObserver {
    return new MutationObserver(callback);
  }
}

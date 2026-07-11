// SPA History Router using HTML5 History API

type RouteHandler = (params?: Record<string, string>) => void;

export class HistoryRouter {
  private routes: Record<string, RouteHandler> = {};
  private currentPath = '';

  constructor() {
    // Listen for browser navigation controls (back/forward clicks)
    window.addEventListener('popstate', (event) => {
      this.navigateTo(window.location.pathname, false);
    });
  }

  registerRoute(path: string, handler: RouteHandler): void {
    this.routes[path] = handler;
  }

  navigateTo(path: string, pushState = true): void {
    this.currentPath = path;

    if (pushState) {
      // Use pushState to update browser URL without page refreshes
      window.history.pushState({ path }, '', path);
    }

    const handler = this.routes[path];
    if (handler) {
      handler();
    } else {
      console.warn(`No handler registered for path: ${path}`);
    }
  }

  getCurrentPath(): string {
    return this.currentPath;
  }
}

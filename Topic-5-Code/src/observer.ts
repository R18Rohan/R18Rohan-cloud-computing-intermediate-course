// Observer / EventEmitter Pattern for decoupled pub/sub communication

type Listener = (...args: any[]) => void;

export class CustomEventEmitter {
  private events: Record<string, Listener[]> = {};

  // Register subscription
  on(event: string, listener: Listener): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // De-register subscription
  off(event: string, listener: Listener): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  // Broadcast event payload
  emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}

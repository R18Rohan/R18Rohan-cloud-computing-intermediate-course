// Proxy-based reactive data store notifying subscribers of changes

type Subscriber<T> = (state: T, key: string, val: any) => void;

export class ReactiveStore<T extends object> {
  private subscribers: Subscriber<T>[] = [];
  public state: T;

  constructor(initialState: T) {
    const self = this;

    // Wrap the state object inside a Proxy
    this.state = new Proxy(initialState, {
      set(target: any, prop: string, value: any) {
        target[prop] = value;
        
        // Notify subscribers of the state change
        self.subscribers.forEach((sub) => sub(target, prop, value));
        return true;
      }
    });
  }

  // Register subscription callbacks
  subscribe(callback: Subscriber<T>): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback);
    };
  }
}

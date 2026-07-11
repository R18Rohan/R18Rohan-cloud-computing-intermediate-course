// Private data encapsulation using WeakMap and Symbols

// WeakMap keys must be objects, values can be anything.
// Weak references allow garbage collection if instances are deleted.
const privatePasswords = new WeakMap<object, string>();

// Symbols represent unique object property keys
export const MetadataKey = Symbol('user.metadata');

export class SecureUser {
  public username: string;
  
  // Dynamic symbol property assignment
  [MetadataKey]: { created: number };

  constructor(username: string, password: string) {
    this.username = username;
    this[MetadataKey] = { created: Date.now() };
    
    // Store password inside the private WeakMap bound to the instance object
    privatePasswords.set(this, password);
  }

  verifyPassword(input: string): boolean {
    const stored = privatePasswords.get(this);
    return stored === input;
  }
}

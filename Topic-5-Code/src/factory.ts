// Factory Pattern for flexible object creation

export interface IUser {
  name: string;
  role: string;
  getPermissions(): string[];
}

class AdminUser implements IUser {
  role = 'admin';
  constructor(public name: string) {}
  getPermissions() {
    return ['read', 'write', 'delete'];
  }
}

class MemberUser implements IUser {
  role = 'member';
  constructor(public name: string) {}
  getPermissions() {
    return ['read'];
  }
}

export class UserFactory {
  static createUser(name: string, role: 'admin' | 'member'): IUser {
    switch (role) {
      case 'admin':
        return new AdminUser(name);
      case 'member':
        return new MemberUser(name);
      default:
        throw new Error(`Unknown user role: ${role}`);
    }
  }
}

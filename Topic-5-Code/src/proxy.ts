// Proxy Pattern for request interception and validation

export interface ISensitiveData {
  secretKey: string;
  publicId: string;
}

export function createSecureDataProxy(target: ISensitiveData, userRole: string): ISensitiveData {
  return new Proxy(target, {
    // Intercept read queries (GET trap)
    get(targetObj, prop: keyof ISensitiveData) {
      if (prop === 'secretKey' && userRole !== 'admin') {
        throw new Error('Access Denied: Admin role required to read secretKey.');
      }
      return targetObj[prop];
    },

    // Intercept property modifications (SET trap)
    set(targetObj, prop: keyof ISensitiveData, value: any) {
      if (prop === 'publicId') {
        throw new Error('Mutation Error: publicId property is read-only.');
      }
      targetObj[prop] = value;
      return true;
    }
  });
}

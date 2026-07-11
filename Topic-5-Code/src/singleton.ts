// Singleton Pattern for global configuration management

export class AppConfig {
  private static instance: AppConfig | null = null;
  private settings: Record<string, any> = {};

  // Enforce private constructor to prevent manual instantiation via `new`
  private constructor() {
    this.settings = {
      environment: 'development',
      port: 3000
    };
  }

  // Static getter to access single shared instance
  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  public get(key: string): any {
    return this.settings[key];
  }

  public set(key: string, value: any): void {
    this.settings[key] = value;
  }
}

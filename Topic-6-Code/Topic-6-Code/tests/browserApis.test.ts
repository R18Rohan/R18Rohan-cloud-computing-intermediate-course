import { SafeStorage } from '../src/storage';
import { HistoryRouter } from '../src/historyRouter';
import { ClipboardManager } from '../src/clipboard';
import { ObserverManager } from '../src/observers';

describe('Browser APIs and Web Platform', () => {

  describe('Web Storage (with Expiration)', () => {
    beforeEach(() => {
      SafeStorage.clear();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should set and get items without TTL', () => {
      SafeStorage.setItem('username', 'john_doe');
      expect(SafeStorage.getItem('username')).toBe('john_doe');
    });

    test('should return null and purge item if TTL expired', () => {
      SafeStorage.setItem('session', 'secretToken123', 5000); // 5s TTL
      
      // Advance timers by 6 seconds
      jest.advanceTimersByTime(6000);

      expect(SafeStorage.getItem('session')).toBeNull();
      expect(localStorage.getItem('session')).toBeNull(); // Cleaned from backing store
    });

    test('should keep item if TTL has not expired', () => {
      SafeStorage.setItem('session', 'secretToken123', 5000); // 5s TTL
      
      jest.advanceTimersByTime(2000); // 2 seconds pass

      expect(SafeStorage.getItem('session')).toBe('secretToken123');
    });
  });

  describe('History API Routing', () => {
    test('should register routes and transition paths without page reload', () => {
      const router = new HistoryRouter();
      const mockHandler = jest.fn();

      router.registerRoute('/profile', mockHandler);
      router.navigateTo('/profile');

      expect(router.getCurrentPath()).toBe('/profile');
      expect(window.location.pathname).toBe('/profile');
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clipboard API', () => {
    let mockWrite: jest.Mock;
    let mockRead: jest.Mock;

    beforeEach(() => {
      mockWrite = jest.fn();
      mockRead = jest.fn().mockResolvedValue('copied text content');

      // Mock the browser navigator.clipboard interface
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: mockWrite,
          readText: mockRead
        },
        writable: true,
        configurable: true
      });
    });

    test('should copy text successfully using async clipboard writeText', async () => {
      await ClipboardManager.copyText('hello clipboard');
      expect(mockWrite).toHaveBeenCalledWith('hello clipboard');
    });

    test('should paste text successfully using async clipboard readText', async () => {
      const result = await ClipboardManager.pasteText();
      expect(mockRead).toHaveBeenCalled();
      expect(result).toBe('copied text content');
    });
  });

  describe('Observers API', () => {
    beforeEach(() => {
      // Mock Observers on the global window context
      global.IntersectionObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }));

      global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }));

      global.MutationObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        disconnect: jest.fn()
      }));
    });

    test('should create observers instances with registered callbacks', () => {
      const intersectCallback = jest.fn();
      const resizeCallback = jest.fn();
      const mutationCallback = jest.fn();

      const intersectObs = ObserverManager.createIntersectionObserver(intersectCallback);
      const resizeObs = ObserverManager.createResizeObserver(resizeCallback);
      const mutationObs = ObserverManager.createMutationObserver(mutationCallback);

      expect(intersectObs).toBeDefined();
      expect(resizeObs).toBeDefined();
      expect(mutationObs).toBeDefined();
    });
  });
});

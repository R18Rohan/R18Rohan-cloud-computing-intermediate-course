// Clipboard API asynchronous text manager

export class ClipboardManager {
  // Copy plain text to client clipboard
  static async copyText(text: string): Promise<void> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported in this browser environment.');
    }
    await navigator.clipboard.writeText(text);
  }

  // Paste plain text from client clipboard
  static async pasteText(): Promise<string> {
    if (!navigator.clipboard) {
      throw new Error('Clipboard API not supported in this browser environment.');
    }
    return await navigator.clipboard.readText();
  }
}

interface DataTransferItem {
  getAsFileSystemHandle(): Promise<FileSystemHandle>;
}

interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}
interface Window {
  __analyticsEnabled?: boolean;
  umami?: {
    track(name: string, data?: Record<string, string | number>): void;
  };
}

interface DataTransferItem {
  getAsFileSystemHandle(): Promise<FileSystemHandle>;
}

interface Window {
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
}
interface Window {
  umami?: {
    track(name: string, data?: Record<string, string | number>): void;
  };
}

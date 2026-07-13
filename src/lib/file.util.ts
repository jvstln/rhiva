import { toast } from "sonner";

export const downloadLink = (link: string, filename: string) => {
  toast.loading("Downloading file...", { id: "download" });

  const a = document.createElement("a");
  a.href = link;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  toast.success("File downloaded successfully", { id: "download" });
};

export const downloadFile = (file: File | Blob, filename: string) => {
  const url = URL.createObjectURL(file);
  downloadLink(url, filename);
  URL.revokeObjectURL(url);
};

export interface SelectFileOptions {
  accept?: string;
  multiple?: boolean;
}

interface FilePickerAcceptType {
  description?: string;
  accept: Record<string, string[]>;
}

interface OpenFilePickerOptions {
  multiple?: boolean;
  excludeAcceptAllOption?: boolean;
  types?: FilePickerAcceptType[];
}

interface FileSystemFileHandle {
  getFile(): Promise<File>;
}

interface WindowWithFilePicker extends Window {
  showOpenFilePicker?: (options?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
}

export const selectFile = (options: SelectFileOptions = {}): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    // Try window.showOpenFilePicker
    if (typeof window !== "undefined") {
      const win = window as WindowWithFilePicker;
      if (win.showOpenFilePicker) {
        const pickerOptions: OpenFilePickerOptions = {
          multiple: options.multiple ?? false,
        };

        if (options.accept) {
          const acceptMap: Record<string, Record<string, string[]>> = {
            "image/*": { "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp", ".svg"] },
            "video/*": { "video/*": [".mp4", ".webm", ".ogg"] },
            "audio/*": { "audio/*": [".mp3", ".wav", ".ogg"] },
            "application/pdf": { "application/pdf": [".pdf"] },
          };

          const accept = acceptMap[options.accept] || { "*/*": [] };
          pickerOptions.types = [
            {
              description: options.accept.split("/")[0] + " files",
              accept,
            },
          ];
        }

        win
          .showOpenFilePicker(pickerOptions)
          .then(async (handles) => {
            const files = await Promise.all(handles.map((h) => h.getFile()));
            resolve(files);
          })
          .catch((err: unknown) => {
            const error = err as Record<string, unknown> | null;
            if (error && error.name === "AbortError") {
              resolve([]);
            } else {
              fallbackInputSelect(options, resolve, reject);
            }
          });
        return;
      }
    }
    fallbackInputSelect(options, resolve, reject);
  });
};

const fallbackInputSelect = (
  options: SelectFileOptions,
  resolve: (value: File[]) => void,
  reject: (reason?: unknown) => void
) => {
  const input = document.createElement("input");
  input.type = "file";
  if (options.accept) input.accept = options.accept;
  if (options.multiple) input.multiple = true;

  input.onchange = () => {
    if (input.files) {
      resolve(Array.from(input.files));
    } else {
      resolve([]);
    }
  };

  input.onerror = (err) => {
    reject(err);
  };

  input.click();
};

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

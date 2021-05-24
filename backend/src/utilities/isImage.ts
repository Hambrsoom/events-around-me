export function isImage(
  filename: string,
  ): boolean {
    const extension: string = getExtension(filename);
    switch (extension.toLowerCase()) {
      case "jpg":
      case "gif":
      case "bmp":
      case "png":
        return true;
    }
    return false;
};

function getExtension(
  filename: string,
  ): string {
    const parts: string[] = filename.split(".");
    return parts[parts.length - 1];
}

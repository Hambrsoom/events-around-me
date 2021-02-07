export function isImage(
  filename: string)
  : boolean {
  const extension = getExtension(filename);
  switch (extension.toLowerCase()) {
    case 'jpg':
    case 'gif':
    case 'bmp':
    case 'png':
      return true;
  }
  return false;
};

function getExtension(
  filename)
  : string {
  
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

// FileSummarizer.js
import { PathLike, readdirSync } from 'fs';

function summarizeFilesInDirectorySync(directory: PathLike) {
  return readdirSync(directory).map(fileName => ({
    directory,
    fileName,
  }));
}

const _summarizeFilesInDirectorySync = summarizeFilesInDirectorySync;
export { _summarizeFilesInDirectorySync as summarizeFilesInDirectorySync };

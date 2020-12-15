const fs = jest.genMockFromModule('fs');

let mockFiles: Record<string, unknown> = {};

function __setMockFiles (newMockFiles: Record<string, unknown>) {
  mockFiles = newMockFiles;
}

function readFileSync(filePath: string) {
  return mockFiles[filePath] || '';
}

// If anyone knows how to avoid the type assertion feel free to edit this answer
(fs as any).__setMockFiles = __setMockFiles;
(fs as any).readFileSync = readFileSync;

module.exports = fs;

import fs from 'fs';
import path from 'path';

const historyDir = path.join(process.cwd(), 'migrated_prompt_history');
const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));

// We want to keep track of the latest content for each file.
const fileContents: Record<string, string> = {};

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(historyDir, file), 'utf8'));
  
  function traverse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else if (obj && typeof obj === 'object') {
      if (obj.path && typeof obj.path === 'string' && obj.path.startsWith('components/')) {
        if (obj.diffs && Array.isArray(obj.diffs)) {
          for (const diff of obj.diffs) {
            if (diff.target === '') {
              fileContents[obj.path] = diff.replacement;
            } else {
              // Apply diff to existing content
              if (fileContents[obj.path]) {
                fileContents[obj.path] = fileContents[obj.path].replace(diff.target, diff.replacement);
              }
            }
          }
        }
      }
      for (const key in obj) {
        traverse(obj[key]);
      }
    }
  }
  
  traverse(data);
}

for (const [filePath, content] of Object.entries(fileContents)) {
  console.log('WRITING FILE:', filePath);
  const fullPath = path.join(process.cwd(), 'src', filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.cwd(), 'migrated_prompt_history');
const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(historyDir, file), 'utf8'));
  
  // The structure is usually an array of messages or a single object.
  // Let's traverse the object to find all objects with "path" and "content" or "text" or "replacement"
  
  function traverse(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else if (obj && typeof obj === 'object') {
      if (obj.path && typeof obj.path === 'string' && obj.path.startsWith('components/')) {
        console.log('FOUND FILE:', obj.path);
        if (obj.content) {
          fs.mkdirSync(path.dirname(path.join(process.cwd(), 'src', obj.path)), { recursive: true });
          fs.writeFileSync(path.join(process.cwd(), 'src', obj.path), obj.content);
        } else if (obj.text) {
          fs.mkdirSync(path.dirname(path.join(process.cwd(), 'src', obj.path)), { recursive: true });
          fs.writeFileSync(path.join(process.cwd(), 'src', obj.path), obj.text);
        }
      }
      for (const key in obj) {
        traverse(obj[key]);
      }
    }
  }
  
  traverse(data);
}

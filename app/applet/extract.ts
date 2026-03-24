import fs from 'fs';
import path from 'path';

const historyDir = path.join(process.cwd(), 'migrated_prompt_history');
const files = fs.readdirSync(historyDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(historyDir, file), 'utf8'));
  
  function traverse(obj: any) {
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

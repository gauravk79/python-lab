export function runSimulatedPython(code: string, conceptId: string): string {
  try {
    let output: string[] = [];
    const env: Record<string, any> = {};
    const lines = code.split('\n').map(l => l.trim()).filter(l => l !== '');

    if (conceptId === 'variables') {
      for (const line of lines) {
        let assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (assignMatch) {
          let val = assignMatch[2].trim();
          if (val.startsWith('"') || val.startsWith("'")) val = val.slice(1, -1);
          env[assignMatch[1]] = val;
        } else if (line.startsWith('print(')) {
          let inner = line.slice(6, -1);
          let parts = inner.split(',').map(p => p.trim());
          let resolved = parts.map(p => {
            if (p.startsWith('"') || p.startsWith("'")) return p.slice(1, -1);
            if (env[p] !== undefined) return env[p];
            return p;
          });
          output.push(resolved.join(' '));
        }
      }
      if (output.length > 0) return output.join('\n');
    }
    
    if (conceptId === 'math') {
      for (const line of lines) {
        let assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(\d+)$/);
        if (assignMatch) {
          env[assignMatch[1]] = Number(assignMatch[2]);
        } else if (line.startsWith('print(')) {
          let inner = line.slice(6, -1);
          inner = inner.split('#')[0].trim();
          let mathMatch = inner.match(/^([a-zA-Z_]\w*)\s*(\+|\-|\*|\*\*|\/)\s*([a-zA-Z_]\w*)$/);
          if (mathMatch) {
            let left = env[mathMatch[1]];
            let op = mathMatch[2];
            let right = env[mathMatch[3]];
            if (left !== undefined && right !== undefined) {
              if (op === '+') output.push(String(left + right));
              if (op === '-') output.push(String(left - right));
              if (op === '*') output.push(String(left * right));
              if (op === '**') output.push(String(Math.pow(left, right)));
              if (op === '/') output.push(String(left / right));
            } else { output.push("Error"); }
          }
        }
      }
      if (output.length > 0) return output.join('\n');
    }
    
    if (conceptId === 'strings') {
       for (const line of lines) {
         let assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(["'])(.*?)\2$/);
         if (assignMatch) {
           env[assignMatch[1]] = assignMatch[3];
         } else if (line.startsWith('print(')) {
           let inner = line.slice(6, -1).trim();
           if (inner.endsWith('.upper()')) {
             let v = inner.replace('.upper()', '');
             output.push(env[v]?.toUpperCase() || "");
           } else if (inner.endsWith('.title()')) {
             let v = inner.replace('.title()', '');
             let str = env[v] || "";
             output.push(str.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '));
           } else if (inner.startsWith('len(')) {
             let v = inner.slice(4, -1);
             output.push(String((env[v] || "").length));
           }
         }
       }
       if (output.length > 0) return output.join('\n');
    }
    
    if (conceptId === 'lists') {
      let loopVar = "";
      let listVar = "";
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*\[(.*)\]$/);
        if (assignMatch) {
          env[assignMatch[1]] = assignMatch[2].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        }
        let forMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*):$/);
        if (forMatch) {
          loopVar = forMatch[1];
          listVar = forMatch[2];
        }
        if (line.trim().startsWith('print(')) {
          let inner = line.trim().slice(6, -1);
          if (inner === loopVar && env[listVar]) {
            env[listVar].forEach((item: string) => output.push(item));
          }
        }
      }
      if (output.length > 0) return output.join('\n');
    }

    if (conceptId === 'functions') {
       let inDef = false;
       let defReturn = "";
       let params: string[] = [];
       for (let i = 0; i < lines.length; i++) {
         let line = lines[i];
         let defMatch = line.match(/^def\s+([a-zA-Z_]\w*)\((.*?)\):$/);
         if (defMatch) {
           inDef = true;
           params = defMatch[2].split(',').map(s => s.trim());
         } else if (inDef && line.trim().startsWith('return')) {
           defReturn = line.trim().substring(6).trim();
           inDef = false;
         } else if (line.startsWith('print(')) {
           let inner = line.slice(6, -1);
           let callMatch = inner.match(/^([a-zA-Z_]\w*)\((.*?)\)$/);
           if (callMatch) {
             let arg = callMatch[2].replace(/^['"]|['"]$/g, '');
             let parts = defReturn.split('+').map(s => s.trim());
             let evaluatedParts = parts.map(part => {
               if (part.startsWith('"') || part.startsWith("'")) return part.slice(1, -1);
               if (params.includes(part)) return arg;
               return part;
             });
             output.push(evaluatedParts.join(''));
           }
         }
       }
       if (output.length > 0) return output.join('\n');
    }

    if (conceptId === 'dictionaries') {
       for (let i = 0; i < lines.length; i++) {
         let line = lines[i];
         let assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*\{(.*)\}$/);
         if (assignMatch) {
           let dict: any = {};
           let pairs = assignMatch[2].split(',');
           pairs.forEach(p => {
             let [k, v] = p.split(':').map(s => s.trim());
             if (k) dict[k.replace(/^['"]|['"]$/g, '')] = v.replace(/^['"]|['"]$/g, '');
           });
           env[assignMatch[1]] = dict;
         }
         let forMatch = line.match(/^for\s+([a-zA-Z_]\w*),\s*([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*)\.items\(\):$/);
         if (forMatch) {
           let dictVar = forMatch[3];
           if (lines[i+1] && lines[i+1].trim().startsWith('print(') && env[dictVar]) {
              Object.entries(env[dictVar]).forEach(([k, v]) => {
                output.push(`${k} : ${v}`);
              });
              i++;
           }
         }
       }
       if (output.length > 0) return output.join('\n');
    }

    return "Hmm, the Mind Flayer scrambled this code. Try again!";
  } catch(e) {
    return "Hmm, the Mind Flayer scrambled this code. Try again!";
  }
}

export function splitTopLevel(str: string, separator: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  let inBrackets = 0;
  let inBraces = 0;
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (inQuotes) {
      current += char;
      if (char === quoteChar) inQuotes = false;
    } else {
      if (char === '"' || char === "'") {
        inQuotes = true;
        quoteChar = char;
        current += char;
      } else if (char === '[') {
        inBrackets++;
        current += char;
      } else if (char === ']') {
        inBrackets--;
        current += char;
      } else if (char === '{') {
        inBraces++;
        current += char;
      } else if (char === '}') {
        inBraces--;
        current += char;
      } else if (str.substring(i, i + separator.length) === separator && inBrackets === 0 && inBraces === 0) {
        result.push(current);
        current = '';
        i += separator.length - 1;
        continue;
      } else {
        current += char;
      }
    }
  }
  if (current) result.push(current);
  return result;
}

function evaluateExpression(expr: string, vars: any, funcs: any): any {
  expr = expr.trim();
  if ((expr.startsWith('"') && expr.endsWith('"')) || (expr.startsWith("'") && expr.endsWith("'"))) {
    return expr.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
  if (expr.startsWith('[') && expr.endsWith(']')) {
    return splitTopLevel(expr.slice(1, -1), ',').map(a => evaluateExpression(a, vars, funcs));
  }
  if (expr.startsWith('{') && expr.endsWith('}')) {
    const pairs = splitTopLevel(expr.slice(1, -1), ',');
    const obj: any = {};
    for (const pair of pairs) {
      const parts = splitTopLevel(pair, ':');
      if (parts.length >= 2) {
        const k = evaluateExpression(parts[0], vars, funcs);
        const v = evaluateExpression(parts.slice(1).join(':'), vars, funcs);
        obj[k] = v;
      }
    }
    return obj;
  }

  if (expr.includes(' + ')) {
    const parts = splitTopLevel(expr, ' + ');
    if (parts.length > 1) {
      return parts.map(p => evaluateExpression(p, vars, funcs)).reduce((a, b) => (a as any) + (b as any));
    }
  }
  if (expr.includes(' - ')) {
    const parts = splitTopLevel(expr, ' - ');
    if (parts.length > 1) {
      return evaluateExpression(parts[0], vars, funcs) - evaluateExpression(parts[1], vars, funcs);
    }
  }
  if (expr.includes(' ** ')) {
    const parts = splitTopLevel(expr, ' ** ');
    if (parts.length > 1) {
      return evaluateExpression(parts[0], vars, funcs) ** evaluateExpression(parts[1], vars, funcs);
    }
  }
  if (expr.includes(' * ')) {
    const parts = splitTopLevel(expr, ' * ');
    if (parts.length > 1) {
      return evaluateExpression(parts[0], vars, funcs) * evaluateExpression(parts[1], vars, funcs);
    }
  }
  if (expr.includes(' / ')) {
    const parts = splitTopLevel(expr, ' / ');
    if (parts.length > 1) {
      return evaluateExpression(parts[0], vars, funcs) / evaluateExpression(parts[1], vars, funcs);
    }
  }

  if (expr.startsWith('len(') && expr.endsWith(')')) {
    return evaluateExpression(expr.slice(4, -1), vars, funcs).length;
  }
  
  const upperMatch = expr.match(/^(.+)\.upper\(\)$/);
  if (upperMatch) return String(evaluateExpression(upperMatch[1], vars, funcs)).toUpperCase();
  
  const titleMatch = expr.match(/^(.+)\.title\(\)$/);
  if (titleMatch) {
    const s = String(evaluateExpression(titleMatch[1], vars, funcs));
    return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  const callMatch = expr.match(/^([a-zA-Z_]\w*)\((.*)\)$/);
  if (callMatch && funcs[callMatch[1]]) {
    const fnName = callMatch[1];
    const argVal = evaluateExpression(callMatch[2], vars, funcs);
    const fnDef = funcs[fnName];
    const retMatch = fnDef.body.match(/return\s+(.+)/);
    if (retMatch) {
      const localVars = { ...vars, [fnDef.argName]: argVal };
      return evaluateExpression(retMatch[1], localVars, funcs);
    }
  }

  if (vars.hasOwnProperty(expr)) return vars[expr];
  
  throw new Error(`Cannot parse: ${expr}`);
}

export function runPythonSimulator(code: string): string {
  try {
    const lines = code.split('\n');
    const variables: Record<string, any> = {};
    const functions: Record<string, { argName: string, body: string }> = {};
    const output: string[] = [];

    let i = 0;
    while (i < lines.length) {
      let line = lines[i].trimEnd();
      if (!line.trim()) { i++; continue; }

      const defMatch = line.trim().match(/^def\s+([a-zA-Z_]\w*)\((.*)\):$/);
      if (defMatch) {
        const [, name, argName] = defMatch;
        let body = '';
        i++;
        while (i < lines.length && (lines[i].startsWith(' ') || lines[i].startsWith('\t') || !lines[i].trim())) {
          if (lines[i].trim()) body += lines[i].trim() + '\n';
          i++;
        }
        functions[name] = { argName: argName.trim(), body };
        continue;
      }

      const forMatch = line.trim().match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/);
      if (forMatch) {
        const [, loopVar, iterableStr] = forMatch;
        let items: any[] = [];
        const iterVal = evaluateExpression(iterableStr, variables, functions);
        if (Array.isArray(iterVal)) {
          items = iterVal;
        }

        let loopBody: string[] = [];
        i++;
        while (i < lines.length && (lines[i].startsWith(' ') || lines[i].startsWith('\t') || !lines[i].trim())) {
          if (lines[i].trim()) loopBody.push(lines[i].trim());
          i++;
        }
        
        for (const item of items) {
          const loopVars = { ...variables, [loopVar]: item };
          for (const bLine of loopBody) {
             executeLine(bLine, loopVars, functions, output);
          }
        }
        continue;
      }
      
      const dictForMatch = line.trim().match(/^for\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s+in\s+([a-zA-Z_]\w*)\.items\(\):$/);
      if (dictForMatch) {
        const [, keyVar, valVar, dictName] = dictForMatch;
        const dictVal = variables[dictName];
        
        let loopBody: string[] = [];
        i++;
        while (i < lines.length && (lines[i].startsWith(' ') || lines[i].startsWith('\t') || !lines[i].trim())) {
          if (lines[i].trim()) loopBody.push(lines[i].trim());
          i++;
        }
        
        if (dictVal && typeof dictVal === 'object') {
          for (const [k, v] of Object.entries(dictVal)) {
            const loopVars = { ...variables, [keyVar]: k, [valVar]: v };
            for (const bLine of loopBody) {
               executeLine(bLine, loopVars, functions, output);
            }
          }
        }
        continue;
      }

      executeLine(line.trim(), variables, functions, output);
      i++;
    }

    return output.join('\n');
  } catch (e) {
    return "Hmm... the Mind Flayer scrambled this code. Check your syntax and try again!";
  }
}

function executeLine(line: string, variables: any, functions: any, output: string[]) {
  const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
  if (assignMatch && !line.includes('==')) { 
    const [, name, valStr] = assignMatch;
    variables[name] = evaluateExpression(valStr, variables, functions);
    return;
  }

  if (line.startsWith('print(') && line.endsWith(')')) {
    const argsStr = line.slice(6, -1);
    const args = splitTopLevel(argsStr, ',');
    const res = args.map(a => {
       const val = evaluateExpression(a, variables, functions);
       if (typeof val === 'object' && val !== null) return JSON.stringify(val);
       return String(val);
    });
    output.push(res.join(' '));
    return;
  }
}

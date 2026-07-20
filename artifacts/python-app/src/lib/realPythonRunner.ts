type PyodideApi = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched?: (value: string) => void }) => void;
  setStderr: (options: { batched?: (value: string) => void }) => void;
  globals: {
    set: (key: string, value: unknown) => void;
    get: (key: string) => unknown;
  };
};

declare global {
  interface Window {
    loadPyodide?: (options: { indexURL: string }) => Promise<PyodideApi>;
  }
}

let pyodidePromise: Promise<PyodideApi> | null = null;

const ensurePyodide = async (): Promise<PyodideApi> => {
  if (typeof window === 'undefined') {
    throw new Error('Real Python runner is only available in the browser.');
  }

  const existingLoader = window.loadPyodide;
  if (existingLoader) {
    if (!pyodidePromise) {
      pyodidePromise = existingLoader({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
      });
    }

    return pyodidePromise;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector('script[data-pyodide-loader="true"]') as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Pyodide runtime script.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js';
    script.async = true;
    script.dataset.pyodideLoader = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Pyodide runtime script.'));
    document.head.appendChild(script);
  });

  const scriptLoader = window.loadPyodide;
  if (!scriptLoader) {
    throw new Error('Pyodide loader is unavailable after script load.');
  }

  if (!pyodidePromise) {
    pyodidePromise = scriptLoader({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/',
    });
  }

  if (!pyodidePromise) {
    throw new Error('Pyodide failed to initialize.');
  }

  return pyodidePromise;
};

export const runRealPythonMilestone = async (code: string, inputValues: string[] = []): Promise<string> => {
  const pyodide = await ensurePyodide();
  let capturedStdout = '';
  let capturedStderr = '';

  pyodide.setStdout({
    batched: (value) => {
      capturedStdout += value.endsWith('\n') ? value : `${value}\n`;
    },
  });

  pyodide.setStderr({
    batched: (value) => {
      capturedStderr += value.endsWith('\n') ? value : `${value}\n`;
    },
  });

  pyodide.globals.set('__copilot_user_code', code);
  pyodide.globals.set('__copilot_inputs', inputValues);

  await pyodide.runPythonAsync(`
import builtins
import traceback

__copilot_input_index = 0

def __copilot_input(prompt=''):
    global __copilot_input_index
    if __copilot_input_index < len(__copilot_inputs):
        value = __copilot_inputs[__copilot_input_index]
        __copilot_input_index += 1
        return str(value)
    return ''

builtins.input = __copilot_input

try:
    exec(__copilot_user_code, {})
except Exception:
    traceback.print_exc()
`);

  const output = `${capturedStdout}${capturedStderr}`.trim();
  return output || 'Program finished with no output.';
};

import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { useExecutionStore } from "../../store/executionStore";

export function CodeEditor() {
  const { code, setCode, steps, currentStepIndex } = useExecutionStore();
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    if (!monaco || !editorRef.current) return;

    const currentStep = steps[currentStepIndex];
    const line = currentStep?.line_number;

    if (line) {
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: new monaco.Range(line, 1, line, 1),
            options: {
              isWholeLine: true,
              className: 'bg-primary/20 border-l-4 border-primary',
            }
          }
        ]
      );
    } else {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [monaco, steps, currentStepIndex]);

  return (
    <Editor
      height="100%"
      defaultLanguage="python"
      theme="vs-dark"
      value={code}
      onChange={(val) => setCode(val || "")}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 1.5,
        fontFamily: "JetBrains Mono, Menlo, Monaco, 'Courier New', monospace",
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: "smooth",
        padding: { top: 16 },
      }}
    />
  );
}

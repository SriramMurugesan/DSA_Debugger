import { create } from 'zustand';
import type { ExecutionStep } from '../types/execution';
import { executionService } from '../services/executionService';

interface ExecutionStore {
  code: string;
  status: 'idle' | 'validating' | 'executing' | 'ready' | 'playing' | 'paused' | 'error';
  steps: ExecutionStep[];
  currentStepIndex: number;
  speed: number;
  error: string | null;
  testCallSnippet: string | null;

  setCode: (code: string) => void;
  setTestCallSnippet: (snippet: string | null) => void;
  executeCode: (mode?: 'run' | 'visualize') => Promise<void>;
  
  setSteps: (steps: ExecutionStep[]) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  clearExecution: () => void;
}

const DEFAULT_CODE = ``;

export const useExecutionStore = create<ExecutionStore>((set, get) => ({
  code: DEFAULT_CODE,
  status: 'idle',
  steps: [],
  currentStepIndex: 0,
  speed: 1,
  error: null,
  testCallSnippet: null,

  setCode: (code) => set({ code }),
  setTestCallSnippet: (snippet) => set({ testCallSnippet: snippet }),
  
  executeCode: async (mode: 'run' | 'visualize' = 'visualize') => {
    const { code } = get();
    if (!code.trim()) return;
    
    set({ status: 'executing', error: null, steps: [], currentStepIndex: 0 });
    try {
      const result = await executionService.runCode(code);
      if (result.status === 'error') {
        const errorMsg = result.error?.message || 'Execution failed.';
        if (result.steps && result.steps.length > 0) {
           set({ steps: result.steps, status: 'ready', error: errorMsg, currentStepIndex: 0 });
        } else {
           set({ status: 'error', error: errorMsg });
        }
      } else if (!result.steps || result.steps.length === 0) {
        set({ status: 'error', error: 'Produced no steps.' });
      } else {
        const finalIndex = mode === 'run' ? result.steps.length - 1 : 0;
        set({ steps: result.steps, status: 'ready', currentStepIndex: finalIndex });
      }
    } catch (err: any) {
      set({ status: 'error', error: err.response?.data?.error?.message || err.message || 'Unknown error' });
    }
  },

  setSteps: (steps) => set({ steps, status: 'ready', currentStepIndex: 0, error: null }),
  
  nextStep: () => {
    const { currentStepIndex, steps } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ status: 'ready' }); // Pause if at the end
    }
  },
  
  previousStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({ currentStepIndex: currentStepIndex - 1 });
    }
  },
  
  goToStep: (index) => set({ currentStepIndex: index }),
  play: () => set({ status: 'playing' }),
  pause: () => set({ status: 'paused' }),
  reset: () => set({ currentStepIndex: 0, status: 'ready' }),
  clearExecution: () => set({ steps: [], currentStepIndex: 0, status: 'idle', error: null })
}));


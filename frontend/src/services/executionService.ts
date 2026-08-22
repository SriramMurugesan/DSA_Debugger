import { apiClient } from '../utils/api';
import type { ExecutionStep } from '../types/execution';

export interface ExecutionResult {
  execution_id: string;
  status: string;
  steps: ExecutionStep[];
  error?: {
    message: string;
    type?: string;
  };
}

export const executionService = {
  /**
   * Sends the Python code to the backend for execution and tracing.
   * @param code The Python code string from the editor
   * @returns The normalized execution timeline
   */
  async runCode(code: string): Promise<ExecutionResult> {
    const response = await apiClient.post('/execution/run', {
      language: 'python',
      code
    });
    return response.data;
  }
};

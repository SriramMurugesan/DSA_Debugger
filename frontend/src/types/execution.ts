export interface ExecutionStep {
  step_id: number;
  line_number: number | null;
  event_type: string;
  variables: Record<string, any>;
  stdout: string[];
  call_stack: any[];
  memory: Record<string, any>;
  visualization_events: any[];
  timestamp?: number;
}

import { useEffect, useRef } from 'react';
import { useExecutionStore } from '../store/executionStore';

export function useExecutionPlayback() {
  const { status, nextStep, speed } = useExecutionStore();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (status === 'playing') {
      // Base speed is 1000ms per step, adjusted by speed multiplier
      const interval = 1000 / speed;
      
      timerRef.current = window.setInterval(() => {
        nextStep();
      }, interval);
    } else if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, speed, nextStep]);
}

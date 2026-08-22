import { useExecutionStore } from '../../store/executionStore'
import { EmptyState } from './EmptyState'
import { Array1DVisualizer } from './Array1D'
import { Array2DVisualizer } from './Array2D'
import { HashMapVisualizer } from './HashMap'
import { StackVisualizer } from './StackVisualizer'
import { QueueVisualizer } from './QueueVisualizer'
import { LinkedListVisualizer } from './LinkedListVisualizer'
import { DoublyLinkedListVisualizer } from './DoublyLinkedListVisualizer'
import { TreeVisualizer } from './TreeVisualizer'

export function VisualizationRouter() {
  const { steps, currentStepIndex } = useExecutionStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.variables || Object.keys(currentStep.variables).length === 0) {
    return <EmptyState />;
  }
  
  const pointers = Object.entries(currentStep.variables).map(([name, value]) => ({ name, value }));

  // Auto-detect variable types and map to visualizers
  const renderVisualizer = (key: string, value: any) => {
    const lowerKey = key.toLowerCase();
    
    // Custom Objects (Nodes)
    if (value && typeof value === 'object' && value.__type__) {
      const typeStr = value.__type__.toLowerCase();
      
      if (typeStr.includes('deque') || lowerKey.includes('queue') || lowerKey.includes('deque')) {
        return <QueueVisualizer key={key} name={key} data={value.values || []} />;
      }
      
      if (typeStr.includes('doubly') || typeStr.includes('dll') || lowerKey.includes('doubly') || lowerKey.includes('dll')) {
        return <DoublyLinkedListVisualizer key={key} name={key} data={value} pointers={pointers} />;
      }
      
      if (typeStr.includes('listnode') || typeStr.includes('node') && (value.next !== undefined) && value.left === undefined) {
         return <LinkedListVisualizer key={key} name={key} data={value} pointers={pointers} />;
      }
      
      if (typeStr.includes('treenode') || typeStr.includes('tree') || (value.left !== undefined || value.right !== undefined)) {
         return <TreeVisualizer key={key} name={key} data={value} pointers={pointers} />;
      }
    }
    
    // Arrays
    if (Array.isArray(value)) {
      if (value.length > 0 && Array.isArray(value[0])) {
        // 2D Array (DP / Matrix)
        return <Array2DVisualizer key={key} name={key} data={value} />;
      }
      
      // Stack
      if (lowerKey.includes('stack')) {
        return <StackVisualizer key={key} name={key} data={value} />;
      }
      
      // Queue/Deque fallback for normal array if name suggests queue
      if (lowerKey.includes('queue') || lowerKey.includes('deque')) {
        return <QueueVisualizer key={key} name={key} data={value} />;
      }
      
      // Normal 1D Array
      return <Array1DVisualizer key={key} name={key} data={value} pointers={pointers} />;
    }
    
    if (typeof value === 'string' && value.length > 0 && value.length < 50) {
      // String as 1D array of characters
      return <Array1DVisualizer key={key} name={key} data={value.split('')} pointers={pointers} />;
    }
    
    if (typeof value === 'object' && value !== null && !value.__circular_ref__ && !value.__type__) {
      // Hash Map / Object / Graph Adjacency representation
      return <HashMapVisualizer key={key} name={key} data={value} />;
    }
    
    return null;
  };

  const visualizers = Object.entries(currentStep.variables)
    .map(([key, val]) => renderVisualizer(key, val))
    .filter(Boolean);

  if (visualizers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col w-full max-h-full overflow-y-auto space-y-8 p-4">
      {visualizers}
    </div>
  );
}

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
import { GraphVisualizer } from './GraphVisualizer'
import { detectStructures, type NormalizedStructure } from '../../utils/structureDetector'

export function VisualizationRouter() {
  const { steps, currentStepIndex } = useExecutionStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.variables || Object.keys(currentStep.variables).length === 0) {
    return <EmptyState />;
  }

  // Detect structures globally for this step
  const { structures, simpleVariables } = detectStructures(currentStep.variables, currentStep.memory || {});

  const renderStructure = (struct: NormalizedStructure, index: number) => {
    switch (struct.type) {
      case 'linked-list':
        return <LinkedListVisualizer key={`struct-${index}`} structure={struct} />;
      case 'doubly-linked-list':
        return <DoublyLinkedListVisualizer key={`struct-${index}`} structure={struct} />;
      case 'binary-tree':
      case 'trie':
        return <TreeVisualizer key={`struct-${index}`} structure={struct} />;
      case 'graph':
        return <GraphVisualizer key={`struct-${index}`} structure={struct} simpleVariables={simpleVariables} />;
      case 'array':
        if (struct.data.length > 0 && Array.isArray(struct.data[0])) {
          return <Array2DVisualizer key={`struct-${index}`} name={Object.keys(struct.references).join(', ')} data={struct.data} />;
        }
        return <Array1DVisualizer key={`struct-${index}`} name={Object.keys(struct.references).join(', ')} data={struct.data} pointers={[]} />;
      case 'stack':
        return <StackVisualizer key={`struct-${index}`} name={Object.keys(struct.references).join(', ')} data={struct.data} />;
      case 'queue':
        return <QueueVisualizer key={`struct-${index}`} name={Object.keys(struct.references).join(', ')} data={struct.data} />;
      case 'object':
      case 'dict':
        return <HashMapVisualizer key={`struct-${index}`} name={Object.keys(struct.references).join(', ')} data={struct.data} />;
      default:
        return null;
    }
  };

  const visualizers = structures.map(renderStructure).filter(Boolean);

  // Render simple variables as a fallback if no structures exist, or just show them in the sidebar
  // (In a real debugger layout, simple variables go in the variables panel)
  
  if (visualizers.length === 0 && Object.keys(simpleVariables).length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden min-h-0">
      {/* Visualizers Area (Expanding) */}
      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden p-4 relative min-h-0">
        {visualizers.length > 0 ? (
          visualizers
        ) : (
          <div className="text-muted italic">No complex data structures to visualize.</div>
        )}
      </div>
    </div>
  );
}

import { memo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Student Enrollment' },
    position: { x: 50, y: 50 },
    style: { background: '#22c55e', color: 'white' }
  },
  {
    id: '2',
    data: { label: 'Student Profile Creation' },
    position: { x: 50, y: 150 },
    style: { background: '#3b82f6', color: 'white' }
  },
  {
    id: '3',
    data: { label: 'Academic Records Setup' },
    position: { x: 250, y: 150 },
    style: { background: '#8b5cf6', color: 'white' }
  },
  {
    id: '4',
    data: { label: 'Parent Portal Access' },
    position: { x: 450, y: 150 },
    style: { background: '#f59e0b', color: 'white' }
  },
  {
    id: '5',
    data: { label: 'Class Assignment' },
    position: { x: 250, y: 250 },
    style: { background: '#ef4444', color: 'white' }
  },
  {
    id: '6',
    data: { label: 'Progress Tracking' },
    position: { x: 250, y: 350 },
    style: { background: '#06b6d4', color: 'white' }
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Reports & Analytics' },
    position: { x: 250, y: 450 },
    style: { background: '#84cc16', color: 'white' }
  }
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e5-6', source: '5', target: '6', animated: true },
  { id: 'e6-7', source: '6', target: '7' }
];

export const StudentManagementWorkflow = memo(() => {
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
        <Controls showInteractive={false} />
        <MiniMap />
      </ReactFlow>
    </div>
  );
});

StudentManagementWorkflow.displayName = 'StudentManagementWorkflow';
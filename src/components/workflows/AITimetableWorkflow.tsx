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
    data: { label: 'Data Input (Teachers, Subjects, Rooms)' },
    position: { x: 50, y: 50 },
    style: { background: '#8b5cf6', color: 'white' }
  },
  {
    id: '2',
    data: { label: 'Constraint Analysis' },
    position: { x: 300, y: 50 },
    style: { background: '#3b82f6', color: 'white' }
  },
  {
    id: '3',
    data: { label: 'AI Processing & Optimization' },
    position: { x: 550, y: 50 },
    style: { background: '#6d28d9', color: 'white' }
  },
  {
    id: '4',
    data: { label: 'Conflict Detection' },
    position: { x: 300, y: 150 },
    style: { background: '#f59e0b', color: 'white' }
  },
  {
    id: '5',
    data: { label: 'Auto Resolution' },
    position: { x: 550, y: 150 },
    style: { background: '#ef4444', color: 'white' }
  },
  {
    id: '6',
    data: { label: 'Timetable Generation' },
    position: { x: 300, y: 250 },
    style: { background: '#10b981', color: 'white' }
  },
  {
    id: '7',
    data: { label: 'Quality Validation' },
    position: { x: 50, y: 250 },
    style: { background: '#06b6d4', color: 'white' }
  },
  {
    id: '8',
    type: 'output',
    data: { label: 'Final Timetable Export' },
    position: { x: 300, y: 350 },
    style: { background: '#84cc16', color: 'white' }
  }
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5', animated: true },
  { id: 'e5-6', source: '5', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e7-8', source: '7', target: '8', animated: true },
  { id: 'e3-6', source: '3', target: '6', type: 'smoothstep' }
];

export const AITimetableWorkflow = memo(() => {
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

AITimetableWorkflow.displayName = 'AITimetableWorkflow';
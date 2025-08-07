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
    data: { label: 'Fee Structure Setup' },
    position: { x: 50, y: 50 },
    style: { background: '#10b981', color: 'white' }
  },
  {
    id: '2',
    data: { label: 'Student Fee Assignment' },
    position: { x: 50, y: 150 },
    style: { background: '#3b82f6', color: 'white' }
  },
  {
    id: '3',
    data: { label: 'Invoice Generation' },
    position: { x: 250, y: 150 },
    style: { background: '#8b5cf6', color: 'white' }
  },
  {
    id: '4',
    data: { label: 'Payment Collection' },
    position: { x: 450, y: 150 },
    style: { background: '#f59e0b', color: 'white' }
  },
  {
    id: '5',
    data: { label: 'Payment Gateway Integration' },
    position: { x: 450, y: 250 },
    style: { background: '#ef4444', color: 'white' }
  },
  {
    id: '6',
    data: { label: 'Outstanding Tracking' },
    position: { x: 250, y: 250 },
    style: { background: '#06b6d4', color: 'white' }
  },
  {
    id: '7',
    data: { label: 'Reminders & Alerts' },
    position: { x: 50, y: 250 },
    style: { background: '#f97316', color: 'white' }
  },
  {
    id: '8',
    type: 'output',
    data: { label: 'Financial Reports' },
    position: { x: 250, y: 350 },
    style: { background: '#84cc16', color: 'white' }
  }
];

const edges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5', source: '4', target: '5' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e6-8', source: '6', target: '8', animated: true },
  { id: 'e5-8', source: '5', target: '8' }
];

export const FeeManagementWorkflow = memo(() => {
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

FeeManagementWorkflow.displayName = 'FeeManagementWorkflow';
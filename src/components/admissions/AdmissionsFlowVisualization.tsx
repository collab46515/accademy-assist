import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserPlus, 
  DollarSign, 
  FileCheck, 
  Eye, 
  Calendar, 
  CheckCircle, 
  CreditCard,
  GraduationCap,
  Award
} from 'lucide-react';

const createStageNode = (
  id: string, 
  label: string, 
  position: { x: number; y: number }, 
  icon: React.ElementType,
  color: string
): Node => ({
  id,
  type: 'default',
  position,
  data: { 
    label: (
      <div className="flex flex-col items-center gap-2 p-4">
        <div className={`p-3 rounded-full ${color}`}>
          {React.createElement(icon, { className: "h-6 w-6" })}
        </div>
        <div className="text-sm font-medium text-center whitespace-nowrap">
          {label}
        </div>
      </div>
    )
  },
  style: {
    background: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    width: 160,
    height: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const nodes: Node[] = [
  createStageNode('1', 'Application Submission', { x: 50, y: 50 }, UserPlus, 'bg-blue-100 text-blue-800'),
  createStageNode('2', 'Application Fee', { x: 280, y: 50 }, DollarSign, 'bg-yellow-100 text-yellow-800'),
  createStageNode('3', 'Enrollment Processing', { x: 510, y: 50 }, FileCheck, 'bg-purple-100 text-purple-800'),
  createStageNode('4', 'Detailed Review', { x: 740, y: 50 }, Eye, 'bg-amber-100 text-amber-800'),
  createStageNode('5', 'Assessment/Interview', { x: 970, y: 50 }, Calendar, 'bg-indigo-100 text-indigo-800'),
  createStageNode('6', 'Admission Decision', { x: 280, y: 220 }, CheckCircle, 'bg-green-100 text-green-800'),
  createStageNode('7', 'Deposit Payment', { x: 510, y: 220 }, CreditCard, 'bg-emerald-100 text-emerald-800'),
  createStageNode('8', 'Admission Confirmed', { x: 740, y: 220 }, Award, 'bg-green-200 text-green-900'),
  createStageNode('9', 'Class Allocation', { x: 970, y: 220 }, GraduationCap, 'bg-blue-200 text-blue-900'),
];

const edges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#3b82f6' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#3b82f6' },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#3b82f6' },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#3b82f6' },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#3b82f6' },
  },
  {
    id: 'e6-7',
    source: '6',
    target: '7',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#10b981' },
    label: 'If Approved',
    labelStyle: { fontSize: 12, fontWeight: 600 },
    labelBgStyle: { fill: '#f0fdf4', stroke: '#10b981' },
  },
  {
    id: 'e7-8',
    source: '7',
    target: '8',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#10b981' },
  },
  {
    id: 'e8-9',
    source: '8',
    target: '9',
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2, stroke: '#10b981' },
  },
];

export function AdmissionsFlowVisualization() {
  return (
    <Card className="h-[600px]">
      <CardHeader>
        <CardTitle className="text-center">End-to-End Admissions Process Flow</CardTitle>
        <p className="text-muted-foreground text-center">
          Complete workflow from initial application to class allocation
        </p>
      </CardHeader>
      <CardContent className="p-0 h-[500px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          style={{ backgroundColor: "#f8fafc" }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
        >
          <Background color="#e2e8f0" gap={16} />
          <Controls showInteractive={false} />
          <MiniMap 
            nodeColor={(node) => '#3b82f6'}
            maskColor="rgba(0, 0, 0, 0.1)"
            position="bottom-right"
          />
        </ReactFlow>
      </CardContent>
    </Card>
  );
}
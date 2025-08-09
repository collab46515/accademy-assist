import { memo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
} from "@xyflow/react";

const nodes: Node[] = [
  {
    id: "1",
    data: { label: "Daily Check-in" },
    position: { x: 250, y: 0 },
    style: {
      background: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "2",
    data: { label: "Attendance Marking" },
    position: { x: 250, y: 100 },
    style: {
      background: "hsl(var(--secondary))",
      color: "hsl(var(--secondary-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "3",
    data: { label: "Absence Detection" },
    position: { x: 100, y: 200 },
    style: {
      background: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "4",
    data: { label: "Late Arrival Log" },
    position: { x: 400, y: 200 },
    style: {
      background: "hsl(var(--muted))",
      color: "hsl(var(--muted-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "5",
    data: { label: "Alert Generation" },
    position: { x: 250, y: 300 },
    style: {
      background: "hsl(var(--accent))",
      color: "hsl(var(--accent-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "6",
    data: { label: "Parent Notification" },
    position: { x: 100, y: 400 },
    style: {
      background: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "7",
    data: { label: "School Admin Alert" },
    position: { x: 400, y: 400 },
    style: {
      background: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "8",
    data: { label: "Attendance Reports" },
    position: { x: 250, y: 500 },
    style: {
      background: "hsl(var(--secondary))",
      color: "hsl(var(--secondary-foreground))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      padding: "10px",
    },
  },
];

const edges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    animated: true,
  },
  {
    id: "e4-5",
    source: "4",
    target: "5",
  },
  {
    id: "e5-6",
    source: "5",
    target: "6",
    animated: true,
  },
  {
    id: "e5-7",
    source: "5",
    target: "7",
    animated: true,
  },
  {
    id: "e6-8",
    source: "6",
    target: "8",
  },
  {
    id: "e7-8",
    source: "7",
    target: "8",
  },
];

export const AttendanceTrackingWorkflow = memo(() => {
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
});

AttendanceTrackingWorkflow.displayName = "AttendanceTrackingWorkflow";
import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { nodeTypes } from "@/lib/node-types";
import { useTheme } from "next-themes";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "./ui/badge";
import { Loader, Wifi, WifiOff } from "lucide-react";
import { useConnectionQuality } from "./streaming-avatar/useConnectionQuality";
import { useStreamingAvatarSession } from "./streaming-avatar/useStreamingAvatarSession";
import { StreamingAvatarSessionState } from "./streaming-avatar/interfaces";
import { useConversationState } from "./streaming-avatar/useConversationState";
import { useStreamingAvatarContext } from "./streaming-avatar/streamingAvatarContext";

const nodeDefaults = {
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
};

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "KIRA" },
    ...nodeDefaults,
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    data: { label: "Detect Intent" },
    ...nodeDefaults,
  },
  {
    id: "3",
    position: { x: -100, y: 200 },
    data: { label: "Conversational Agent" },
    ...nodeDefaults,
  },
  {
    id: "4",
    type: "reActNode",
    position: { x: 100, y: 200 },
    data: { label: "ReAct Agent" },
    ...nodeDefaults,
  },
  {
    id: "5",
    position: { x: 0, y: 300 },
    data: { label: "Answer" },
    ...nodeDefaults,
  },
  // Tools nodes
  {
    id: "T",
    type: "group",
    data: { label: "Tools" },
    position: { x: 250, y: 150 },
    style: {
      width: 170,
      height: 140,
    },
  },
  {
    id: "T1",
    parentId: "T",
    type: "output",
    position: { x: 10, y: 10 },
    data: { label: "get_user" },
    targetPosition: Position.Left,
  },
  {
    id: "T2",
    parentId: "T",
    type: "output",
    position: { x: 10, y: 55 },
    data: { label: "get_transactions" },
    targetPosition: Position.Left,
  },
];

const initialEdges = [
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
    animated: true,
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    label: "Use tools",
    animated: true,
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
    animated: true,
  },
  //   Tools connections
  {
    id: "e4-t1",
    source: "4",
    target: "T1",
    sourceHandle: "tools",
    animated: true,
  },
  {
    id: "e4-t2",
    source: "4",
    target: "T2",
    sourceHandle: "tools",
    animated: true,
  },
];

export default function ReasoningView() {
  const { theme } = useTheme();
  const { sessionState } = useStreamingAvatarContext();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const updateNodeLabel = useCallback(
    (nodeId: string, label: string) => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                label,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const updateEdge = useCallback(
    (edgeId: string, animated: boolean) => {
      setNodes((prev) =>
        prev.map((edge) => {
          if (edge.id === edgeId) {
            return {
              ...edge,
              animated: animated,
            };
          }
          return edge;
        })
      );
    },
    [setEdges]
  );

  const getConnectionState = () => {
    switch (sessionState) {
      case StreamingAvatarSessionState.CONNECTED:
        return (
          <Badge variant="default" className="bg-green-500 text-white ">
            <Wifi />
            Conectado
          </Badge>
        );
      case StreamingAvatarSessionState.CONNECTING:
        return (
          <Badge variant="default" className="bg-blue-500 text-white ">
            <Loader className="animate-spin" />
            Conectando...
          </Badge>
        );
      case StreamingAvatarSessionState.INACTIVE:
        return (
          <Badge variant="secondary" className=" text-white ">
            <WifiOff />
            Inactivo
          </Badge>
        );
      default:
        return "Esperando";
    }
  };

  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    []
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        className="rounded-l-lg"
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={theme ?? "dark"}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-left">{getConnectionState()}</Panel>
        <Panel position="top-right">
          <ModeToggle />
        </Panel>
      </ReactFlow>
    </div>
  );
}

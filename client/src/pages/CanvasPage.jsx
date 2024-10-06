import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { PlusCircle } from "lucide-react";
import { Handle } from "reactflow";
import Toolbar from "../components/Toolbar";

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "Main Idea" },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
];
const buttonPushed = [0];

const initialEdges = [];

function CustomNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    data.onLabelChange(id, label);
  };

  const handleInputChange = (event) => {
    setLabel(event.target.value);
  };

  return (
    <div
      className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400"
      style={{ width: "250px", height: "auto" }} // Ensure fixed width for the node
    >
      <div className="flex items-center">
        <div className="ml-2 w-full">
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="bg-white border-2 border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              style={{ width: "100%" }} // Ensure the input field has a fixed width
              autoFocus
            />
          ) : (
            <div
              className="text-lg font-bold w-full cursor-pointer"
              onDoubleClick={handleDoubleClick}
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }} // Prevent content overflo
            >
              {label}
            </div>
          )}
        </div>
        <button
          className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            buttonPushed.push(0)
            data.onAddChild(id)}}
          aria-label="Add connected node"
        >
          <PlusCircle className="w-5 h-5 text-blue-500" />
        </button>
        <button
          className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            buttonPushed.push(1)
            data.onAddChild(id)}}
          aria-label="Add connected node"
        >
          <PlusCircle className="w-5 h-5 text-blue-500" />
        </button>
        <button
          className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            buttonPushed.push(2)
            data.onAddChild(id)}}
          aria-label="Add connected node"
        >
          <PlusCircle className="w-5 h-5 text-blue-500" />
        </button>
        <button
          className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => {
            buttonPushed.push(3)
            data.onAddChild(id)}}
          aria-label="Add connected node"
        >
          <PlusCircle className="w-5 h-5 text-blue-500" />
        </button>
      </div>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export default function CanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => {
      console.log("Connecting:", params);
      setEdges((eds) =>
        addEdge({ ...params }, eds)
      );
    },
    [setEdges]
  );

  const addChildNode = useCallback(
    (parentId) => {
      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) return;

      const newNodeId = (nodes.length + 1).toString();
      const childNodeCount = edges.filter(
        (edge) => edge.source === parentId
      ).length;

      const nodeSpacingX = 300; // Horizontal spacing for new nodes
      const baseNodeSpacingY = 100; // Base vertical spacing for nodes

      let newNodePosition;

      if (childNodeCount === 0 && buttonPushed.at(buttonPushed.length -1) === 0) {
        // First child node, place directly to the right
        newNodePosition = {
          x: parentNode.position.x + nodeSpacingX + 50,
          y: parentNode.position.y, // Same Y-axis as parent
        };
      } else if(childNodeCount === 0 && buttonPushed.at(buttonPushed.length-1)===1) {
          newNodePosition = {
            x: parentNode.position.x,
            y: parentNode.position.y - 100,
          }
      } else if(childNodeCount === 0 && buttonPushed.at(buttonPushed.length-1)===2) {
        newNodePosition = {
          x: parentNode.position.x,
          y: parentNode.position.y + 100,
        }
    } else if(childNodeCount === 0 && buttonPushed.at(buttonPushed.length-1)===3) {
      newNodePosition = {
        x: parentNode.position.x - nodeSpacingX - 50,
        y: parentNode.position.y,
      }
  }else {
        // For additional child nodes, calculate a larger yOffset
        const direction = childNodeCount % 2 === 0 ? -1 : 1; // Alternate between top (-1) and bottom (1)
        const yOffset =
          direction * baseNodeSpacingY * Math.floor((childNodeCount + 1) / 2);
        newNodePosition = {
          x: parentNode.position.x + nodeSpacingX + 50, // Always position to the right
          y: parentNode.position.y + yOffset, // Larger top or bottom based on count
        };
      }

      const newNode = {
        id: newNodeId,
        type: "custom",
        data: { label: `Node ${newNodeId}` },
        position: newNodePosition,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };

      const newEdge = {
        id: `e${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
      };

      // Update the state with the new node and edge
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
    },
    [nodes, edges, setNodes, setEdges]
  );

  const onLabelChange = useCallback(
    (nodeId, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    },
    [setNodes]
  );

  const handleAddNode = () => {
    const newNodeId = (nodes.length + 1).toString();
    const newNode = {
      id: newNodeId,
      type: "custom",
      data: { label: `Node ${newNodeId}` },
      position: {
        x: Math.random() * window.innerWidth - 100,
        y: Math.random() * window.innerHeight - 100,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const handleDeleteNode = () => {
    console.log("Delete node functionality not implemented");
  };

  const handleSave = () => {
    console.log("Save functionality not implemented");
  };

  const handleExport = () => {
    console.log("Export functionality not implemented");
  };

  return (
    <div className="w-full h-screen">
      <Toolbar
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onSave={handleSave}
        onExport={handleExport}
      />

      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          data: { ...node.data, onAddChild: addChildNode, onLabelChange },
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

import React, { useState, useCallback, useEffect } from "react";
import { toPng } from "html-to-image";
import { useParams } from "react-router-dom";
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
import { getFlowchartById,
  createFlowchart,
  updateFlowChartbyId
} from "../api/flowcharts"; 
import SaveModal from "../components/SaveModal";

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "Main Idea" },
    position: { x: 0, y: 0 },
  },
];

const initialEdges = [];
const buttonPressed = [];

function CustomNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [showButtons, setShowButtons] = useState(false); // State to show/hide buttons

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

  const handleClick = () => {
    setShowButtons(!showButtons); // Toggle buttons visibility
  };

  return (
    <div
      className="relative px-6 py-3 shadow-lg rounded-lg bg-white/95 border-2 border-black 
  hover:border-black transition-all duration-200 backdrop-blur-sm"
      style={{ width: "150px", minHeight: "40px" }}
      onClick={handleClick}
    >
      <div className="flex items-center">
        <div className="ml-2 w-full">
          {isEditing ? (
            <input
              type="text"
              value={label}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="w-full px-3 py-2 bg-white/50 border-1 border-black rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
  transition-all duration-200"
              autoFocus
            />
          ) : (
            <div
              className="text-lg font-semibold text-gray-700 w-full cursor-pointer 
  transition-colors duration-200 hover:text-blue-600 truncate"
              onDoubleClick={handleDoubleClick}
            >
              {label}
            </div>
          )}
        </div>
      </div>

      {/* Conditional rendering of buttons */}
      {showButtons && (
        <>
          <button
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 p-2 
  rounded-full bg-white/90 hover:bg-blue-50 shadow-md transition-all 
  duration-200 hover:scale-110 focus:outline-none group"
            onClick={() => {
              buttonPressed.push("top");
              data.onAddChild(id);
            }}
            aria-label="Add connected node top"
          >
            <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
          </button>
          <button
            className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-white/90 hover:bg-blue-50 shadow-md transition-all 
  duration-200 hover:scale-110 focus:outline-none group"
            onClick={() => {
              buttonPressed.push("bottom");
              data.onAddChild(id);
            }}
            aria-label="Add connected node bottom"
          >
      <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2  p-2 rounded-full bg-white/90 hover:bg-blue-50 shadow-md transition-all "
            onClick={() => {
              buttonPressed.push("right");
              data.onAddChild(id);
            }}
            aria-label="Add connected node right"
          >
             <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
          </button>
          <button
            className="absolute -left-7 top-1/2 transform -translate-y-1/2   duration-200 hover:scale-110 focus:outline-none group"
            onClick={() => {
              buttonPressed.push("left");
              data.onAddChild(id);
            }}
            aria-label="Add connected node left"
          >
             <PlusCircle className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
          </button>
        </>
      )}

      <Handle id="right" type="source" position={Position.Right} />
      <Handle id="right" type="target" position={Position.Right} />

      <Handle id="left" type="target" position={Position.Left} />
      <Handle id="left" type="source" position={Position.Left} />

      <Handle id="top" type="target" position={Position.Top} />
      <Handle id="top" type="source" position={Position.Top} />

      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="bottom" type="target" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

export default function CanvasPage() {
  const { id } = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [title, setTitle] = useState('New FlowChart');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params }, eds));
    },
    [setEdges]
  );

  const addChildNode = useCallback(
    (parentId) => {
      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) return;

      const newNodeId = (nodes.length + 1).toString();
      const nodeSpacingX = 300; // Horizontal spacing for new nodes
      const baseNodeSpacingY = 200; // Vertical spacing for nodes

      const direction = buttonPressed.pop();
      let newNodePosition;
      let sourcePosition = Position.Right; // Default for the new node
      let targetPosition = Position.Left; // Default for the parent node
      let sourceHandle = "right"; // Default source handle
      let targetHandle = "left"; // Default target handle

      // Adjust the position and handles based on the direction
      if (direction === "top") {
        newNodePosition = {
          x: parentNode.position.x,
          y: parentNode.position.y - baseNodeSpacingY,
        };
        sourcePosition = Position.Bottom;
        targetPosition = Position.Top;
        sourceHandle = "top";
        targetHandle = "bottom";
      } else if (direction === "bottom") {
        newNodePosition = {
          x: parentNode.position.x,
          y: parentNode.position.y + baseNodeSpacingY,
        };
        sourcePosition = Position.Top;
        targetPosition = Position.Bottom;
        sourceHandle = "bottom";
        targetHandle = "top";
      } else if (direction === "left") {
        newNodePosition = {
          x: parentNode.position.x - nodeSpacingX,
          y: parentNode.position.y,
        };
        sourcePosition = Position.Right;
        targetPosition = Position.Left;
        sourceHandle = "left";
        targetHandle = "right";
      } else {
        // Default is right
        newNodePosition = {
          x: parentNode.position.x + nodeSpacingX,
          y: parentNode.position.y,
        };
        sourcePosition = Position.Left;
        targetPosition = Position.Right;
        sourceHandle = "right";
        targetHandle = "left";
      }

      const newNode = {
        id: newNodeId,
        type: "custom",
        data: { label: `Node ${newNodeId}` },
        position: newNodePosition,
        sourcePosition,
        targetPosition,
      };

      const newEdge = {
        id: `e${parentId}-${newNodeId}`,
        source: parentId,
        target: newNodeId,
        sourceHandle,
        targetHandle,
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
    },
    [nodes, edges, setNodes, setEdges]
  );

  // Function to download the current graph as a png image
  const onExport = useCallback(() => {
    const reactFlowWrapper = document.getElementById("reactflow-wrapper");

    if (reactFlowWrapper) {
      toPng(reactFlowWrapper)
        .then((dataUrl) => {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = "graph.png";
          a.click();
        })
        .catch((error) => {
          console.error("Error exporting image:", error);
        });
    } else {
      console.error("React Flow wrapper not found!");
    }
  }, []);

  // Function to delete any node / edge which is selected
  const onDelete = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);

    if (selectedNodes.length > 0) {
      setNodes((nds) => nds.filter((node) => !node.selected));
    }

    if (selectedEdges.length > 0) {
      setEdges((eds) => eds.filter((edge) => !edge.selected));
    }
  }, [nodes, edges, setNodes, setEdges]);

  // Function to add new node on clicking the add node button
  const onAddNode = useCallback(() => {
    const newNodeId = (nodes.length + 1).toString();
    const newNode = {
      id: newNodeId,
      type: "custom",
      data: { label: `Node ${newNodeId}` },
      position: { x: 0, y: 0 },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [nodes, setNodes]);

  // Function to save the current graph to local storage
  const onSave = useCallback(() => {
    setIsModalOpen(true);
  })

  const onSaveInternal = useCallback(
    async (newTitle, nodes, edges) => {
    try {
      if (id==='new') {
        await createFlowchart({title: newTitle, nodes, edges});
        alert("Flowchart created successfully!");
      } else {
        await updateFlowChartbyId(id, { title: newTitle, nodes, edges });
        alert("Flowchart updated successfully!");
      }
    } catch (error) {
        console.error("Error saving flowchart:", error);
        alert("Failed to save the flowchart.");
    }

  }, [id]);

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

  useEffect(() => {
    const fetchFlowchart = async () => {
      try {
        setLoading(true);
        setError(null);

        if(id==="new") {
          setTitle('New Flowchart')
        } else {

          const { nodes: fetchedNodes, edges: fetchedEdges, title: flowChartTitle } = await getFlowchartById(id);
          setNodes(fetchedNodes);
          setEdges(fetchedEdges);
          setTitle(flowChartTitle);
        }
      } catch (err) {
        setError("Failed to load flowchart.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlowchart();
  }, [id, setNodes, setEdges]);


  return (
    <div
      id="reactflow-wrapper"
      className="w-full h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50"
    >
      <Toolbar
        onDelete={onDelete}
        onAddNode={onAddNode}
        onSave={onSave}
        onExport={onExport}
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
        className="bg-gray-50"
      >
        <Background className="opacity-10" color="#93c5fd" gap={20} size={1} />
        <Controls className="bg-white/90 shadow-lg rounded-lg border border-blue-100" />{" "}
      </ReactFlow>
      <SaveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        nodes={nodes}
        edges={edges}
        onSave={onSaveInternal}
      />
    </div>
  );
}

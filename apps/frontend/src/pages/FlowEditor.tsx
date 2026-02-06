import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { StartNode, LLMNode, RAGNode, ConditionNode, ToolNode, EndNode } from '../components/flow/nodes';
import { NodePalette } from '../components/flow/NodePalette';
import { NodeConfigPanel } from '../components/flow/NodeConfigPanel';
import { FlowToolbar } from '../components/flow/FlowToolbar';
import { DebugPanel } from '../components/flow/DebugPanel';
import { TestRunModal } from '../components/flow/TestRunModal';
import { workflowsApi } from '../lib/api';
import {
  transformToBackendFormat,
  transformFromBackendFormat,
  validateWorkflow,
  generateNodeId,
} from '../lib/flowUtils';

const nodeTypes = {
  start: StartNode,
  llm: LLMNode,
  rag: RAGNode,
  condition: ConditionNode,
  tool: ToolNode,
  end: EndNode,
};

export default function FlowEditor() {
  const { id: workflowId } = useParams();
  const navigate = useNavigate();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isSaving, setIsSaving] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [debugState, setDebugState] = useState<any>(null);

  // Load workflow if editing
  useEffect(() => {
    if (workflowId) {
      loadWorkflow(workflowId);
    }
  }, [workflowId]);

  // Update node styles based on debug state
  useEffect(() => {
    if (!debugState || !showDebugPanel) {
      // Reset node styles when not in debug mode
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            opacity: 1,
            border: undefined,
          },
        }))
      );
      return;
    }

    const { results, currentNodeId, status } = debugState;
    const executedNodeIds = new Set(results?.map((r: any) => r.nodeId) || []);

    setNodes((nds) =>
      nds.map((node) => {
        let style = { ...node.style };

        // If workflow is completed, highlight End node and dim all others
        if (status === 'completed') {
          if (node.type === 'end') {
            style.boxShadow = '0 0 0 3px #10b981';
            style.borderRadius = '0.5rem';
            style.opacity = 1;
          } else {
            style.opacity = 0.5;
            style.boxShadow = undefined;
          }
        }
        // Highlight current node (the one being executed next or just executed)
        else if (node.id === currentNodeId) {
          style.boxShadow = '0 0 0 3px #10b981';
          style.borderRadius = '0.5rem';
          style.opacity = 1;
        }
        // Dim executed nodes
        else if (executedNodeIds.has(node.id)) {
          style.opacity = 0.5;
          style.boxShadow = undefined;
        }
        // Future nodes normal
        else {
          style.opacity = 1;
          style.boxShadow = undefined;
        }

        return {
          ...node,
          style,
        };
      })
    );
  }, [debugState, showDebugPanel, setNodes]);

  const loadWorkflow = async (id: string) => {
    try {
      const { data } = await workflowsApi.getOne(id);
      const { nodes: loadedNodes, edges: loadedEdges } = transformFromBackendFormat(data);
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      setWorkflowName(data.name);
    } catch (error) {
      console.error('Failed to load workflow:', error);
      alert('Failed to load workflow');
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onAddNode = useCallback(
    (template: any) => {
      const id = generateNodeId(template.type);

      // Calculate position (center of viewport or below last node)
      const lastNode = nodes[nodes.length - 1];
      const position = lastNode
        ? { x: lastNode.position.x, y: lastNode.position.y + 150 }
        : { x: 250, y: 100 };

      const newNode: Node = {
        id,
        type: template.type,
        position,
        data: {
          label: template.label,
          type: template.type,
          config: { ...template.config },
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [nodes, setNodes]
  );

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onUpdateNode = useCallback(
    (nodeId: string, updates: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: updates,
              }
            : node
        )
      );

      // Update selected node reference
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) =>
          prev ? { ...prev, data: updates } : null
        );
      }
    },
    [setNodes, selectedNode]
  );

  const handleSave = async () => {
    // Validate workflow
    const errors = validateWorkflow(nodes, edges);
    if (errors.length > 0) {
      alert('Workflow validation failed:\n\n' + errors.join('\n'));
      return;
    }

    setIsSaving(true);
    try {
      const workflowData = {
        name: workflowName,
        ...transformToBackendFormat(nodes, edges),
        version: 'draft',
      };

      if (workflowId) {
        // Update existing
        await workflowsApi.update(workflowId, workflowData);
        alert('Workflow saved successfully!');
      } else {
        // Create new
        const { data } = await workflowsApi.create(workflowData);
        alert('Workflow created successfully!');
        navigate(`/editor/${data._id}`);
      }
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!workflowId) {
      alert('Please save the workflow first before publishing');
      return;
    }

    // Validate workflow
    const errors = validateWorkflow(nodes, edges);
    if (errors.length > 0) {
      alert('Cannot publish. Workflow validation failed:\n\n' + errors.join('\n'));
      return;
    }

    try {
      // Save current changes first
      await handleSave();

      // Then publish
      await workflowsApi.publish(workflowId);
      alert('Workflow published successfully!');
    } catch (error) {
      console.error('Failed to publish workflow:', error);
      alert('Failed to publish workflow');
    }
  };

  const handleTest = () => {
    const errors = validateWorkflow(nodes, edges);
    if (errors.length > 0) {
      alert('Cannot test. Workflow validation failed:\n\n' + errors.join('\n'));
      return;
    }

    setShowTestModal(true);
  };

  const handleDebug = () => {
    const errors = validateWorkflow(nodes, edges);
    if (errors.length > 0) {
      alert('Cannot debug. Workflow validation failed:\n\n' + errors.join('\n'));
      return;
    }

    setShowDebugPanel(true);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="text-2xl font-bold text-gray-900 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
            placeholder="Workflow Name"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative">
        {/* Node Palette */}
        <NodePalette onAddNode={onAddNode} />

        {/* Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gray-50"
            connectionLineType="smoothstep"
            connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: false,
              style: { stroke: '#3b82f6', strokeWidth: 2 },
            }}
          >
            <Background />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const colors: Record<string, string> = {
                  llm: '#3b82f6',
                  rag: '#a855f7',
                  condition: '#eab308',
                  tool: '#22c55e',
                  end: '#6b7280',
                };
                return colors[node.type || 'default'] || '#6b7280';
              }}
            />
          </ReactFlow>

          <FlowToolbar
            onSave={handleSave}
            onPublish={handlePublish}
            onTest={handleTest}
            onDebug={handleDebug}
            isSaving={isSaving}
          />
        </div>

        {/* Config Panel */}
        {selectedNode && !showDebugPanel && (
          <NodeConfigPanel
            node={selectedNode}
            onUpdateNode={onUpdateNode}
            onClose={() => setSelectedNode(null)}
          />
        )}

        {/* Debug Panel */}
        {showDebugPanel && workflowId && (
          <DebugPanel
            workflowId={workflowId}
            onClose={() => {
              setShowDebugPanel(false);
              setDebugState(null);
            }}
            onStateChange={setDebugState}
          />
        )}
      </div>

      {/* Test Modal */}
      {showTestModal && workflowId && (
        <TestRunModal
          workflowId={workflowId}
          onClose={() => setShowTestModal(false)}
        />
      )}
    </div>
  );
}

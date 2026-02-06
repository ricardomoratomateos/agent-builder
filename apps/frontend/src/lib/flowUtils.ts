import { Node, Edge } from '@xyflow/react';

// Transform React Flow nodes/edges to backend format
export const transformToBackendFormat = (nodes: Node[], edges: Edge[]) => {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      name: node.data.label,
      type: node.data.type,
      config: node.data.config,
      position: node.position,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };
};

// Transform backend format to React Flow nodes/edges
export const transformFromBackendFormat = (workflow: any): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = (workflow.nodes || []).map((node: any) => ({
    id: node.id,
    type: node.type,
    position: node.position || { x: 0, y: 0 },
    data: {
      label: node.name,
      type: node.type,
      config: node.config || {},
    },
  }));

  const edges: Edge[] = (workflow.edges || []).map((edge: any) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle,
    targetHandle: edge.targetHandle,
  }));

  return { nodes, edges };
};

// Validate workflow before saving
export const validateWorkflow = (nodes: Node[], edges: Edge[]): string[] => {
  const errors: string[] = [];

  if (nodes.length === 0) {
    errors.push('Workflow must have at least one node');
    return errors;
  }

  // Check for Start node
  const startNodes = nodes.filter((node) => node.data.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Workflow must have a Start node');
  } else if (startNodes.length > 1) {
    errors.push('Workflow can only have one Start node');
  }

  // Check for End node
  const endNodes = nodes.filter((node) => node.data.type === 'end');
  if (endNodes.length === 0) {
    errors.push('Workflow must have an End node');
  }

  // Check for disconnected nodes (except Start and End nodes)
  const connectedNodeIds = new Set<string>();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  nodes.forEach((node) => {
    if (node.data.type !== 'start' && node.data.type !== 'end' && !connectedNodeIds.has(node.id)) {
      errors.push(`Node "${node.data.label}" is not connected`);
    }
  });

  // Check for missing required config
  nodes.forEach((node) => {
    const { type, config, label } = node.data;

    if (!label || label.trim() === '') {
      errors.push(`Node ${node.id} is missing a label`);
    }

    switch (type) {
      case 'llm':
        if (!config?.model) {
          errors.push(`LLM node "${label}" is missing model configuration`);
        }
        if (!config?.prompt || config.prompt.trim() === '') {
          errors.push(`LLM node "${label}" is missing prompt`);
        }
        break;

      case 'rag':
        if (!config?.collection || config.collection.trim() === '') {
          errors.push(`RAG node "${label}" is missing collection name`);
        }
        break;

      case 'condition':
        if (!config?.condition || config.condition.trim() === '') {
          errors.push(`Condition node "${label}" is missing condition expression`);
        }
        break;

      case 'tool':
        if (!config?.toolName || config.toolName.trim() === '') {
          errors.push(`Tool node "${label}" is missing tool name`);
        }
        break;
    }
  });

  return errors;
};

// Generate unique node ID
export const generateNodeId = (type: string): string => {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

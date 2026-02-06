import { FC } from 'react';

interface NodeTemplate {
  type: string;
  label: string;
  icon: string;
  config: any;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'start',
    label: 'Start',
    icon: '🚀',
    config: {},
  },
  {
    type: 'llm',
    label: 'LLM',
    icon: '🤖',
    config: {
      model: 'gpt-5-nano',
      temperature: 0.7,
      prompt: '',
    },
  },
  {
    type: 'rag',
    label: 'RAG',
    icon: '🔍',
    config: {
      collection: '',
      topK: 5,
      scoreThreshold: 0.7,
    },
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: '🔀',
    config: {
      condition: '',
    },
  },
  {
    type: 'tool',
    label: 'Tool',
    icon: '🛠️',
    config: {
      toolName: '',
      parameters: {},
    },
  },
  {
    type: 'end',
    label: 'End',
    icon: '🏁',
    config: {},
  },
];

interface NodePaletteProps {
  onAddNode: (template: NodeTemplate) => void;
}

export const NodePalette: FC<NodePaletteProps> = ({ onAddNode }) => {
  return (
    <div className="w-64 bg-white border-r p-4 space-y-2 overflow-y-auto">
      <h3 className="font-bold mb-4 text-gray-900">Add Nodes</h3>
      {nodeTemplates.map((template) => (
        <button
          key={template.type}
          onClick={() => onAddNode(template)}
          className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition"
        >
          <span className="text-2xl">{template.icon}</span>
          <span className="text-sm font-medium">{template.label}</span>
        </button>
      ))}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-bold text-gray-500 mb-2">TIPS</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click a node to configure it</li>
          <li>• Drag to connect nodes</li>
          <li>• Delete with Backspace</li>
        </ul>
      </div>
    </div>
  );
};

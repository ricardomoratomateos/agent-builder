import { FC } from 'react';
import { Node } from '@xyflow/react';

interface NodeConfigPanelProps {
  node: Node | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onClose: () => void;
}

export const NodeConfigPanel: FC<NodeConfigPanelProps> = ({
  node,
  onUpdateNode,
  onClose,
}) => {
  if (!node) return null;

  const updateConfig = (key: string, value: any) => {
    onUpdateNode(node.id, {
      ...node.data,
      config: {
        ...node.data.config,
        [key]: value,
      },
    });
  };

  const updateLabel = (label: string) => {
    onUpdateNode(node.id, {
      ...node.data,
      label,
    });
  };

  const renderConfigFields = () => {
    switch (node.data.type) {
      case 'start':
        return (
          <div className="text-sm text-gray-500">
            Start node marks the beginning of the workflow. The input will be provided when executing the workflow.
          </div>
        );

      case 'llm':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                value={node.data.config?.model || ''}
                onChange={(e) => updateConfig('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <optgroup label="🔥 Económicos (2026)">
                  <option value="gpt-5-nano">GPT-5 Nano ($0.05/$0.40)</option>
                  <option value="gpt-4o-mini">GPT-4o Mini ($0.15/$0.60)</option>
                  <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku ($1/$5)</option>
                </optgroup>

                <optgroup label="⚡ Balanceado (Calidad/Precio)">
                  <option value="gpt-4o">GPT-4o ($2.5/$10)</option>
                  <option value="claude-sonnet-4-5">Claude Sonnet 4.5 ($3/$15)</option>
                </optgroup>

                <optgroup label="🚀 Premium (Máxima Calidad)">
                  <option value="claude-opus-4-5">Claude Opus 4.5 ($5/$25)</option>
                  <option value="claude-opus-4-6">Claude Opus 4.6 ($5/$25)</option>
                </optgroup>

                <optgroup label="📦 Modelos Legacy">
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature
              </label>
              <input
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={node.data.config?.temperature || 0.7}
                onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prompt
              </label>
              <textarea
                value={node.data.config?.prompt || ''}
                onChange={(e) => updateConfig('prompt', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter system prompt..."
              />
            </div>
          </>
        );

      case 'rag':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection Name
              </label>
              <input
                type="text"
                value={node.data.config?.collection || ''}
                onChange={(e) => updateConfig('collection', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="my-collection"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Top K Results
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={node.data.config?.topK || 5}
                onChange={(e) => updateConfig('topK', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Score Threshold
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={node.data.config?.scoreThreshold || 0.7}
                onChange={(e) => updateConfig('scoreThreshold', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        );

      case 'condition':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Expression
              </label>
              <input
                type="text"
                value={node.data.config?.condition || ''}
                onChange={(e) => updateConfig('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="input.score > 0.8"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: input.score {'>'} 0.8
              </p>
            </div>
          </>
        );

      case 'tool':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tool Name
              </label>
              <input
                type="text"
                value={node.data.config?.toolName || ''}
                onChange={(e) => updateConfig('toolName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="calculator"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parameters (JSON)
              </label>
              <textarea
                value={JSON.stringify(node.data.config?.parameters || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateConfig('parameters', parsed);
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder='{"key": "value"}'
              />
            </div>
          </>
        );

      case 'end':
        return (
          <div className="text-sm text-gray-500">
            End node has no configuration options.
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Node Config</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Label
          </label>
          <input
            type="text"
            value={node.data.label || ''}
            onChange={(e) => updateLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter node label"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Node Type
          </label>
          <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600">
            {node.data.type}
          </div>
        </div>

        {renderConfigFields()}
      </div>
    </div>
  );
};

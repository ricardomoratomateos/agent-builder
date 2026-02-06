import { FC } from 'react';
import { NodeWrapper } from './NodeWrapper';

interface ToolNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    config: {
      toolName?: string;
      parameters?: Record<string, any>;
    };
  };
  selected?: boolean;
}

export const ToolNode: FC<ToolNodeProps> = ({ id, data, selected }) => {
  const { toolName, parameters } = data.config || {};

  return (
    <NodeWrapper selected={selected} color="green">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🛠️</span>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        {toolName && (
          <div className="text-xs text-gray-600">
            Tool: {toolName}
          </div>
        )}

        {parameters && Object.keys(parameters).length > 0 && (
          <div className="text-xs text-gray-500">
            {Object.keys(parameters).length} param(s)
          </div>
        )}
      </div>
    </NodeWrapper>
  );
};

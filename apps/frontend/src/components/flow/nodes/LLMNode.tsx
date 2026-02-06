import { FC } from 'react';
import { NodeWrapper } from './NodeWrapper';

interface LLMNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    config: {
      model?: string;
      temperature?: number;
      prompt?: string;
    };
  };
  selected?: boolean;
}

export const LLMNode: FC<LLMNodeProps> = ({ id, data, selected }) => {
  const { model, temperature, prompt } = data.config || {};

  return (
    <NodeWrapper selected={selected} color="blue">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🤖</span>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        {model && (
          <div className="text-xs text-gray-600">
            Model: {model.split('-').pop()}
          </div>
        )}

        {temperature !== undefined && (
          <div className="text-xs text-gray-600">
            Temp: {temperature}
          </div>
        )}

        {prompt && (
          <div className="text-xs text-gray-500 truncate max-w-[180px]">
            {prompt}
          </div>
        )}
      </div>
    </NodeWrapper>
  );
};

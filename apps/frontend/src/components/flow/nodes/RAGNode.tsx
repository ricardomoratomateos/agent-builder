import { FC } from 'react';
import { NodeWrapper } from './NodeWrapper';

interface RAGNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    config: {
      collection?: string;
      topK?: number;
      scoreThreshold?: number;
    };
  };
  selected?: boolean;
}

export const RAGNode: FC<RAGNodeProps> = ({ id, data, selected }) => {
  const { collection, topK, scoreThreshold } = data.config || {};

  return (
    <NodeWrapper selected={selected} color="purple">
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🔍</span>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        {collection && (
          <div className="text-xs text-gray-600">
            Collection: {collection}
          </div>
        )}

        {topK && (
          <div className="text-xs text-gray-600">
            Top K: {topK}
          </div>
        )}

        {scoreThreshold !== undefined && (
          <div className="text-xs text-gray-600">
            Threshold: {scoreThreshold}
          </div>
        )}
      </div>
    </NodeWrapper>
  );
};

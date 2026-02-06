import { FC } from 'react';
import { NodeWrapper } from './NodeWrapper';

interface StartNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    config?: {
      inputSchema?: any;
    };
  };
  selected?: boolean;
}

export const StartNode: FC<StartNodeProps> = ({ id, data, selected }) => {
  return (
    <NodeWrapper selected={selected} color="green" minWidth="min-w-[150px]" hasInput={false}>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">🚀</span>
        <span className="font-medium text-sm">{data.label}</span>
      </div>
    </NodeWrapper>
  );
};

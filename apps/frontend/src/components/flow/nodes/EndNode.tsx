import { FC } from 'react';
import { NodeWrapper } from './NodeWrapper';

interface EndNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    config?: any;
  };
  selected?: boolean;
}

export const EndNode: FC<EndNodeProps> = ({ id, data, selected }) => {
  return (
    <NodeWrapper selected={selected} color="gray" minWidth="min-w-[150px]" hasOutput={false}>
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">🏁</span>
        <span className="font-medium text-sm">{data.label}</span>
      </div>
    </NodeWrapper>
  );
};

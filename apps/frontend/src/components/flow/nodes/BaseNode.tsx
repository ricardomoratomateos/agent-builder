import { FC } from 'react';
import { NodeWrapper } from './NodeWrapper';

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    config: any;
  };
  selected?: boolean;
}

export const BaseNode: FC<BaseNodeProps> = ({ id, data, selected }) => {
  return (
    <NodeWrapper selected={selected} color="gray" minWidth="min-w-[150px]">
      <div className="font-medium text-sm">{data.label}</div>
      <div className="text-xs text-gray-500">{data.type}</div>
    </NodeWrapper>
  );
};

import { Handle, Position } from '@xyflow/react';
import { FC } from 'react';

interface ConditionNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    config: {
      condition?: string;
    };
  };
  selected?: boolean;
}

export const ConditionNode: FC<ConditionNodeProps> = ({ id, data, selected }) => {
  const { condition } = data.config || {};

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 bg-yellow-50 border-yellow-500 ${
        selected ? 'ring-2 ring-blue-400' : ''
      } min-w-[200px] relative`}
    >
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-4 !h-4 !bg-yellow-500 !border-2 !border-white hover:!bg-yellow-600"
      />

      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🔀</span>
          <span className="font-medium text-sm">{data.label}</span>
        </div>

        {condition && (
          <div className="text-xs text-gray-600 font-mono truncate max-w-[180px]">
            {condition}
          </div>
        )}
      </div>

      {/* Output handles - true (verde) y false (rojo) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="!w-4 !h-4 !bg-green-500 !border-2 !border-white hover:!bg-green-600"
        style={{ left: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!w-4 !h-4 !bg-red-500 !border-2 !border-white hover:!bg-red-600"
        style={{ left: '70%' }}
      />
    </div>
  );
};

import { Handle, Position } from '@xyflow/react';
import { FC, ReactNode } from 'react';

interface NodeWrapperProps {
  selected?: boolean;
  color: string; // e.g., 'blue', 'purple', 'green', etc.
  children: ReactNode;
  minWidth?: string;
  hasInput?: boolean; // Para el StartNode que no tiene entrada
  hasOutput?: boolean; // Para el EndNode que no tiene salida
}

export const NodeWrapper: FC<NodeWrapperProps> = ({
  selected,
  color,
  children,
  minWidth = 'min-w-[200px]',
  hasInput = true,
  hasOutput = true,
}) => {
  const colorMap: Record<string, { bg: string; border: string; handle: string }> = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      handle: '!bg-blue-500 hover:!bg-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-500',
      handle: '!bg-purple-500 hover:!bg-purple-600',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      handle: '!bg-green-500 hover:!bg-green-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-500',
      handle: '!bg-yellow-500 hover:!bg-yellow-600',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-500',
      handle: '!bg-gray-500 hover:!bg-gray-600',
    },
  };

  const colors = colorMap[color] || colorMap.gray;

  return (
    <div
      className={`px-4 py-3 rounded-lg border-2 ${colors.bg} ${colors.border} ${
        selected ? 'ring-2 ring-blue-400' : ''
      } ${minWidth} relative`}
    >
      {/* Input handle - arriba (solo si hasInput es true) */}
      {hasInput && (
        <Handle
          type="target"
          position={Position.Top}
          className={`!w-4 !h-4 !border-2 !border-white ${colors.handle}`}
        />
      )}

      {/* Contenido del nodo */}
      {children}

      {/* Output handle - abajo (solo si hasOutput es true) */}
      {hasOutput && (
        <Handle
          type="source"
          position={Position.Bottom}
          className={`!w-4 !h-4 !border-2 !border-white ${colors.handle}`}
        />
      )}
    </div>
  );
};

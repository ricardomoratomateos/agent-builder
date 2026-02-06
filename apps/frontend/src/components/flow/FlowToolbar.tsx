import { FC } from 'react';

interface FlowToolbarProps {
  onSave: () => void;
  onPublish: () => void;
  onTest: () => void;
  onDebug: () => void;
  isSaving?: boolean;
}

export const FlowToolbar: FC<FlowToolbarProps> = ({
  onSave,
  onPublish,
  onTest,
  onDebug,
  isSaving = false,
}) => {
  return (
    <div className="absolute top-4 right-4 flex space-x-2 z-10">
      <button
        onClick={onSave}
        disabled={isSaving}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
      >
        {isSaving ? 'Saving...' : 'Save Draft'}
      </button>
      <button
        onClick={onPublish}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Publish
      </button>
      <button
        onClick={onTest}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Test Run
      </button>
      <button
        onClick={onDebug}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
      >
        Debug Mode
      </button>
    </div>
  );
};

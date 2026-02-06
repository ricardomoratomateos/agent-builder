import { FC, useState } from 'react';
import { executionApi } from '../../lib/api';

interface TestRunModalProps {
  workflowId: string;
  onClose: () => void;
}

export const TestRunModal: FC<TestRunModalProps> = ({ workflowId, onClose }) => {
  const [input, setInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!input.trim()) {
      alert('Please enter input for the workflow');
      return;
    }

    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const { data } = await executionApi.run(workflowId, { message: input });
      setResult(data);
    } catch (err: any) {
      console.error('Test run failed:', err);
      setError(err.response?.data?.message || 'Test run failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Test Run Workflow</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your input message..."
              disabled={isRunning}
            />
          </div>

          {/* Run Button */}
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running...' : 'Run Workflow'}
          </button>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 font-medium">Error</div>
              <div className="text-red-600 text-sm mt-1">{error}</div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="font-bold text-lg mb-2">Result</h3>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Cost</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${result.cost?.toFixed(6) || '0.000000'}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {result.duration || 0}ms
                  </div>
                </div>
              </div>

              {/* Output */}
              <div>
                <h4 className="font-medium mb-2">Final Output</h4>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                    {JSON.stringify(result.output, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Node Results */}
              {result.nodeResults && result.nodeResults.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Node Execution Details</h4>
                  <div className="space-y-2">
                    {result.nodeResults.map((entry: any, i: number) => {
                      const [nodeId, nodeResult] = entry;
                      return (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-lg p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{nodeId}</span>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Cost: ${nodeResult.cost?.toFixed(6) || '0.000000'}</div>
                            <div>Duration: {nodeResult.duration || 0}ms</div>
                            {nodeResult.tokenUsage && (
                              <div>Tokens: {nodeResult.tokenUsage.inputTokens}/{nodeResult.tokenUsage.outputTokens}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import { FC, useState, useEffect } from 'react';
import { executionApi, workflowsApi } from '../../lib/api';

interface DebugPanelProps {
  workflowId: string;
  onClose: () => void;
  onStateChange?: (state: any) => void;
}

export const DebugPanel: FC<DebugPanelProps> = ({ workflowId, onClose, onStateChange }) => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionState, setSessionState] = useState<any>(null);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [totalNodes, setTotalNodes] = useState<number | null>(null);
  const [workflow, setWorkflow] = useState<any>(null);

  // Load workflow info on mount
  useEffect(() => {
    const loadWorkflow = async () => {
      try {
        const { data } = await workflowsApi.getOne(workflowId);
        setWorkflow(data);
        // Count all nodes (including End)
        setTotalNodes(data.nodes.length);
      } catch (error) {
        console.error('Failed to load workflow:', error);
      }
    };

    loadWorkflow();
  }, [workflowId]);

  const startDebugSession = async () => {
    const input = prompt('Enter input for workflow:');
    if (!input) return;

    try {
      const { data } = await executionApi.startDebug(workflowId, { message: input });
      setSessionId(data._id);
      await fetchSessionState(data._id);

      // Clear previous result when starting new session
      setCurrentResult(null);
    } catch (error) {
      console.error('Failed to start debug session:', error);
      alert('Failed to start debug session');
    }
  };

  const executeNextStep = async () => {
    if (!sessionId) return;
    setIsExecuting(true);

    try {
      const { data } = await executionApi.step(sessionId);
      setCurrentResult(data);
      await fetchSessionState(sessionId);
    } catch (error) {
      console.error('Failed to execute next step:', error);
      alert('Failed to execute next step');
    } finally {
      setIsExecuting(false);
    }
  };

  const continueExecution = async () => {
    if (!sessionId) return;
    setIsExecuting(true);

    try {
      const { data } = await executionApi.continue(sessionId);
      setCurrentResult(data);
      await fetchSessionState(sessionId);
    } catch (error) {
      console.error('Failed to continue execution:', error);
      alert('Failed to continue execution');
    } finally {
      setIsExecuting(false);
    }
  };

  const fetchSessionState = async (id: string) => {
    try {
      const { data } = await executionApi.getState(id);
      setSessionState(data);

      // Determine current node ID for highlighting
      let currentNodeId = null;
      if (data.results && data.results.length > 0) {
        // Get the last executed node
        const lastResult = data.results[data.results.length - 1];
        currentNodeId = lastResult.nodeId;
      } else if (workflow) {
        // If no results yet, highlight the Start node
        const startNode = workflow.nodes.find((n: any) => n.type === 'start');
        if (startNode) {
          currentNodeId = startNode.id;
        }
      }

      if (onStateChange) {
        onStateChange({
          ...data,
          currentNodeId,
        });
      }
    } catch (error) {
      console.error('Failed to fetch session state:', error);
    }
  };

  return (
    <div className="w-96 bg-white border-l p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Debug Mode</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
          ✕
        </button>
      </div>

      {!sessionId ? (
        <button
          onClick={startDebugSession}
          className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          Start Debug Session
        </button>
      ) : (
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Progress</div>
            <div className="text-2xl font-bold">
              {sessionState?.status === 'completed' ? totalNodes : (sessionState?.results?.length || 0)} / {totalNodes || '?'}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              Status: <span className="font-medium">{sessionState?.status || 'running'}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <button
              onClick={executeNextStep}
              disabled={isExecuting || sessionState?.status === 'completed'}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isExecuting ? 'Executing...' : 'Next Step'}
            </button>
            <button
              onClick={continueExecution}
              disabled={isExecuting || sessionState?.status === 'completed'}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue to End
            </button>
          </div>

          {/* Current Result */}
          {currentResult && currentResult.nodeName && (
            <div className="border border-gray-300 rounded-lg p-4 space-y-2">
              <h3 className="font-bold">{currentResult.nodeName}</h3>
              <div className="text-sm">
                <span className={currentResult.cached ? 'text-orange-600' : 'text-green-600'}>
                  {currentResult.cached ? '🔄 Cached' : '✓ Fresh'}
                </span>
              </div>
              <div className="text-xs space-y-1">
                <div>Cost: ${currentResult.cost?.toFixed(6) || '0.000000'}</div>
                <div>Duration: {currentResult.duration || 0}ms</div>
              </div>
              <div className="bg-gray-50 p-2 rounded text-xs">
                <pre className="whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(currentResult.output, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Completion Message */}
          {sessionState?.status === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-green-800 font-medium">✓ Workflow finished</div>
            </div>
          )}

          {/* Execution History */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-bold mb-2">Execution History</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sessionState?.results?.map((result: any, i: number) => (
                <div key={i} className="border border-gray-200 rounded-lg p-2 text-sm">
                  <div className="font-medium">{result.nodeName || 'Node'}</div>
                  <div className="text-xs text-gray-600">
                    Cost: ${result.cost?.toFixed(6) || '0.000000'} | {result.duration || 0}ms
                    {result.cached && <span className="ml-2 text-orange-600">🔄 Cached</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Costs */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-600">Total Cost</div>
            <div className="text-2xl font-bold text-blue-600">
              ${sessionState?.totalCost?.toFixed(6) || '0.000000'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Duration: {sessionState?.totalDuration || 0}ms
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

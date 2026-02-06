import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { workflowsApi } from '../lib/api';

export default function Dashboard() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const { data } = await workflowsApi.getAll();
      setWorkflows(data);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      await workflowsApi.delete(id);
      setWorkflows(workflows.filter((w) => w._id !== id));
    } catch (error) {
      console.error('Failed to delete workflow:', error);
      alert('Failed to delete workflow');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/editor"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create New Workflow
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Workflows</h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading workflows...</div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No workflows created yet.</p>
            <Link
              to="/editor"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create your first workflow
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflows.map((workflow) => (
              <div
                key={workflow._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 truncate flex-1">
                    {workflow.name}
                  </h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      workflow.version === 'production'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {workflow.version}
                  </span>
                </div>

                {workflow.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {workflow.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{workflow.nodes?.length || 0} nodes</span>
                  <span>
                    {new Date(workflow.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link
                    to={`/editor/${workflow._id}`}
                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(workflow._id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Testing System</h3>
          <p className="text-gray-600 text-sm">
            Test your agents with golden conversations and LLM-as-Judge validation.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Cost Optimizer</h3>
          <p className="text-gray-600 text-sm">
            Automatically detect optimization opportunities and reduce costs.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Step-by-Step Debug</h3>
          <p className="text-gray-600 text-sm">
            Execute workflows node-by-node with caching to save costs.
          </p>
        </div>
      </div>
    </div>
  );
}

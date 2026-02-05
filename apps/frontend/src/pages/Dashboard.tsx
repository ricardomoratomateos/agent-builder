import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/editor"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create New Agent
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Agents</h2>
        <p className="text-gray-600">No agents created yet. Create your first agent to get started!</p>
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

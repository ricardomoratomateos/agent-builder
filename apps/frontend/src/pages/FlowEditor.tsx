export default function FlowEditor() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Flow Editor</h1>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
            Save Draft
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Publish
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow" style={{ height: '600px' }}>
        <div className="h-full flex items-center justify-center text-gray-500">
          <p>React Flow editor will be integrated here</p>
        </div>
      </div>
    </div>
  );
}

import type { FC } from 'react';
import { useEffect } from 'react';
import { OIDTree } from '@/components/OIDTree';
import { useOIDStore } from '@/stores/oidStore';
import { sampleOIDTree } from '@/data/sampleOIDs';

const App: FC = () => {
  const { tree, loadTreeFromData, selectNode, expandAll, collapseAll } = useOIDStore();

  useEffect(() => {
    // Load sample data on mount
    loadTreeFromData(sampleOIDTree);
  }, [loadTreeFromData]);

  const handleNodeClick = (nodeId: string): void => {
    selectNode(nodeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">OID Visualizer</h1>
            <div className="space-x-2">
              <button
                onClick={expandAll}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow" style={{ height: '70vh' }}>
          {tree && (
            <OIDTree
              data={tree.roots}
              onNodeClick={handleNodeClick}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

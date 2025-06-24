import type { FC } from 'react';
import { useEffect } from 'react';
import { OIDTree } from '@/components/OIDTree';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { useOIDStore } from '@/stores/oidStore';
import { sampleOIDTree } from '@/data/sampleOIDs';

const App: FC = () => {
  const { tree, loadTreeFromData, selectNode, expandAll, collapseAll, search } = useOIDStore();

  useEffect(() => {
    // Load sample data on mount
    loadTreeFromData(sampleOIDTree);
  }, [loadTreeFromData]);

  const handleNodeClick = (nodeId: string): void => {
    selectNode(nodeId);
  };

  const handleQuickSearch = (oid: string): void => {
    search(oid);
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
        <div className="mb-6">
          <SearchBar />
          <div className="mt-2 flex gap-2 justify-center">
            <button
              onClick={() => handleQuickSearch('2.16.528.1.1003')}
              className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Quick: Dutch Healthcare (2.16.528.1.1003)
            </button>
            <button
              onClick={() => handleQuickSearch('2.16.528.1.1003.3')}
              className="text-sm px-3 py-1 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
            >
              Quick: Your Arc (2.16.528.1.1003.3)
            </button>
          </div>
        </div>
        <SearchResults />
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

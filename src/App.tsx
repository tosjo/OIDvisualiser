import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { OIDTree } from '@/components/OIDTree';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { NodeDetails } from '@/components/NodeDetails';
import { useOIDStore } from '@/stores/oidStore';
import { sampleOIDTree } from '@/data/sampleOIDs';

const App: FC = () => {
  const {
    tree,
    loadTreeFromData,
    selectNode,
    expandAll,
    collapseAll,
    search,
    selectedNodeId,
  } = useOIDStore();
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  useEffect(() => {
    // Load sample data on mount
    loadTreeFromData(sampleOIDTree);
  }, [loadTreeFromData]);

  useEffect(() => {
    // Open details panel when a node is selected
    if (selectedNodeId) {
      setIsDetailsPanelOpen(true);
    }
  }, [selectedNodeId]);

  const handleNodeClick = (nodeId: string): void => {
    selectNode(nodeId);
  };

  const handleQuickSearch = (oid: string): void => {
    search(oid);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 rounded-lg">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  OID Visualizer
                </h1>
                <p className="text-sm text-gray-500">
                  Object Identifier Hierarchy Explorer
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                Collapse All
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col lg:flex-row h-[calc(100vh-88px)]">
        {/* Left Panel - Tree and Search */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isDetailsPanelOpen ? 'lg:pr-96' : ''
          }`}
        >
          {/* Search Section */}
          <div className="bg-white border-b border-gray-200 p-6">
            <SearchBar />
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  handleQuickSearch('2.16.528.1.1003');
                }}
                className="text-sm px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors duration-200"
              >
                🇳🇱 Nederlandse Overheid (2.16.528.1.1003)
              </button>
              <button
                onClick={() => {
                  handleQuickSearch('2.16.528.1.1003.3');
                }}
                className="text-sm px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-full transition-colors duration-200"
              >
                ⭐ Your Custom Arc (2.16.528.1.1003.3)
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className="px-6 pt-4">
            <SearchResults />
          </div>

          {/* Tree Visualization */}
          <div className="flex-1 bg-white m-6 rounded-lg shadow-lg overflow-hidden">
            <div className="h-full relative">
              {tree ? (
                <OIDTree data={tree.roots} onNodeClick={handleNodeClick} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading OID tree...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Node Details */}
        <NodeDetails
          isOpen={isDetailsPanelOpen}
          onClose={() => {
            setIsDetailsPanelOpen(false);
          }}
        />
      </main>
    </div>
  );
};

export default App;

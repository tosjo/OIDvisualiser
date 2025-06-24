import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { SimpleTree } from '@/components/SimpleTree';
import { SearchBar } from '@/components/SearchBar';
import { NodeDetails } from '@/components/NodeDetails';
import { AddOIDModal } from '@/components/AddOIDModal';
import { ImportRelatedOIDs } from '@/components/ImportRelatedOIDs';
import { useOIDStore } from '@/stores/oidStore';
import { sampleOIDTree } from '@/data/sampleOIDs';

const App: FC = () => {
  const {
    tree,
    loadTreeFromData,
    selectNode,
    toggleNodeExpanded,
    selectedNodeId,
    expandedNodes,
  } = useOIDStore();
  const [isAddOIDModalOpen, setIsAddOIDModalOpen] = useState(false);

  useEffect(() => {
    // Load sample data on mount
    loadTreeFromData(sampleOIDTree);
    
    // Load custom OIDs from localStorage after a delay to ensure tree is loaded
    setTimeout(() => {
      const savedOIDs = JSON.parse(localStorage.getItem('customOIDs') || '[]');
      const { addNode } = useOIDStore.getState();
      savedOIDs.forEach((oid: any) => {
        if (oid.parent && oid.oid && oid.name) {
          addNode(oid.parent, oid);
        }
      });
    }, 500);
  }, [loadTreeFromData]);

  useEffect(() => {
    // Expand key nodes by default - only run once after tree is loaded
    if (tree && expandedNodes.size === 0) {
      const nodesToExpand = ['root-2', 'country', 'nl', 'nl-org', 'nl-overheid'];
      nodesToExpand.forEach(nodeId => {
        toggleNodeExpanded(nodeId);
      });
    }
  }, [tree, toggleNodeExpanded]);

  const handleNodeClick = (nodeId: string): void => {
    selectNode(nodeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">OID Visualizer</h1>
            <button
              onClick={() => setIsAddOIDModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Custom OID
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tree */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">OID Hierarchy</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Navigate to: 2.16.528.1.1003 (Nederlandse Overheid)
                </p>
              </div>
              <div className="h-[600px] overflow-auto">
                {tree ? (
                  <SimpleTree data={tree.roots} onNodeClick={handleNodeClick} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Node Details</h2>
              {selectedNodeId && tree ? (
                <NodeDetails />
              ) : (
                <p className="text-gray-500">Select a node to view details</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <SearchBar />
                <button
                  onClick={() => {
                    const node = tree?.roots
                      .flatMap(r => [r, ...(r.children || [])])
                      .flatMap(r => [r, ...(r.children || [])])
                      .flatMap(r => [r, ...(r.children || [])])
                      .flatMap(r => [r, ...(r.children || [])])
                      .find(n => n.oid === '2.16.528.1.1003');
                    if (node) {
                      selectNode(node.id);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                >
                  🇳🇱 Go to Nederlandse Overheid (2.16.528.1.1003)
                </button>
                <button
                  onClick={() => {
                    const node = tree?.roots
                      .flatMap(r => [r, ...(r.children || [])])
                      .flatMap(r => [r, ...(r.children || [])])
                      .flatMap(r => [r, ...(r.children || [])])
                      .flatMap(r => [r, ...(r.children || [])])
                      .flatMap(r => [r, ...(r.children || [])])
                      .find(n => n.oid === '2.16.528.1.1003.3');
                    if (node) {
                      selectNode(node.id);
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                >
                  ⭐ Your Custom Arc (2.16.528.1.1003.3)
                </button>
              </div>
            </div>

            {/* Import Related OIDs */}
            {selectedNodeId && (
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ImportRelatedOIDs />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add OID Modal */}
      <AddOIDModal
        isOpen={isAddOIDModalOpen}
        onClose={() => setIsAddOIDModalOpen(false)}
      />
    </div>
  );
};

export default App;
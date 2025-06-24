import type { FC } from 'react';
import { useOIDStore } from '@/stores/oidStore';

export const SearchResults: FC = () => {
  const { searchResults, searchQuery, selectNode, expandedNodes, toggleNodeExpanded } = useOIDStore();

  if (!searchQuery || searchResults.length === 0) {
    return null;
  }

  const handleResultClick = (nodeId: string, path: string[]): void => {
    // Expand all nodes in the path to make the result visible
    path.forEach(id => {
      if (!expandedNodes.has(id)) {
        toggleNodeExpanded(id);
      }
    });
    selectNode(nodeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3">
        Search Results ({searchResults.length} found)
      </h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {searchResults.map((result) => (
          <button
            key={result.node.id}
            onClick={() => handleResultClick(result.node.id, result.path)}
            className="w-full text-left p-3 rounded hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{result.node.name}</div>
                <div className="text-sm text-gray-600 font-mono">{result.node.oid}</div>
                {result.node.description && (
                  <div className="text-sm text-gray-500 mt-1">{result.node.description}</div>
                )}
              </div>
              <span className="text-xs text-gray-400 ml-2">
                {result.matchType}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Path: {result.path.join(' → ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
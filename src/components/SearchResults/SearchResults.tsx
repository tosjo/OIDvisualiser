import type { FC } from 'react';
import { useOIDStore } from '@/stores/oidStore';

export const SearchResults: FC = () => {
  const {
    searchResults,
    searchQuery,
    selectNode,
    expandedNodes,
    toggleNodeExpanded,
  } = useOIDStore();

  if (!searchQuery || searchResults.length === 0) {
    return null;
  }

  const handleResultClick = (nodeId: string, path: string[]): void => {
    // Expand all nodes in the path to make the result visible
    path.forEach((id) => {
      if (!expandedNodes.has(id)) {
        toggleNodeExpanded(id);
      }
    });
    selectNode(nodeId);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 border-b border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900">
          Search Results ({searchResults.length} found)
        </h3>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {searchResults.map((result, index) => (
          <button
            key={result.node.id}
            onClick={() => {
              handleResultClick(result.node.id, result.path);
            }}
            className={`w-full text-left p-4 transition-all duration-200 hover:bg-blue-50 ${
              index !== searchResults.length - 1
                ? 'border-b border-gray-100'
                : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {result.node.name}
                </div>
                <div className="text-sm text-blue-600 font-mono mt-1">
                  {result.node.oid}
                </div>
                {result.node.description && (
                  <div className="text-sm text-gray-600 mt-2">
                    {result.node.description}
                  </div>
                )}
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ml-3 ${
                  result.matchType === 'exact'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {result.matchType}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              {result.path.join(' → ')}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

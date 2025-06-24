import type { FC } from 'react';
import { useState } from 'react';
import { useOIDStore } from '@/stores/oidStore';
import { findNodeById } from '@/utils/oid';
import type { OIDNode } from '@/types';

interface NodeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NodeDetails: FC<NodeDetailsProps> = ({ isOpen, onClose }) => {
  const { tree, selectedNodeId } = useOIDStore();
  const [copySuccess, setCopySuccess] = useState(false);

  if (!tree || !selectedNodeId || !isOpen) {
    return null;
  }

  const selectedNode = findNodeById(tree.roots, selectedNodeId);
  if (!selectedNode) {
    return null;
  }

  const handleCopyOID = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(selectedNode.oid);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy OID:', err);
    }
  };

  const handleExportJSON = (): void => {
    const dataStr = JSON.stringify(selectedNode, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `oid-${selectedNode.oid.replace(/\./g, '-')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getParentNode = (node: OIDNode): OIDNode | null => {
    if (!node.parent) return null;
    return findNodeById(tree.roots, node.parent);
  };

  const parentNode = getParentNode(selectedNode);

  return (
    <div
      className={`fixed right-0 top-0 h-full bg-white shadow-xl transform transition-transform duration-300 translate-x-0 w-96 z-50`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{selectedNode.name}</h2>
              <div className="flex items-center gap-2">
                <code className="bg-blue-800 bg-opacity-50 px-2 py-1 rounded text-sm">
                  {selectedNode.oid}
                </code>
                <button
                  onClick={() => {
                    void handleCopyOID();
                  }}
                  className="text-sm bg-blue-800 bg-opacity-50 hover:bg-opacity-70 px-2 py-1 rounded transition-all"
                  title="Copy OID"
                >
                  {copySuccess ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 hover:bg-opacity-50 rounded-full p-2 transition-colors"
              aria-label="Close details panel"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Description */}
          {selectedNode.description && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-600">{selectedNode.description}</p>
            </section>
          )}

          {/* Parent Information */}
          {parentNode && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Parent Node
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{parentNode.name}</p>
                <code className="text-sm text-gray-600">{parentNode.oid}</code>
              </div>
            </section>
          )}

          {/* Children */}
          {selectedNode.children && selectedNode.children.length > 0 && (
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Children ({selectedNode.children.length})
              </h3>
              <div className="space-y-2">
                {selectedNode.children.map((child) => (
                  <div key={child.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-900">{child.name}</p>
                    <code className="text-sm text-gray-600">{child.oid}</code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Metadata
            </h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">ID:</dt>
                <dd className="font-mono text-sm text-gray-900">
                  {selectedNode.id}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Full OID:</dt>
                <dd className="font-mono text-sm text-gray-900">
                  {selectedNode.oid}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">Has Children:</dt>
                <dd className="text-gray-900">
                  {selectedNode.children ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>
          </section>

          {/* Actions */}
          <section className="border-t pt-4">
            <button
              onClick={handleExportJSON}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Export as JSON
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

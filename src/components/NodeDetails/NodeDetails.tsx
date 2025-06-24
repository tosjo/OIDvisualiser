import type { FC } from 'react';
import { useOIDStore } from '@/stores/oidStore';
import { findNodeById } from '@/utils/oid';

export const NodeDetails: FC = () => {
  const { tree, selectedNodeId } = useOIDStore();

  if (!tree || !selectedNodeId) {
    return null;
  }

  const selectedNode = findNodeById(tree.roots, selectedNodeId);
  if (!selectedNode) {
    return null;
  }

  const handleCopyOID = (): void => {
    navigator.clipboard.writeText(selectedNode.oid).then(() => {
      // Could add a toast notification here
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Name</h3>
        <p className="mt-1 text-lg font-medium text-gray-900">{selectedNode.name}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">OID</h3>
        <div className="mt-1 flex items-center gap-2">
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{selectedNode.oid}</code>
          <button
            onClick={handleCopyOID}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Copy
          </button>
        </div>
      </div>

      {selectedNode.description && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="mt-1 text-sm text-gray-700">{selectedNode.description}</p>
        </div>
      )}

      {selectedNode.children && selectedNode.children.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500">Children</h3>
          <ul className="mt-1 space-y-1">
            {selectedNode.children.map((child) => (
              <li key={child.id} className="text-sm text-gray-700">
                • {child.name} ({child.oid})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
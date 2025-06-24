import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { useOIDStore } from '@/stores/oidStore';
import type { OIDNode } from '@/types';

interface EditOIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: OIDNode | null;
}

export const EditOIDModal: FC<EditOIDModalProps> = ({ isOpen, onClose, node }) => {
  const { updateNode } = useOIDStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (node) {
      setName(node.name || '');
      setDescription(node.description || '');
      setError('');
    }
  }, [node]);

  if (!isOpen || !node) return null;

  // Check if this is a custom OID (under 2.16.528.1.1003.3)
  const isCustomOID = node.oid.startsWith('2.16.528.1.1003.3');
  
  if (!isCustomOID) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Cannot Edit Standard OID</h2>
          <p className="text-gray-600 mb-4">
            Only custom OIDs under your namespace (2.16.528.1.1003.3) can be edited.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    // Update the node
    const updatedNode: OIDNode = {
      ...node,
      name: name.trim(),
      description: description.trim() || undefined,
    };

    updateNode(node.id, updatedNode);

    // Update localStorage
    const savedOIDs = JSON.parse(localStorage.getItem('customOIDs') || '[]') as OIDNode[];
    const updatedOIDs = savedOIDs.map(oid => 
      oid.id === node.id ? updatedNode : oid
    );
    localStorage.setItem('customOIDs', JSON.stringify(updatedOIDs));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit OID</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OID
            </label>
            <input
              type="text"
              value={node.oid}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Application"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., OID for my healthcare application"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
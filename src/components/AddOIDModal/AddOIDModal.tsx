import type { FC } from 'react';
import { useState } from 'react';
import { useOIDStore } from '@/stores/oidStore';
import { parseOID } from '@/utils/oid';
import type { OIDNode } from '@/types';

interface AddOIDModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentOID?: string;
}

export const AddOIDModal: FC<AddOIDModalProps> = ({ isOpen, onClose, parentOID = '2.16.528.1.1003.3' }) => {
  const { tree, addNode } = useOIDStore();
  const [oidNumber, setOidNumber] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate OID
    const fullOID = `${parentOID}.${oidNumber}`;
    if (!parseOID(fullOID)) {
      setError('Invalid OID format');
      return;
    }

    // Check if OID already exists
    const existingNode = tree?.roots.some(root => 
      JSON.stringify(root).includes(fullOID)
    );
    
    if (existingNode) {
      setError('OID already exists');
      return;
    }

    // Create new node
    const newNode: OIDNode = {
      id: `custom-${Date.now()}`,
      oid: fullOID,
      name: name.trim(),
      description: description.trim(),
      parent: parentOID,
    };

    // Add the node
    addNode(parentOID, newNode);
    
    // Save to localStorage
    const savedOIDs = JSON.parse(localStorage.getItem('customOIDs') || '[]');
    savedOIDs.push(newNode);
    localStorage.setItem('customOIDs', JSON.stringify(savedOIDs));

    // Reset form
    setOidNumber('');
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Custom OID</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent OID
            </label>
            <input
              type="text"
              value={parentOID}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OID Number (to append)
            </label>
            <input
              type="text"
              value={oidNumber}
              onChange={(e) => setOidNumber(e.target.value)}
              placeholder="e.g., 1 or 2 or 100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Will create: {parentOID}.{oidNumber || '?'}
            </p>
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
              Add OID
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
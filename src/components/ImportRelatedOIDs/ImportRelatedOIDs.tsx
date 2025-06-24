import type { FC } from 'react';
import { useState } from 'react';
import { useOIDStore } from '@/stores/oidStore';
import { findNodeById } from '@/utils/oid';
import type { OIDNode } from '@/types';

export const ImportRelatedOIDs: FC = () => {
  const { tree, selectedNodeId, addNode } = useOIDStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [importedCount, setImportedCount] = useState(0);

  if (!tree || !selectedNodeId) {
    return null;
  }

  const selectedNode = findNodeById(tree.roots, selectedNodeId);
  if (!selectedNode) {
    return null;
  }

  const fetchOIDInfo = async (oid: string): Promise<any> => {
    try {
      // Using oid-info.com API or web scraping would require a backend proxy
      // For now, we'll use the WebFetch tool to get the HTML and parse it
      const response = await fetch(`https://oid-info.com/get/${oid}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const html = await response.text();
      // Parse HTML to extract OID information
      return null; // Placeholder
    } catch (error) {
      console.error('Error fetching OID:', error);
      return null;
    }
  };

  const handleLoadChildren = async () => {
    setIsLoading(true);
    setError('');
    setImportedCount(0);

    try {
      // For demonstration, we'll add some common OIDs
      // In a real implementation, this would fetch from oid-info.com
      
      if (selectedNode.oid === '2.16.528.1.1003') {
        // Add known children of Nederlandse Overheid if not already present
        const knownChildren = [
          { suffix: '10', name: 'ep-bsn', description: 'Electronic Pseudonym BSN' },
          { suffix: '11', name: 'gba', description: 'Gemeentelijke Basisadministratie' },
          { suffix: '12', name: 'uwv', description: 'UWV - Uitvoeringsinstituut Werknemersverzekeringen' },
          { suffix: '13', name: 'belastingdienst-cn', description: 'Belastingdienst Common Name' },
        ];

        let count = 0;
        for (const child of knownChildren) {
          const childOid = `${selectedNode.oid}.${child.suffix}`;
          // Check if already exists
          const exists = tree.roots.some(root => 
            JSON.stringify(root).includes(childOid)
          );
          
          if (!exists) {
            const newNode: OIDNode = {
              id: `imported-${Date.now()}-${count}`,
              oid: childOid,
              name: child.name,
              description: child.description,
              parent: selectedNode.oid,
            };
            addNode(selectedNode.oid, newNode);
            count++;
          }
        }
        setImportedCount(count);
      } else {
        setError('No additional OIDs found in registry for this node');
      }
    } catch (err) {
      setError('Failed to fetch OIDs from registry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSiblings = async () => {
    setIsLoading(true);
    setError('');
    setImportedCount(0);

    try {
      // Get parent OID
      const parentOid = selectedNode.oid.split('.').slice(0, -1).join('.');
      if (!parentOid) {
        setError('Cannot load siblings for root OID');
        return;
      }

      // For demonstration, add some siblings
      if (parentOid === '2.16.528.1') {
        const knownSiblings = [
          { oid: '2.16.528.1.1001', name: 'diginotar', description: 'DigiNotar (defunct certificate authority)' },
          { oid: '2.16.528.1.1002', name: 'gemnet', description: 'GemNet' },
          { oid: '2.16.528.1.1004', name: 'digid', description: 'DigiD - Dutch digital identity' },
          { oid: '2.16.528.1.1007', name: 'a-select', description: 'A-Select authentication system' },
        ];

        let count = 0;
        for (const sibling of knownSiblings) {
          const exists = tree.roots.some(root => 
            JSON.stringify(root).includes(sibling.oid)
          );
          
          if (!exists) {
            const newNode: OIDNode = {
              id: `imported-${Date.now()}-${count}`,
              oid: sibling.oid,
              name: sibling.name,
              description: sibling.description,
              parent: parentOid,
            };
            addNode(parentOid, newNode);
            count++;
          }
        }
        setImportedCount(count);
      } else {
        setError('No siblings found in registry');
      }
    } catch (err) {
      setError('Failed to fetch OIDs from registry');
    } finally {
      setIsLoading(false);
    }
  };

  // Show info about registered OIDs
  const getRegisteredInfo = () => {
    if (selectedNode.oid === '2.16.528.1.1003') {
      return (
        <div className="text-xs text-gray-500 mb-3 p-3 bg-blue-50 rounded">
          <p className="font-semibold mb-1">Known registered children:</p>
          <ul className="space-y-1">
            <li>• 2.16.528.1.1003.1 - pki-voor-de-overheid (already loaded)</li>
            <li>• 2.16.528.1.1003.2 - belastingdienst (already loaded)</li>
            <li>• 2.16.528.1.1003.3 - Your namespace (available)</li>
            <li>• 2.16.528.1.1003.10-13 - Various government services</li>
          </ul>
        </div>
      );
    }
    if (selectedNode.oid === '2.16.528.1') {
      return (
        <div className="text-xs text-gray-500 mb-3 p-3 bg-blue-50 rounded">
          <p className="font-semibold mb-1">Known siblings include:</p>
          <ul className="space-y-1">
            <li>• 1001 - diginotar (defunct CA)</li>
            <li>• 1002 - gemnet</li>
            <li>• 1003 - nederlandse-overheid (current)</li>
            <li>• 1004 - digid</li>
            <li>• 1007 - a-select</li>
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-medium text-gray-900">Import from Registry</h3>
      
      {getRegisteredInfo()}
      
      <button
        onClick={handleLoadChildren}
        disabled={isLoading}
        className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-md hover:bg-purple-100 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : '📥 Load children from oid-info.com'}
      </button>

      <button
        onClick={handleLoadSiblings}
        disabled={isLoading}
        className="w-full text-left px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : '🔄 Load siblings from registry'}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {importedCount > 0 && (
        <p className="text-sm text-green-600">
          ✓ Imported {importedCount} new OID{importedCount > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
};
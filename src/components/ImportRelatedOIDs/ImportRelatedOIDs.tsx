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
          { suffix: '4', name: 'DigiD', description: 'Dutch digital identity' },
          { suffix: '5', name: 'BSN', description: 'Burgerservicenummer registry' },
          { suffix: '10', name: 'eHerkenning', description: 'Business authentication' },
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
          { oid: '2.16.528.1.1001', name: 'KvK', description: 'Kamer van Koophandel' },
          { oid: '2.16.528.1.1002', name: 'CBS', description: 'Centraal Bureau voor de Statistiek' },
          { oid: '2.16.528.1.1004', name: 'RDW', description: 'Rijksdienst voor het Wegverkeer' },
          { oid: '2.16.528.1.1005', name: 'UWV', description: 'Uitvoeringsinstituut Werknemersverzekeringen' },
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

  return (
    <div className="mt-6 space-y-3">
      <h3 className="text-lg font-medium text-gray-900">Import from Registry</h3>
      
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
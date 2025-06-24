import type { OIDNode, OIDSearchResult } from '@/types';

/**
 * Parses an OID string into its numeric components
 */
export function parseOID(oid: string): number[] {
  return oid.split('.').map(Number);
}

/**
 * Formats an OID array back to string format
 */
export function formatOID(oidParts: number[]): string {
  return oidParts.join('.');
}

/**
 * Checks if one OID is a child of another
 */
export function isChildOID(childOID: string, parentOID: string): boolean {
  return childOID.startsWith(parentOID + '.');
}

/**
 * Gets the parent OID from a given OID
 */
export function getParentOID(oid: string): string | null {
  const parts = parseOID(oid);
  if (parts.length <= 1) return null;
  return formatOID(parts.slice(0, -1));
}

/**
 * Calculates the depth of an OID in the tree
 */
export function getOIDDepth(oid: string): number {
  return parseOID(oid).length - 1;
}

/**
 * Flattens a tree structure into an array of nodes
 */
export function flattenTree(nodes: OIDNode[]): OIDNode[] {
  const result: OIDNode[] = [];
  
  function traverse(node: OIDNode): void {
    result.push(node);
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  nodes.forEach(traverse);
  return result;
}

/**
 * Searches for nodes in the tree
 */
export function searchNodes(
  nodes: OIDNode[],
  query: string,
  options: {
    searchIn?: ('name' | 'oid' | 'description')[];
    caseSensitive?: boolean;
  } = {}
): OIDSearchResult[] {
  const {
    searchIn = ['name', 'oid', 'description'],
    caseSensitive = false,
  } = options;

  const results: OIDSearchResult[] = [];
  const flatNodes = flattenTree(nodes);
  const searchQuery = caseSensitive ? query : query.toLowerCase();

  flatNodes.forEach((node) => {
    let matchType: OIDSearchResult['matchType'] | null = null;

    if (searchIn.includes('oid') && node.oid === query) {
      matchType = 'exact';
    } else if (
      searchIn.includes('name') &&
      (caseSensitive ? node.name : node.name.toLowerCase()).includes(
        searchQuery
      )
    ) {
      matchType = 'name';
    } else if (
      searchIn.includes('oid') &&
      node.oid.includes(query)
    ) {
      matchType = 'oid';
    } else if (
      searchIn.includes('description') &&
      node.description &&
      (caseSensitive
        ? node.description
        : node.description.toLowerCase()
      ).includes(searchQuery)
    ) {
      matchType = 'description';
    }

    if (matchType) {
      results.push({
        node,
        path: getNodePath(nodes, node.id),
        matchType,
      });
    }
  });

  return results;
}

/**
 * Gets the path to a node in the tree
 */
export function getNodePath(roots: OIDNode[], nodeId: string): string[] {
  const path: string[] = [];

  function findPath(nodes: OIDNode[], targetId: string): boolean {
    for (const node of nodes) {
      path.push(node.id);
      
      if (node.id === targetId) {
        return true;
      }
      
      if (node.children && findPath(node.children, targetId)) {
        return true;
      }
      
      path.pop();
    }
    return false;
  }

  findPath(roots, nodeId);
  return path;
}

/**
 * Finds a node by its ID in the tree
 */
export function findNodeById(roots: OIDNode[], nodeId: string): OIDNode | null {
  function search(nodes: OIDNode[]): OIDNode | null {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.children) {
        const found = search(node.children);
        if (found) return found;
      }
    }
    return null;
  }
  
  return search(roots);
}

/**
 * Builds a tree structure from a flat array of OID nodes
 */
export function buildTreeFromFlat(nodes: OIDNode[]): OIDNode[] {
  const nodeMap = new Map<string, OIDNode>();
  const roots: OIDNode[] = [];

  // First pass: create a map of all nodes
  nodes.forEach((node) => {
    nodeMap.set(node.oid, { ...node, children: [] });
  });

  // Second pass: build the tree structure
  nodes.forEach((node) => {
    const currentNode = nodeMap.get(node.oid);
    if (!currentNode) return; // Skip if node not found
    
    const parentOID = getParentOID(node.oid);

    if (parentOID && nodeMap.has(parentOID)) {
      const parent = nodeMap.get(parentOID);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(currentNode);
        currentNode.parent = parent.id;
      }
    } else {
      roots.push(currentNode);
    }
  });

  return roots;
}
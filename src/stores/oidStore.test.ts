import { describe, it, expect, beforeEach } from 'vitest';
import { useOIDStore } from './oidStore';
import type { OIDNode, OIDTree } from '@/types';

describe('OIDStore', () => {
  beforeEach(() => {
    useOIDStore.getState().reset();
  });

  describe('setTree', () => {
    it('should set the tree', () => {
      const tree: OIDTree = {
        roots: [{ id: '1', oid: '1', name: 'Test' }],
      };
      useOIDStore.getState().setTree(tree);
      expect(useOIDStore.getState().tree).toEqual(tree);
    });

    it('should clear error when setting tree', () => {
      useOIDStore.setState({ error: 'Some error' });
      useOIDStore.getState().setTree({ roots: [] });
      expect(useOIDStore.getState().error).toBeNull();
    });
  });

  describe('loadTreeFromData', () => {
    it('should load valid tree data', () => {
      const validTree = {
        roots: [{ id: '1', oid: '1', name: 'Test' }],
      };
      useOIDStore.getState().loadTreeFromData(validTree);
      expect(useOIDStore.getState().tree).toEqual(validTree);
      expect(useOIDStore.getState().isLoading).toBe(false);
    });

    it('should handle invalid tree data', () => {
      const invalidData = { invalid: 'data' };
      useOIDStore.getState().loadTreeFromData(invalidData);
      expect(useOIDStore.getState().tree).toBeNull();
      expect(useOIDStore.getState().error).toContain('roots');
      expect(useOIDStore.getState().isLoading).toBe(false);
    });
  });

  describe('loadTreeFromFlat', () => {
    it('should build tree from flat nodes', () => {
      const flatNodes: OIDNode[] = [
        { id: '1', oid: '1', name: 'Root' },
        { id: '2', oid: '1.2', name: 'Child' },
      ];
      useOIDStore.getState().loadTreeFromFlat(flatNodes);
      
      const tree = useOIDStore.getState().tree;
      expect(tree).not.toBeNull();
      expect(tree?.roots).toHaveLength(1);
      expect(tree?.roots[0].children).toHaveLength(1);
      expect(tree?.metadata?.totalNodes).toBe(2);
    });
  });

  describe('selectNode', () => {
    it('should select a node', () => {
      useOIDStore.getState().selectNode('test-id');
      expect(useOIDStore.getState().selectedNodeId).toBe('test-id');
    });

    it('should deselect when null is passed', () => {
      useOIDStore.setState({ selectedNodeId: 'test-id' });
      useOIDStore.getState().selectNode(null);
      expect(useOIDStore.getState().selectedNodeId).toBeNull();
    });
  });

  describe('toggleNodeExpanded', () => {
    it('should expand a collapsed node', () => {
      useOIDStore.getState().toggleNodeExpanded('node-1');
      expect(useOIDStore.getState().expandedNodes.has('node-1')).toBe(true);
    });

    it('should collapse an expanded node', () => {
      useOIDStore.setState({ expandedNodes: new Set(['node-1']) });
      useOIDStore.getState().toggleNodeExpanded('node-1');
      expect(useOIDStore.getState().expandedNodes.has('node-1')).toBe(false);
    });
  });

  describe('expandAll and collapseAll', () => {
    beforeEach(() => {
      const tree: OIDTree = {
        roots: [
          {
            id: '1',
            oid: '1',
            name: 'Root',
            children: [
              { id: '2', oid: '1.2', name: 'Child' },
            ],
          },
        ],
      };
      useOIDStore.setState({ tree });
    });

    it('should expand all nodes', () => {
      useOIDStore.getState().expandAll();
      const expanded = useOIDStore.getState().expandedNodes;
      expect(expanded.has('1')).toBe(true);
      expect(expanded.has('2')).toBe(true);
    });

    it('should collapse all nodes', () => {
      useOIDStore.setState({ expandedNodes: new Set(['1', '2']) });
      useOIDStore.getState().collapseAll();
      expect(useOIDStore.getState().expandedNodes.size).toBe(0);
    });
  });

  describe('search', () => {
    beforeEach(() => {
      const tree: OIDTree = {
        roots: [
          { id: '1', oid: '1.2', name: 'Test Node' },
        ],
      };
      useOIDStore.setState({ tree });
    });

    it('should search for nodes', () => {
      useOIDStore.getState().search('Test');
      expect(useOIDStore.getState().searchQuery).toBe('Test');
      expect(useOIDStore.getState().searchResults).toHaveLength(1);
    });

    it('should handle empty search query', () => {
      useOIDStore.getState().search('');
      expect(useOIDStore.getState().searchResults).toHaveLength(0);
    });

    it('should handle search with no tree', () => {
      useOIDStore.setState({ tree: null });
      useOIDStore.getState().search('Test');
      expect(useOIDStore.getState().searchResults).toHaveLength(0);
    });
  });

  describe('clearSearch', () => {
    it('should clear search state', () => {
      useOIDStore.setState({
        searchQuery: 'test',
        searchResults: [{ 
          node: { id: '1', oid: '1', name: 'Test' } as OIDNode, 
          path: [], 
          matchType: 'name' 
        }],
      });
      useOIDStore.getState().clearSearch();
      expect(useOIDStore.getState().searchQuery).toBe('');
      expect(useOIDStore.getState().searchResults).toHaveLength(0);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      useOIDStore.getState().setError('Test error');
      expect(useOIDStore.getState().error).toBe('Test error');
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      useOIDStore.setState({
        tree: { roots: [] },
        selectedNodeId: 'test',
        searchQuery: 'query',
        expandedNodes: new Set(['1', '2']),
        error: 'error',
      });
      
      useOIDStore.getState().reset();
      
      const state = useOIDStore.getState();
      expect(state.tree).toBeNull();
      expect(state.selectedNodeId).toBeNull();
      expect(state.searchQuery).toBe('');
      expect(state.expandedNodes.size).toBe(0);
      expect(state.error).toBeNull();
    });
  });
});
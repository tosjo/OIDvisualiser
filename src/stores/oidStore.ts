import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { OIDNode, OIDTree, OIDSearchResult } from '@/types';
import { OIDTreeSchema } from '@/types';
import { searchNodes, buildTreeFromFlat, findNodeById, findNodeByOID } from '@/utils/oid';

interface OIDState {
  // Data
  tree: OIDTree | null;
  selectedNodeId: string | null;
  searchQuery: string;
  searchResults: OIDSearchResult[];
  expandedNodes: Set<string>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTree: (tree: OIDTree) => void;
  loadTreeFromData: (data: unknown) => void;
  loadTreeFromFlat: (nodes: OIDNode[]) => void;
  selectNode: (nodeId: string | null) => void;
  toggleNodeExpanded: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  search: (query: string) => void;
  clearSearch: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
  addNode: (parentId: string, node: OIDNode) => void;
  updateNode: (nodeId: string, updatedNode: OIDNode) => void;
}

const initialState = {
  tree: null,
  selectedNodeId: null,
  searchQuery: '',
  searchResults: [],
  expandedNodes: new Set<string>(),
  isLoading: false,
  error: null,
};

export const useOIDStore = create<OIDState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setTree: (tree) => {
        set({ tree, error: null });
      },

      loadTreeFromData: (data) => {
        set({ isLoading: true, error: null });
        try {
          const validatedTree = OIDTreeSchema.parse(data);
          set({ tree: validatedTree, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Invalid tree data',
            isLoading: false,
          });
        }
      },

      loadTreeFromFlat: (nodes) => {
        set({ isLoading: true, error: null });
        try {
          const roots = buildTreeFromFlat(nodes);
          const tree: OIDTree = {
            roots,
            metadata: {
              totalNodes: nodes.length,
              maxDepth: Math.max(...nodes.map((n) => n.oid.split('.').length - 1)),
            },
          };
          const validatedTree = OIDTreeSchema.parse(tree);
          set({ tree: validatedTree, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to build tree',
            isLoading: false,
          });
        }
      },

      selectNode: (nodeId) => {
        set({ selectedNodeId: nodeId });
      },

      toggleNodeExpanded: (nodeId) => {
        set((state) => {
          const newExpanded = new Set(state.expandedNodes);
          if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
          } else {
            newExpanded.add(nodeId);
          }
          return { expandedNodes: newExpanded };
        });
      },

      expandAll: () => {
        const { tree } = get();
        if (!tree) return;
        
        const allNodeIds = new Set<string>();
        function collectIds(nodes: OIDNode[]): void {
          nodes.forEach((node) => {
            allNodeIds.add(node.id);
            if (node.children) collectIds(node.children);
          });
        }
        collectIds(tree.roots);
        
        set({ expandedNodes: allNodeIds });
      },

      collapseAll: () => {
        set({ expandedNodes: new Set() });
      },

      search: (query) => {
        const { tree } = get();
        if (!tree || !query.trim()) {
          set({ searchQuery: query, searchResults: [] });
          return;
        }

        const results = searchNodes(tree.roots, query);
        set({ searchQuery: query, searchResults: results });
        
        // If we have results, select and expand to the first one
        if (results.length > 0) {
          const firstResult = results[0];
          // Expand all nodes in the path
          firstResult.path.forEach(nodeId => {
            const { expandedNodes } = get();
            if (!expandedNodes.has(nodeId)) {
              get().toggleNodeExpanded(nodeId);
            }
          });
          // Select the node
          get().selectNode(firstResult.node.id);
        }
      },

      clearSearch: () => {
        set({ searchQuery: '', searchResults: [] });
      },

      setError: (error) => {
        set({ error });
      },

      reset: () => {
        set(initialState);
      },

      addNode: (parentId, node) => {
        const { tree } = get();
        if (!tree) return;

        const addNodeRecursive = (nodes: OIDNode[]): boolean => {
          for (const n of nodes) {
            if (n.oid === parentId) {
              if (!n.children) {
                n.children = [];
              }
              n.children.push(node);
              return true;
            }
            if (n.children && addNodeRecursive(n.children)) {
              return true;
            }
          }
          return false;
        };

        const updatedTree = { ...tree, roots: [...tree.roots] };
        if (addNodeRecursive(updatedTree.roots)) {
          set({ tree: updatedTree });
          // Expand parent node to show new child
          const { expandedNodes } = get();
          const parentNode = findNodeByOID(updatedTree.roots, parentId);
          if (parentNode && !expandedNodes.has(parentNode.id)) {
            get().toggleNodeExpanded(parentNode.id);
          }
        }
      },

      updateNode: (nodeId, updatedNode) => {
        const { tree } = get();
        if (!tree) return;

        const updateNodeRecursive = (nodes: OIDNode[]): boolean => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].id === nodeId) {
              nodes[i] = { ...nodes[i], ...updatedNode };
              return true;
            }
            if (nodes[i].children && updateNodeRecursive(nodes[i].children)) {
              return true;
            }
          }
          return false;
        };

        const updatedTree = { ...tree, roots: [...tree.roots] };
        if (updateNodeRecursive(updatedTree.roots)) {
          set({ tree: updatedTree });
        }
      },
    }),
    {
      name: 'oid-store',
    }
  )
);
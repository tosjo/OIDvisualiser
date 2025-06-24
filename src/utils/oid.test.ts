import { describe, it, expect } from 'vitest';
import {
  parseOID,
  formatOID,
  isChildOID,
  getParentOID,
  getOIDDepth,
  flattenTree,
  searchNodes,
  buildTreeFromFlat,
} from './oid';
import type { OIDNode } from '@/types';

describe('OID Utilities', () => {
  describe('parseOID', () => {
    it('should parse simple OID', () => {
      expect(parseOID('1.2.3')).toEqual([1, 2, 3]);
    });

    it('should parse single number OID', () => {
      expect(parseOID('1')).toEqual([1]);
    });

    it('should parse long OID', () => {
      expect(parseOID('1.3.6.1.4.1.311')).toEqual([1, 3, 6, 1, 4, 1, 311]);
    });
  });

  describe('formatOID', () => {
    it('should format OID array to string', () => {
      expect(formatOID([1, 2, 3])).toBe('1.2.3');
    });

    it('should format single number', () => {
      expect(formatOID([1])).toBe('1');
    });
  });

  describe('isChildOID', () => {
    it('should identify direct child', () => {
      expect(isChildOID('1.2.3', '1.2')).toBe(true);
    });

    it('should identify nested child', () => {
      expect(isChildOID('1.2.3.4.5', '1.2')).toBe(true);
    });

    it('should reject non-child', () => {
      expect(isChildOID('1.3', '1.2')).toBe(false);
    });

    it('should reject same OID', () => {
      expect(isChildOID('1.2', '1.2')).toBe(false);
    });
  });

  describe('getParentOID', () => {
    it('should get parent of simple OID', () => {
      expect(getParentOID('1.2.3')).toBe('1.2');
    });

    it('should return null for root OID', () => {
      expect(getParentOID('1')).toBeNull();
    });
  });

  describe('getOIDDepth', () => {
    it('should calculate depth correctly', () => {
      expect(getOIDDepth('1')).toBe(0);
      expect(getOIDDepth('1.2')).toBe(1);
      expect(getOIDDepth('1.2.3')).toBe(2);
    });
  });

  describe('flattenTree', () => {
    it('should flatten nested tree', () => {
      const tree: OIDNode[] = [
        {
          id: '1',
          oid: '1',
          name: 'Root',
          children: [
            {
              id: '2',
              oid: '1.2',
              name: 'Child',
              children: [
                {
                  id: '3',
                  oid: '1.2.3',
                  name: 'Grandchild',
                },
              ],
            },
          ],
        },
      ];

      const flat = flattenTree(tree);
      expect(flat).toHaveLength(3);
      expect(flat.map((n) => n.id)).toEqual(['1', '2', '3']);
    });
  });

  describe('searchNodes', () => {
    const testTree: OIDNode[] = [
      {
        id: '1',
        oid: '1.2',
        name: 'Test Node',
        description: 'A test node',
        children: [
          {
            id: '2',
            oid: '1.2.3',
            name: 'Child Node',
            description: 'A child node',
          },
        ],
      },
      {
        id: '3',
        oid: '1.3',
        name: 'Another Node',
      },
    ];

    it('should find by exact OID', () => {
      const results = searchNodes(testTree, '1.2.3');
      expect(results).toHaveLength(1);
      expect(results[0].matchType).toBe('exact');
      expect(results[0].node.id).toBe('2');
    });

    it('should find by name', () => {
      const results = searchNodes(testTree, 'child');
      expect(results).toHaveLength(1);
      expect(results[0].matchType).toBe('name');
    });

    it('should find by description', () => {
      const results = searchNodes(testTree, 'A test');
      expect(results).toHaveLength(1);
      expect(results[0].matchType).toBe('description');
    });

    it('should respect case sensitivity', () => {
      const results = searchNodes(testTree, 'CHILD', { caseSensitive: true });
      expect(results).toHaveLength(0);
    });
  });

  describe('buildTreeFromFlat', () => {
    it('should build tree from flat array', () => {
      const flat: OIDNode[] = [
        { id: '1', oid: '1', name: 'Root 1' },
        { id: '2', oid: '1.2', name: 'Child 1.2' },
        { id: '3', oid: '1.2.3', name: 'Child 1.2.3' },
        { id: '4', oid: '2', name: 'Root 2' },
      ];

      const tree = buildTreeFromFlat(flat);
      expect(tree).toHaveLength(2);
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children?.[0].children).toHaveLength(1);
    });
  });
});
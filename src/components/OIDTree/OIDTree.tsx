import type { FC } from 'react';
import { useMemo, useRef, useEffect, useCallback } from 'react';
import Tree, { type RawNodeDatum, type TreeNodeDatum } from 'react-d3-tree';
import type { OIDNode } from '@/types';
import { useOIDStore } from '@/stores/oidStore';
import './OIDTree.css';

interface OIDTreeProps {
  data: OIDNode[];
  onNodeClick?: (nodeId: string) => void;
}

export const OIDTree: FC<OIDTreeProps> = ({ data, onNodeClick }) => {
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const { selectedNodeId, expandedNodes, toggleNodeExpanded } = useOIDStore();

  // Transform OID nodes to react-d3-tree format
  const treeData = useMemo(() => {
    function transformNode(node: OIDNode): RawNodeDatum {
      const isExpanded = expandedNodes.has(node.id);
      return {
        name: node.name,
        attributes: {
          id: node.id,
          oid: node.oid,
          description: node.description || '',
        },
        children: isExpanded && node.children
          ? node.children.map(transformNode)
          : [],
      };
    }

    return data.map(transformNode);
  }, [data, expandedNodes]);

  // Center the tree on mount
  useEffect(() => {
    if (treeContainerRef.current) {
      const dimensions = treeContainerRef.current.getBoundingClientRect();
      // Dimensions available for centering if needed
      void dimensions;
    }
  }, []);

  interface CustomNodeDatum extends TreeNodeDatum {
    attributes?: {
      id?: string;
      oid?: string;
      description?: string;
    };
  }

  const handleNodeClick = useCallback((node: any) => {
    const nodeId = node.data?.attributes?.id || node.attributes?.id;
    if (nodeId) {
      toggleNodeExpanded(nodeId);
      onNodeClick?.(nodeId);
    }
  }, [onNodeClick, toggleNodeExpanded]);

  const renderCustomNode = useCallback(({ nodeDatum }: { nodeDatum: CustomNodeDatum }) => {
    const nodeId = nodeDatum.attributes?.id;
    const isSelected = nodeId === selectedNodeId;
    const hasChildren = nodeId ? data.some(n => 
      n.id === nodeId && n.children && n.children.length > 0
    ) : false;
    const isExpanded = nodeId ? expandedNodes.has(nodeId) : false;

    return (
      <g>
        <circle
          r={15}
          fill={isSelected ? '#3b82f6' : '#e5e7eb'}
          stroke={isSelected ? '#1d4ed8' : '#9ca3af'}
          strokeWidth={2}
          className="node-circle"
        />
        {hasChildren && (
          <text
            fill="#6b7280"
            strokeWidth="0"
            x="0"
            y="5"
            textAnchor="middle"
            className="node-expand-indicator"
          >
            {isExpanded ? '−' : '+'}
          </text>
        )}
        <text
          fill="black"
          strokeWidth="0"
          x="0"
          y="-25"
          textAnchor="middle"
          className="node-name"
        >
          {nodeDatum.name}
        </text>
        <text
          fill="#6b7280"
          strokeWidth="0"
          x="0"
          y="-40"
          textAnchor="middle"
          className="node-oid"
          fontSize="12"
        >
          {nodeDatum.attributes?.oid}
        </text>
      </g>
    );
  }, [selectedNodeId, data, expandedNodes]);

  return (
    <div ref={treeContainerRef} className="oid-tree-container">
      {treeData.length > 0 && (
        <Tree
          data={treeData}
          orientation="vertical"
          pathFunc="step"
          separation={{ siblings: 2, nonSiblings: 2 }}
          nodeSize={{ x: 200, y: 100 }}
          translate={{ x: 400, y: 50 }}
          zoom={0.8}
          collapsible={false}
          onNodeClick={handleNodeClick}
          renderCustomNodeElement={renderCustomNode}
          pathClassFunc={() => 'tree-link'}
        />
      )}
    </div>
  );
};
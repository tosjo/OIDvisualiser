import type { FC } from 'react';
import type { OIDNode } from '@/types';
import { useOIDStore } from '@/stores/oidStore';

interface SimpleTreeProps {
  data: OIDNode[];
  onNodeClick?: (nodeId: string) => void;
}

interface TreeNodeProps {
  node: OIDNode;
  level: number;
  onNodeClick?: (nodeId: string) => void;
}

const TreeNode: FC<TreeNodeProps> = ({ node, level, onNodeClick }) => {
  const { expandedNodes, toggleNodeExpanded, selectedNodeId } = useOIDStore();
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      toggleNodeExpanded(node.id);
    }
  };

  const handleClick = () => {
    onNodeClick?.(node.id);
  };

  return (
    <div className="select-none">
      <div
        className={`
          flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded
          ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : ''}
        `}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren && (
          <button
            onClick={handleToggle}
            className="w-4 h-4 mr-2 flex items-center justify-center text-gray-600 hover:text-gray-800"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <span className="w-4 h-4 mr-2" />}
        
        <div className="flex-1 flex items-center gap-2">
          <span className="font-medium text-gray-900">{node.name}</span>
          <span className="text-sm text-gray-500 font-mono">({node.oid})</span>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const SimpleTree: FC<SimpleTreeProps> = ({ data, onNodeClick }) => {
  return (
    <div className="w-full h-full overflow-auto p-4">
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          onNodeClick={onNodeClick}
        />
      ))}
    </div>
  );
};
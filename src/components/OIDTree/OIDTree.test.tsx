import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OIDTree } from './OIDTree';
import type { OIDNode } from '@/types';

// Mock react-d3-tree since it uses D3 which doesn't work well in jsdom
vi.mock('react-d3-tree', () => ({
  default: ({ data, onNodeClick }: { data: unknown; onNodeClick: (node: { attributes: { id: string } }) => void }) => (
    <div data-testid="mock-tree">
      {JSON.stringify(data)}
      <button onClick={() => onNodeClick({ attributes: { id: 'test-id' } })}>
        Click Node
      </button>
    </div>
  ),
}));

describe('OIDTree', () => {
  const mockData: OIDNode[] = [
    {
      id: '1',
      oid: '1',
      name: 'Root',
      children: [
        {
          id: '2',
          oid: '1.2',
          name: 'Child',
        },
      ],
    },
  ];

  it('renders without crashing', () => {
    const { container } = render(<OIDTree data={mockData} />);
    expect(container.querySelector('.oid-tree-container')).toBeInTheDocument();
  });

  it('renders the tree container', () => {
    const { getByTestId } = render(<OIDTree data={mockData} />);
    expect(getByTestId('mock-tree')).toBeInTheDocument();
  });

  it('calls onNodeClick when a node is clicked', () => {
    const mockOnNodeClick = vi.fn();
    const { getByText } = render(
      <OIDTree data={mockData} onNodeClick={mockOnNodeClick} />
    );
    
    const clickButton = getByText('Click Node');
    clickButton.click();
    
    expect(mockOnNodeClick).toHaveBeenCalledWith('test-id');
  });

  it('renders empty tree when data is empty', () => {
    const { container } = render(<OIDTree data={[]} />);
    const treeContainer = container.querySelector('.oid-tree-container');
    expect(treeContainer).toBeInTheDocument();
    expect(treeContainer?.children.length).toBe(0);
  });
});
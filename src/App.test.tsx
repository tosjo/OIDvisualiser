import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock the OIDTree component since it uses D3 which doesn't work well in jsdom
vi.mock('@/components/OIDTree', () => ({
  OIDTree: () => <div data-testid="mock-oid-tree">OID Tree</div>,
}));

describe('App', () => {
  it('renders the OID Visualizer heading', () => {
    render(<App />);
    const heading = screen.getByText('OID Visualizer');
    expect(heading).toBeInTheDocument();
  });

  it('renders expand and collapse buttons', () => {
    render(<App />);
    const expandButton = screen.getByText('Expand All');
    const collapseButton = screen.getByText('Collapse All');
    expect(expandButton).toBeInTheDocument();
    expect(collapseButton).toBeInTheDocument();
  });

  it('handles expand all button click', async () => {
    const user = userEvent.setup();
    render(<App />);
    const expandButton = screen.getByText('Expand All');
    await user.click(expandButton);
    // Button should still be in the document after click
    expect(expandButton).toBeInTheDocument();
  });

  it('handles collapse all button click', async () => {
    const user = userEvent.setup();
    render(<App />);
    const collapseButton = screen.getByText('Collapse All');
    await user.click(collapseButton);
    // Button should still be in the document after click
    expect(collapseButton).toBeInTheDocument();
  });
});

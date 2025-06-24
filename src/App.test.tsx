import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the OID Visualizer heading', () => {
    render(<App />);
    const heading = screen.getByText('OID Visualizer');
    expect(heading).toBeInTheDocument();
  });

  it('renders the welcome message', () => {
    render(<App />);
    const welcome = screen.getByText('Welcome to OID Visualizer');
    expect(welcome).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';
import { useOIDStore } from '@/stores/oidStore';

vi.mock('@/stores/oidStore');

describe('SearchBar', () => {
  const mockSearch = vi.fn();
  const mockClearSearch = vi.fn();
  const mockedUseOIDStore = vi.mocked(useOIDStore);

  beforeEach(() => {
    mockedUseOIDStore.mockReturnValue({
      searchQuery: '',
      search: mockSearch,
      clearSearch: mockClearSearch,
    } as ReturnType<typeof useOIDStore>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input', () => {
    render(<SearchBar />);
    const input = screen.getByPlaceholderText(/Search by OID/i);
    expect(input).toBeInTheDocument();
  });

  it('handles search submission', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search by OID/i);
    const searchButton = screen.getByText('Search');

    await user.type(input, '2.16.528');
    await user.click(searchButton);

    expect(mockSearch).toHaveBeenCalledWith('2.16.528');
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search by OID/i);
    await user.type(input, 'test');

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(mockClearSearch).toHaveBeenCalled();
  });

  it('clears search when input is emptied', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/Search by OID/i);
    await user.type(input, 'test');
    await user.clear(input);

    expect(mockClearSearch).toHaveBeenCalled();
  });
});

import type { FC, ChangeEvent, FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { useOIDStore } from '@/stores/oidStore';

export const SearchBar: FC = () => {
  const { searchQuery, search, clearSearch } = useOIDStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    search(localQuery);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLocalQuery(e.target.value);
    // Auto-search after a short delay
    if (e.target.value === '') {
      clearSearch();
    }
  };

  const handleClear = (): void => {
    setLocalQuery('');
    clearSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={localQuery}
          onChange={handleChange}
          placeholder="Search by OID (e.g., 2.16.528.1.1003), name, or description..."
          className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search OIDs"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 mr-1 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition-colors"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};
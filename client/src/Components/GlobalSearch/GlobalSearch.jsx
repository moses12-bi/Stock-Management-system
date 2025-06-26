import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const performSearch = useCallback(
    debounce(async (term) => {
      if (!term) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(term)}`);
        setResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm, performSearch]);

  const handleResultClick = (result) => {
    // Navigate based on result type
    switch (result.type) {
      case 'product':
        navigate(`/products/${result.id}`);
        break;
      case 'order':
        navigate(`/orders/${result.id}`);
        break;
      case 'supplier':
        navigate(`/suppliers/${result.id}`);
        break;
      default:
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search products, orders, suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        {isLoading && (
          <div className="absolute right-3 top-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>

      {showResults && (searchTerm || results.length > 0) && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              {isLoading ? 'Searching...' : 'No results found'}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center space-x-3"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {result.title || result.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                    </div>
                  </div>
                  {result.metadata && (
                    <div className="text-xs text-gray-500">
                      {result.metadata}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch; 
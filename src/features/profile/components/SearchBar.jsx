import React, { useState } from 'react';
import { Box, TextField } from '@mui/material';
import { useDebounce } from '../utils/debounce';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  React.useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <Box className="p-4">
      <TextField
        label="Search users"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        placeholder="Enter username or bio..."
        variant="outlined"
      />
    </Box>
  );
};

export default SearchBar;
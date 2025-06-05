import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useSearchUsers } from '../hook/useSearchUsers';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import Spinner from '../../../components/common/Spinner/Spinner';
import useAuth from '../../auth/hooks/useAuth';
import { routeConstants } from '../../auth/constants/routeConstants';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error, refetch } = useSearchUsers(query);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate(routeConstants.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  return (
    <Box className="max-w-3xl mx-auto py-6">
      <SearchBar onSearch={setQuery} />
      {query && (
        <SearchResults
          data={data}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isLoading={isLoading}
          isError={isError}
          error={error}
          refetch={refetch}
        />
      )}
      {isLoading && !query && (
        <Box className="flex items-center justify-center min-h-screen">
          <Spinner />
        </Box>
      )}
    </Box>
  );
};

export default SearchPage;
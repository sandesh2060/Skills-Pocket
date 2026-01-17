// frontend/user/src/hooks/useJobs.js
import { useState, useEffect } from 'react';
import { getAllJobs } from '../api/jobApi';

export const useJobs = (initialFilters = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await getAllJobs(filters);
      
      if (response.success) {
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  return {
    jobs,
    loading,
    error,
    filters,
    setFilters,
    pagination,
    refetch: fetchJobs
  };
};
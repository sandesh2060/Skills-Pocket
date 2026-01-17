// ============================================
// FILE: frontend/user/src/pages/ClientHire.jsx
// ============================================
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import ClientSidebar from "../components/dashboard/client/ClientSidebar";
import ClientNavbar from "../components/dashboard/client/ClientNavbar";
import FreelancerCard from '../components/hire/FreelancerCard';
import FreelancerFilters from '../components/hire/FreelancerFilters';
import HireModal from '../components/hire/HireModal';
import FreelancerDetails from '../components/hire/FreelancerDetails';
import freelancerService from '../services/freelancerService';
import hireService from '../services/hireService';

export default function ClientHire() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Data states
  const [freelancers, setFreelancers] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [showHireModal, setShowHireModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    skills: [],
    minRate: '',
    maxRate: '',
    minRating: '',
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Fetch available skills on mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Fetch freelancers when filters or page changes
  useEffect(() => {
    fetchFreelancers();
  }, [filters, pagination.currentPage]);

  const fetchSkills = async () => {
    try {
      const response = await freelancerService.getAllSkills();
      if (response.success) {
        setAvailableSkills(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    }
  };

  const fetchFreelancers = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      // Add optional filters
      if (filters.search) params.search = filters.search;
      if (filters.skills.length > 0) params.skills = filters.skills.join(',');
      if (filters.minRate) params.minRate = filters.minRate;
      if (filters.maxRate) params.maxRate = filters.maxRate;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.location) params.location = filters.location;

      const response = await freelancerService.getFreelancers(params);

      if (response.success) {
        setFreelancers(response.data.freelancers);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to load freelancers');
      toast.error(err.message || 'Failed to load freelancers');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to page 1
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowDetailsModal(true);
  };

  const handleOpenHireModal = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setShowHireModal(true);
  };

  const handleSubmitHireRequest = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await hireService.createHireRequest(data);

      if (response.success) {
        toast.success('Hire proposal sent successfully!');
        setShowHireModal(false);
        setSelectedFreelancer(null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send hire proposal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1219]">
      <ClientSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <ClientNavbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Hire Freelancers
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Find and hire talented freelancers for your projects
                </p>
              </div>
              
              {!loading && freelancers.length > 0 && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">
                    {pagination.totalItems} freelancers found
                  </span>
                </div>
              )}
            </div>

            {/* Filters */}
            <FreelancerFilters
              onFilterChange={handleFilterChange}
              availableSkills={availableSkills}
            />

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading freelancers...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-900 dark:text-red-200">
                      Error Loading Freelancers
                    </h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                    <button
                      onClick={fetchFreelancers}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && freelancers.length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Freelancers Found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Try adjusting your filters to find more freelancers
                </p>
                <button
                  onClick={() => handleFilterChange({
                    search: '',
                    skills: [],
                    minRate: '',
                    maxRate: '',
                    minRating: '',
                    location: '',
                    sortBy: 'createdAt',
                    sortOrder: 'desc',
                  })}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Freelancers Grid */}
            {!loading && !error && freelancers.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {freelancers.map((freelancer) => (
                    <FreelancerCard
                      key={freelancer._id}
                      freelancer={freelancer}
                      onViewDetails={handleViewDetails}
                      onHire={handleOpenHireModal}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                        let page;
                        if (pagination.totalPages <= 5) {
                          page = i + 1;
                        } else if (pagination.currentPage <= 3) {
                          page = i + 1;
                        } else if (pagination.currentPage >= pagination.totalPages - 2) {
                          page = pagination.totalPages - 4 + i;
                        } else {
                          page = pagination.currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              page === pagination.currentPage
                                ? 'bg-blue-600 text-white'
                                : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="p-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedFreelancer && (
        <FreelancerDetails
          freelancer={selectedFreelancer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedFreelancer(null);
          }}
          onHire={handleOpenHireModal}
        />
      )}

      {showHireModal && selectedFreelancer && (
        <HireModal
          freelancer={selectedFreelancer}
          onClose={() => {
            setShowHireModal(false);
            setSelectedFreelancer(null);
          }}
          onSubmit={handleSubmitHireRequest}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
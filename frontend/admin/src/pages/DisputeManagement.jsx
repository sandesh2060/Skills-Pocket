// ============================================
// FILE: frontend/admin/src/pages/DisputeManagement.jsx
// ============================================
import { useState, useEffect } from 'react';
import { getAllDisputes, assignDispute, resolveDispute, updateDisputePriority } from '../api/disputeApi';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { formatDate } from '../utils/formatters';
import { toast } from 'react-hot-toast';

const DisputeManagement = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: '',
    priority: '',
    type: '',
  });
  const [pagination, setPagination] = useState({});
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionData, setResolutionData] = useState({
    decision: '',
    summary: '',
    refundAmount: 0,
  });

  useEffect(() => {
    fetchDisputes();
  }, [filters]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await getAllDisputes(filters);
      if (response.success) {
        setDisputes(response.data.disputes);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalDisputes: response.data.totalDisputes,
        });
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast.error('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (disputeId) => {
    try {
      await assignDispute(disputeId);
      toast.success('Dispute assigned successfully');
      fetchDisputes();
    } catch (error) {
      toast.error('Failed to assign dispute');
    }
  };

  const handleResolve = async () => {
    if (!resolutionData.decision || !resolutionData.summary) {
      toast.error('Please provide decision and summary');
      return;
    }

    try {
      await resolveDispute(selectedDispute._id, resolutionData);
      toast.success('Dispute resolved successfully');
      setShowResolveModal(false);
      setResolutionData({ decision: '', summary: '', refundAmount: 0 });
      fetchDisputes();
    } catch (error) {
      toast.error('Failed to resolve dispute');
    }
  };

  const handlePriorityChange = async (disputeId, priority) => {
    try {
      await updateDisputePriority(disputeId, priority);
      toast.success('Priority updated');
      fetchDisputes();
    } catch (error) {
      toast.error('Failed to update priority');
    }
  };

  const renderRow = (dispute) => (
    <tr key={dispute._id}>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{dispute.title}</div>
        <div className="text-sm text-gray-500">
          Job: {dispute.job?.title || 'N/A'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge status={dispute.type} text={dispute.type} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge status={dispute.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={dispute.priority}
          onChange={(e) => handlePriorityChange(dispute._id, e.target.value)}
          className={`text-sm border rounded px-2 py-1 ${
            dispute.priority === 'critical' ? 'border-red-500' :
            dispute.priority === 'high' ? 'border-orange-500' :
            'border-gray-300'
          }`}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">
          {dispute.raisedBy?.firstName} {dispute.raisedBy?.lastName}
        </div>
        <div className="text-xs text-gray-500">
          vs {dispute.against?.firstName} {dispute.against?.lastName}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(dispute.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center gap-2">
          {dispute.status === 'pending' && (
            <button
              onClick={() => handleAssign(dispute._id)}
              className="text-blue-600 hover:text-blue-900"
            >
              Assign
            </button>
          )}
          {(dispute.status === 'under_review' || dispute.status === 'pending') && (
            <button
              onClick={() => {
                setSelectedDispute(dispute);
                setShowResolveModal(true);
              }}
              className="text-green-600 hover:text-green-900"
            >
              Resolve
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dispute Management</h1>
        <p className="text-gray-500 mt-1">Resolve disputes between users</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="escalated">Escalated</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="payment">Payment</option>
            <option value="quality">Quality</option>
            <option value="delivery">Delivery</option>
            <option value="communication">Communication</option>
            <option value="other">Other</option>
          </select>
          <button
            onClick={() => setFilters({ page: 1, limit: 20, status: '', priority: '', type: '' })}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table
          headers={['Dispute', 'Type', 'Status', 'Priority', 'Parties', 'Created', 'Actions']}
          data={disputes}
          renderRow={renderRow}
          loading={loading}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => {
          setShowResolveModal(false);
          setResolutionData({ decision: '', summary: '', refundAmount: 0 });
        }}
        title="Resolve Dispute"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Dispute Details</h4>
            <p className="text-sm text-gray-600">{selectedDispute?.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision
            </label>
            <select
              value={resolutionData.decision}
              onChange={(e) => setResolutionData({ ...resolutionData, decision: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select decision</option>
              <option value="favor_client">In Favor of Client</option>
              <option value="favor_freelancer">In Favor of Freelancer</option>
              <option value="partial">Partial Resolution</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resolution Summary
            </label>
            <textarea
              value={resolutionData.summary}
              onChange={(e) => setResolutionData({ ...resolutionData, summary: e.target.value })}
              rows={4}
              placeholder="Explain your decision..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {(resolutionData.decision === 'favor_client' || resolutionData.decision === 'partial') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Amount ($)
              </label>
              <input
                type="number"
                value={resolutionData.refundAmount}
                onChange={(e) => setResolutionData({ ...resolutionData, refundAmount: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => {
                setShowResolveModal(false);
                setResolutionData({ decision: '', summary: '', refundAmount: 0 });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Resolve Dispute
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DisputeManagement;

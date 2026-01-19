
// ============================================
// FILE: frontend/admin/src/components/common/Badge.jsx
// ============================================
import { STATUS_COLORS } from '../../utils/constants';

const Badge = ({ status, text }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {text || status}
    </span>
  );
};

export default Badge;
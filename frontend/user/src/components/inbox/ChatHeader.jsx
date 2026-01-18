// ============================================
// FILE: frontend/user/src/components/inbox/ChatHeader.jsx
// ============================================
import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from '../../context/SocketContext';

export default function ChatHeader({ otherUser, onBack }) {
  const { isUserOnline } = useSocket();
  const isOnline = isUserOnline(otherUser?._id);

  const getStatusText = () => {
    if (isOnline) return 'Online';
    if (otherUser?.lastLogin) {
      try {
        return `Last seen ${formatDistanceToNow(new Date(otherUser.lastLogin), { addSuffix: true })}`;
      } catch {
        return 'Offline';
      }
    }
    return 'Offline';
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <div className="flex items-center gap-4">
        {/* Back button for mobile */}
        <button
          onClick={onBack}
          className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Avatar */}
        <div className="relative">
          {otherUser?.profilePicture?.url ? (
            <img
              src={otherUser.profilePicture.url}
              alt={`${otherUser.firstName} ${otherUser.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
            </div>
          )}
          
          {/* Online indicator */}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          )}
        </div>

        {/* User Info */}
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">
            {otherUser?.firstName} {otherUser?.lastName}
          </h3>
          <p className={`text-sm ${
            isOnline 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-slate-500 dark:text-slate-400'
          }`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Voice call"
        >
          <Phone className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="Video call"
        >
          <Video className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title="More options"
        >
          <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>
    </div>
  );
}
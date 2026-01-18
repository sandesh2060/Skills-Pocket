// ============================================
// FILE: frontend/user/src/components/inbox/MessageBubble.jsx
// ============================================
import { format } from 'date-fns';
import { Check, CheckCheck, Download, FileText, Image as ImageIcon } from 'lucide-react';

export default function MessageBubble({ message, isOwn, showAvatar, otherUser }) {
  const formatTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'HH:mm');
    } catch {
      return '';
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  const renderAttachment = (attachment) => {
    const isImage = attachment.fileType?.startsWith('image');

    if (isImage) {
      return (
        <div className="mb-2">
          <a
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block max-w-xs rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img
              src={attachment.url}
              alt={attachment.fileName}
              className="w-full h-auto"
            />
          </a>
        </div>
      );
    }

    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-2 p-3 rounded-lg border mb-2 hover:bg-opacity-80 transition-colors ${
          isOwn
            ? 'bg-blue-500/20 border-blue-400/30'
            : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
        }`}
      >
        {getFileIcon(attachment.fileType)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.fileName}</p>
          {attachment.size && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {(attachment.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>
        <Download className="w-4 h-4 flex-shrink-0" />
      </a>
    );
  };

  return (
    <div className={`flex gap-2 mb-4 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          {otherUser?.profilePicture?.url ? (
            <img
              src={otherUser.profilePicture.url}
              alt={`${otherUser.firstName} ${otherUser.lastName}`}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
              {otherUser?.firstName?.[0]}{otherUser?.lastName?.[0]}
            </div>
          )}
        </div>
      )}
      {showAvatar && isOwn && <div className="w-8" />}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-sm'
          }`}
        >
          {/* Attachments */}
          {message.attachments?.length > 0 && (
            <div className="mb-1">
              {message.attachments.map((attachment, index) => (
                <div key={index}>{renderAttachment(attachment)}</div>
              ))}
            </div>
          )}

          {/* Text */}
          {message.text && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.text}
            </p>
          )}
        </div>

        {/* Time and Status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${
          isOwn ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatTime(message.createdAt)}
          </span>
          
          {isOwn && (
            <div className="text-slate-500 dark:text-slate-400">
              {message.isRead ? (
                <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Spacer for alignment */}
      {!showAvatar && <div className="w-8" />}
    </div>
  );
}
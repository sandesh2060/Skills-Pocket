// ============================================
// FILE: frontend/user/src/components/inbox/TypingIndicator.jsx
// ============================================
export default function TypingIndicator({ otherUser }) {
  return (
    <div className="flex gap-2 mb-4">
      {/* Avatar */}
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

      {/* Typing Animation */}
      <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
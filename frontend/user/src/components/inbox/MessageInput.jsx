// ============================================
// FILE: frontend/user/src/components/inbox/MessageInput.jsx
// ============================================
import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from 'react-hot-toast';
import messageService from '../../services/messageService';

export default function MessageInput({ 
  onSendMessage, 
  onTyping, 
  onStopTyping, 
  disabled = false 
}) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTyping?.();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onStopTyping?.();
    }, 2000);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file size (max 10MB per file)
    const maxSize = 10 * 1024 * 1024;
    const invalidFiles = files.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      toast.error('Files must be less than 10MB');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const result = await messageService.uploadFile(file);
        return result.data;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setAttachments((prev) => [...prev, ...uploadedFiles]);
      toast.success('Files uploaded successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to upload files');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!message.trim() && attachments.length === 0) return;
    if (disabled || uploading) return;

    const messageData = {
      text: message.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    onSendMessage(messageData);
    setMessage('');
    setAttachments([]);
    setIsTyping(false);
    onStopTyping?.();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              {getFileIcon(attachment.fileType)}
              <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                {attachment.fileName}
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* Attach File Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 text-slate-600 dark:text-slate-400 animate-spin" />
          ) : (
            <Paperclip className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Text Input */}
        <div className="flex-1 relative">
          <TextareaAutosize
            value={message}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={disabled}
            minRows={1}
            maxRows={5}
            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || uploading || (!message.trim() && attachments.length === 0)}
          className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
}
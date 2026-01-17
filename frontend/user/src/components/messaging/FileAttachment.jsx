
// ============================================
// FILE: frontend/user/src/components/messaging/FileAttachment.jsx
// ============================================
import React, { useRef } from 'react';
import { formatFileSize } from '../../utils/helpers';

export default function FileAttachment({ onFileSelect, maxSize = 5, allowedTypes = ['image/*', 'application/pdf'] }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const isValidType = allowedTypes.some(type => {
      if (type.includes('*')) {
        const [category] = type.split('/');
        return file.type.startsWith(category);
      }
      return file.type === type;
    });

    if (!isValidType) {
      alert('Invalid file type');
      return;
    }

    onFileSelect(file);
    e.target.value = ''; // Reset input
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="p-2 text-[#4c739a] hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
        title="Attach file"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
        </svg>
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes.join(',')}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
}

// File Preview Component
export function FilePreview({ file, onRemove }) {
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      );
    }
    
    if (type === 'application/pdf') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
        </svg>
      );
    }

    return (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    );
  };

  const isImage = file.type.startsWith('image/');
  const previewUrl = isImage ? URL.createObjectURL(file) : null;

  return (
    <div className="relative inline-flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-[#e7edf3] dark:border-slate-700">
      {/* Preview/Icon */}
      <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
        {isImage && previewUrl ? (
          <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-primary">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#0d141b] dark:text-white truncate">
          {file.name}
        </p>
        <p className="text-xs text-[#4c739a] dark:text-slate-400">
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
  );
}
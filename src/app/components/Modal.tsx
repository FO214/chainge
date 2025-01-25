'use client';

import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Modal.css'; // Import a CSS file for custom styles

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, content }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-surface p-12 rounded-lg shadow-lg max-w-4xl w-full"> {/* Increased padding and max-width */}
        <h2 className="text-3xl font-semibold mb-6">{title}</h2>
        <div className="max-w-full max-h-96 overflow-y-scroll p-6 markdown"> {/* Adjusted max-width for content */}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || 'No content available.'}
          </ReactMarkdown>
        </div>
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-full bg-red-500 text-background font-semibold hover:bg-red-600 transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

import React from 'react';
import { Citation } from '../types';

interface MessageReferenceProps {
  reference: Citation;
  index: number;
  referencesRef: React.RefObject<(HTMLLIElement | null)[]>;
}

const MessageReference: React.FC<MessageReferenceProps> = ({ reference, index, referencesRef }) => {
  const fileInfo = reference.references?.[0]?.file;
  const fileName = fileInfo?.name || 'Unknown File';
  const fileUrl = fileInfo?.signed_url || '#';
  const pageNumber = reference.references?.[0]?.pages?.[0] || 'N/A';

  return (
    <div 
      ref={el => referencesRef.current && (referencesRef.current[index] = el as unknown as HTMLLIElement)} 
      id={`ref-${index + 1}`}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 hover:shadow-lg transition-shadow duration-200 flex items-center text-xs"
    >
      <div className="mr-2 font-bold text-blue-600 dark:text-blue-400">
        [{index + 1}]
      </div>
      <a 
        href={`${fileUrl}${pageNumber !== 'N/A' ? `#page=${pageNumber}` : ''}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline flex flex-col flex-grow"
      >
        <span className="font-medium text-blue-600 dark:text-blue-400 truncate">{fileName}</span>
        {pageNumber !== 'N/A' && (
          <span className="text-gray-500 dark:text-gray-400">Page {pageNumber}</span>
        )}
      </a>
    </div>
  );
};

export default MessageReference;
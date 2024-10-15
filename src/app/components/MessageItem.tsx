import React from 'react';
import { Message, MessagePart, Citation } from '../types';
import CitationMark from './CitationMark';
import MessageReference from './MessageReference';

interface MessageItemProps {
  message: Message;
  referencesRef: React.RefObject<(HTMLLIElement | null)[]>;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, referencesRef }) => {
  const renderMessagePart = (part: MessagePart, index: number) => {
    if (part.type === 'text') {
      return (
        <span key={index} className="whitespace-pre-wrap">{part.content}</span>
      );
    } else if (part.type === 'citation') {
      return (
        <CitationMark key={index} num={(part.citationIndex! + 1).toString()} referencesRef={referencesRef} />
      );
    }
    return null;
  };

  return (
    <div className={`mb-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
          {message.role === 'user' ? (
            <span className="text-2xl">👤</span>
          ) : (
            <a href="https://www.pinecone.io/blog/pinecone-assistant/" target="_blank" rel="noopener noreferrer">
              <img
                src="/pinecone-logo.png"
                alt="Pinecone Assistant"
                className="w-6 h-6 rounded-full object-cover"
              />
            </a>
          )}
        </div>
        <div className={`inline-block p-2 rounded-lg ${
          message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
        } max-w-[80%]`}>
          <div className="whitespace-pre-wrap">
            {message.parts.map((part, index) => renderMessagePart(part, index))}
          </div>
          
          {message.references && message.references.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold mb-1 text-sm">References:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
                {message.references.map((ref: Citation, index) => (
                  <MessageReference 
                    key={index}
                    reference={ref}
                    index={index}
                    referencesRef={referencesRef}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
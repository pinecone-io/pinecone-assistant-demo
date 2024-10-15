import React from 'react';
import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  referencesRef: React.RefObject<(HTMLLIElement | null)[]>;
  
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef, referencesRef }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-4 h-[calc(100vh-350px)] overflow-y-auto">
      {messages.filter(message => message.parts.some(part => part.content.trim() !== '')).map((message, index) => (
        <MessageItem 
          key={index} 
          message={message} 
          referencesRef={referencesRef}           
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
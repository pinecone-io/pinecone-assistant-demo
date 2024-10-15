import React, { useState, useRef, useCallback } from 'react';
import { Message, MessagePart } from '../types';
import MessageList from './MessageList';
import InputForm from './InputForm';
import { chat } from '../actions';
import { readStreamableValue } from 'ai/rsc';
import { v4 as uuidv4 } from 'uuid';

interface ChatInterfaceProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  setMessages,
  isStreaming,
  setIsStreaming,
  setError
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const referencesRef = useRef<(HTMLLIElement | null)[]>([]);

  const handleChat = useCallback(async (newUserMessage: Message) => {
    setIsStreaming(true);
    let currentParts: MessagePart[] = [];

    try {
      const { object } = await chat([{ role: newUserMessage.role, content: newUserMessage.parts[0].content }]);
      let newAssistantMessage: Message | null = null;

      for await (const chunk of readStreamableValue(object)) {
        const data = JSON.parse(chunk);
        switch (data.type) {
          // Start of a new message
          case 'start':
            // Create a new message object
            newAssistantMessage = {
              id: uuidv4(),
              role: 'assistant',
              parts: [],
              timestamp: new Date().toISOString(),
              references: []
            };
            setMessages(prevMessages => [...prevMessages, newAssistantMessage!]);
            break;
          // Content of the message
          case 'content':
            // Add the content to the current parts
            // If the current parts array is empty or the last part is not a text part, add a new text part
            if (currentParts.length === 0 || currentParts[currentParts.length - 1].type !== 'text') {
              currentParts.push({ type: 'text', content: data.content });
            } else {
              currentParts[currentParts.length - 1].content += data.content;
            }
            // Update the message with the new parts
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.parts = [...currentParts];
              }
              return updatedMessages;
            });
            break;
          // Citation in the message
          case 'citation':
            // Add the citation to the current parts  
            const citationIndex = newAssistantMessage!.references!.length;
            currentParts.push({ type: 'citation', content: '', citationIndex });
            // Add the citation to the message
            newAssistantMessage!.references!.push(data.citation);
            // Update the message with the new parts and references
            setMessages(prevMessages => {
              const updatedMessages = [...prevMessages];
              const lastMessage = updatedMessages[updatedMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.parts = [...currentParts];
                lastMessage.references = [...newAssistantMessage!.references!];
              }
              return updatedMessages;
            });
            break;
        }
      }
    } catch (error) {
      console.error('Error in chat:', error);
      setError('An error occurred while chatting.');
    } finally {
      setIsStreaming(false);
    }
  }, [chat, setMessages, setIsStreaming, setError]);

  const handleSendMessage = useCallback(() => {
    if (!input.trim()) return;

    const newUserMessage: Message = {
      id: uuidv4(),
      role: 'user',
      parts: [{ type: 'text', content: input }],
      timestamp: new Date().toISOString()
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');
    handleChat(newUserMessage);
  }, [input, handleChat, setMessages]);

  return (
    <div className="w-full">
      <MessageList 
        messages={messages} 
        messagesEndRef={messagesEndRef} 
        referencesRef={referencesRef} 
      />
      <InputForm 
        input={input} 
        setInput={setInput} 
        handleSendMessage={handleSendMessage} 
        isStreaming={isStreaming} 
      />
    </div>
  );
};

export default ChatInterface;
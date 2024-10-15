import React from 'react';

interface InputFormProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  isStreaming: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ input, setInput, handleSendMessage, isStreaming }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex mb-4">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
        placeholder="Type your message..."
        disabled={isStreaming}
      />
      <button
        type="submit"
        className="bg-indigo-500 text-white p-2 rounded-r-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        disabled={isStreaming}
      >
        {isStreaming ? 'Streaming...' : 'Send'}
      </button>
    </form>
  );
};

export default InputForm;
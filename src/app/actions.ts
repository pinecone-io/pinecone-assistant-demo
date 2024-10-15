'use server'

import { createStreamableValue } from 'ai/rsc'
import { EventSource } from 'extended-eventsource';

type Message = {
  role: string;
  content: string;
}

export async function chat(messages: Message[]) {
  // Create a streamable value to hold the stream of data
  const stream = createStreamableValue()
  const url = `${process.env.PINECONE_ASSISTANT_URL}/assistant/chat/${process.env.PINECONE_ASSISTANT_NAME}`
  
  // Create a new EventSource object to handle the streaming response
  const eventSource = new EventSource(url, {
    method: 'POST',
    body: JSON.stringify({
      messages,
      stream: true,
      model: 'gpt-4o',
    }),
    headers: {
      'Api-Key': process.env.PINECONE_API_KEY!,
      'Content-Type': 'application/json',
    },
    disableRetry: true,
  });

  // Listen for messages from the Assistant
  eventSource.onmessage = (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        // The Assistant has started sending a message
        case 'message_start':
          stream.update(JSON.stringify({ type: 'start' }));
          break;
        // The Assistant is sending a chunk of the message
        case 'content_chunk':
          if (data.delta?.content) {
            // Update the stream with the chunk of the message
            stream.update(JSON.stringify({ type: 'content', content: data.delta.content }));
          }
          break;
        // The Assistant is sending a citation
        case 'citation':          
          // Update the stream with the citation
          stream.update(JSON.stringify({ type: 'citation', citation: data.citation }));
          break;
        // The Assistant has finished sending a message
        case 'message_end':
          if (data.finish_reason === 'stop') {
            // Update the stream to indicate the end of the message
            stream.update(JSON.stringify({ type: 'end' }));
            eventSource.close();
            stream.done();
          }
          break;
        default:
          console.warn('Unexpected message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('EventSource error:', error);
    eventSource.close();
    stream.error(error);
  };

  return { object: stream.value }
}
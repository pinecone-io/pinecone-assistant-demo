export interface File {
    id: string;
    name: string;
    size: number;
    created_on: string;
    updated_on: string;
    signed_url: string;
    status: string;
    metadata: any | null;
    percent_done: number;
}

// A 'Reference' is a file that the Assistant has access to and used 
// when answering a user question
export interface Reference {
    file: File;
    pages?: number[];
}

export interface Citation {
    references: Array<{
        file: {
            name: string;
            signed_url: string;
        };
        pages: number[];
    }>;
}

export interface MessagePart {
  type: 'text' | 'citation';
  content: string;
  citationIndex?: number;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    parts: MessagePart[];
    timestamp: string;
    references?: Citation[];
}

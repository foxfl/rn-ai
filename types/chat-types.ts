export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
}

export interface Chat {
  id: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

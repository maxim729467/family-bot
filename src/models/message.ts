export enum Role {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export default interface Message {
  content: string;
  role: Role;
  userId: string;
  createdAt: number;
}

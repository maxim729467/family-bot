enum Role {
  'user',
  'assistant',
}

export default interface Message {
  content: string;
  role: Role;
  userId: string;
  createdAt: number;
}

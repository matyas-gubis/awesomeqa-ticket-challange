import { Status } from "../interfaces/filter";

export type Ticket = {
  id: string;
  message: Message;
  status: Status;
  context_messages: Array<Message>;
  timestamp: Date;
  last_status_change?: Date;
};

export type Message = {
  id: string;
  author: Author;
  timestamp: Date;
  content: string;
  url: string;
};

export type Author = {
  id: string;
  name: string;
  avatar: string;
  color: string;
};

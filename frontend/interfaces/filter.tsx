export interface Filters {
  usernames?: Array<string>;
  status?: Status;
  date?: CustomDate;
}

export enum Status {
  OPEN = "open",
  CLOSED = "closed",
  BOTH = "both",
}

interface CustomDate {
  start?: string;
  end?: string;
}

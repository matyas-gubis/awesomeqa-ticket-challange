export interface Filters {
  usernames?: Array<string>;
  status?: Status;
  date?: CustomDate;
  sorting?: SortBy;
}

export interface SortBy {
  field_name?: FieldNames;
  reversed: Boolean;
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

export enum FieldNames {
  USERNAME = "username",
  STATUS = "status",
  DATE = "date",
}

export interface SortingOption {
  id: number;
  name: string;
  sorting: SortBy;
}

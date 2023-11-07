import {
  FieldNames,
  Filters,
  SortingOption,
  Status,
} from "../interfaces/filter";

export const sortingOptions: Array<SortingOption> = [
  {
    id: 1,
    name: "Username (a to z)",
    sorting: { field_name: FieldNames.USERNAME, reversed: false },
  },
  {
    id: 2,
    name: "Username (z to a)",
    sorting: { field_name: FieldNames.USERNAME, reversed: true },
  },
  {
    id: 3,
    name: "Newest first",
    sorting: { field_name: FieldNames.DATE, reversed: true },
  },
  {
    id: 4,
    name: "Oldest first",
    sorting: { field_name: FieldNames.DATE, reversed: false },
  },
  {
    id: 5,
    name: "Closed first",
    sorting: { field_name: FieldNames.STATUS, reversed: false },
  },
  {
    id: 6,
    name: "Open first",
    sorting: { field_name: FieldNames.STATUS, reversed: true },
  },
];

export const getSortingOptionById = (id: number) => {
  return sortingOptions.find((m) => m.id === id);
};

export const emptyFilter: Filters = {
  usernames: [],
  status: Status.BOTH,
  date: {
    start: null,
    end: null,
  },
  sorting: getSortingOptionById(3).sorting,
};

export const ticketsPerPage: Array<number> = [1, 5, 10, 20, 50, 100];

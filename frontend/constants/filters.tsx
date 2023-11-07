import { Filters, Status } from "../interfaces/filter";

export const emptyFilter: Filters = {
  usernames: [],
  status: Status.BOTH,
  date: {
    start: null,
    end: null,
  },
};

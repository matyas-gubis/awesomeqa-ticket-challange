import { AlertColor } from "@mui/material";

interface SnackBar {
  id: number;
  severity: AlertColor;
  message: string;
  open: boolean;
}

export const snackBars: Array<SnackBar> = [
  {
    id: 1,
    severity: "success",
    message: "Ticket closed succesfully!",
    open: true,
  },
  {
    id: 2,
    severity: "error",
    message: "Ooops, something went wrong. The ticket couldn't be closed!",
    open: true,
  },
  {
    id: 3,
    severity: "success",
    message: "Ticket deleted succesfully!",
    open: true,
  },
  {
    id: 4,
    severity: "error",
    message: "Ooops, something went wrong. The ticket couldn't be deleted!",
    open: true,
  },
  {
    id: 5,
    severity: "success",
    message: "Ticket opened succesfully!",
    open: true,
  },
  {
    id: 6,
    severity: "error",
    message: "Ooops, something went wrong. The ticket couldn't be opened!",
    open: true,
  },
];

export const getSnackBarById = (id: number) => {
  return snackBars.find((s) => s.id === id);
};

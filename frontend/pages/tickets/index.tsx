import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import MessageCard from "../../components/MessageCard";
import axios from "axios";
import { DateTimePicker } from "@mui/x-date-pickers";
import Filter from "../../components/Filter";
import { emptyFilter } from "../../constants/filters";

const tickets = () => {
  const [tickets, setTickets] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState(emptyFilter);
  const theme = useTheme();
  const dummies = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ];

  useEffect(() => {
    if (tickets) return;
    loadTickets();
  }, [tickets]);

  useEffect(() => {
    console.log("filter changed", filter);
  }, [filter]);

  function getUsernames() {
    fetch("http://localhost:5001/users/usernames")
      .then((r) => r.json())
      .then((result) => setUsers(result))
      .catch((err) => console.warn(err));
  }

  function loadTickets(page = 1, filters = filter) {
    axios
      .post(
        `http://localhost:5001/tickets/details?start=${
          pageSize * (page - 1)
        }&limit=${pageSize}`,
        filters
      )
      .then((result) => {
        setTickets(result.data.tickets);
        setTicketQuantity(result.data.ticket_quantity);
      })
      .then(getUsernames);
  }

  function handlePageTurn(event: ChangeEvent<unknown>, page: number): void {
    setCurrentPage(page);
    loadTickets(page, filter);
  }

  return (
    <Box mt={5}>
      <Filter
        filter={filter}
        setFilter={setFilter}
        users={users}
        loadTickets={loadTickets}
      ></Filter>
      {tickets && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(ticketQuantity / pageSize)}
            color="secondary"
            showFirstButton
            showLastButton
            page={currentPage}
            onChange={handlePageTurn}
          ></Pagination>
        </Box>
      )}
      <Grid container spacing={2} my={3}>
        {tickets
          ? tickets.map((ticket) => (
              <Grid item xs={12} key={ticket.id}>
                <MessageCard
                  ticket={ticket}
                  ticketLoader={loadTickets}
                ></MessageCard>
              </Grid>
            ))
          : dummies.map((dummy) => (
              <Grid item xs={12} key={dummy.id}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  height={240}
                  sx={{
                    borderRadius: 1,
                  }}
                />
              </Grid>
            ))}
      </Grid>
      {tickets && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.round(ticketQuantity / pageSize)}
            color="secondary"
            showFirstButton
            showLastButton
            page={currentPage}
            onChange={handlePageTurn}
          ></Pagination>
        </Box>
      )}
    </Box>
  );
};

export default tickets;

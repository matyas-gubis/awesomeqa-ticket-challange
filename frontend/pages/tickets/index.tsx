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
  const [ticketPerPage, setTicketPerPage] = useState(20);
  const [filter, setFilter] = useState(emptyFilter);
  const [search, setSearch] = useState("");
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
    loadTickets();
    console.log(filter, ticketPerPage);
  }, [filter, ticketPerPage, currentPage, search]);

  function loadTickets() {
    axios
      .post(
        `http://localhost:5001/tickets/details?start=${
          ticketPerPage * (currentPage - 1)
        }&limit=${ticketPerPage}&search=${search}`,
        filter
      )
      .then((result) => {
        console.log(result.data);
        setTickets(result.data.tickets);
        setTicketQuantity(result.data.ticket_quantity);
      });
  }

  return (
    <Box mt={5}>
      <Filter
        filter={filter}
        setFilter={setFilter}
        loadTickets={loadTickets}
        pageSize={ticketPerPage}
        setPageSize={setTicketPerPage}
        search={{ search, setSearch }}
      ></Filter>

      {/* Pagination */}
      {tickets && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(ticketQuantity / ticketPerPage)}
            color="secondary"
            showFirstButton
            showLastButton
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
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

      {/* Pagination */}
      {tickets && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.ceil(ticketQuantity / ticketPerPage)}
            color="secondary"
            showFirstButton
            showLastButton
            page={currentPage}
            onChange={(e, page) => setCurrentPage(page)}
          ></Pagination>
        </Box>
      )}
    </Box>
  );
};

export default tickets;

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

const tickets = () => {
  const [tickets, setTickets] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [users, setUsers] = useState([]);
  const emptyFilter = {
    usernames: [],
    status: "both",
    date: {
      start: null,
      end: null,
    },
  } as Filters;
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

  const ContainedSecondaryToggleButton = styled(ToggleButton)(({ theme }) => ({
    color: theme.palette.secondary.main,
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.secondary.main,
    },
    "&.Mui-selected:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  }));

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
      <Container
        maxWidth="sm"
        sx={{
          border: `1px solid ${theme.palette.secondary.main}`,
          borderRadius: "8px",
          p: 3,
          mb: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 5,
            // borderBottom: "1px solid " + theme.palette.primary.main,
          }}
        >
          Filters
        </Typography>
        <Box display="flex">
          <FormControl>
            <FormGroup sx={{ alignContent: "center" }}>
              <FormLabel sx={{ mb: 1, textAlign: "center" }}>
                Ticket status:
              </FormLabel>
              <ToggleButtonGroup
                color="secondary"
                value={filter.status}
                defaultValue="both"
                exclusive
                onChange={(e, v) => {
                  setFilter({ ...filter, status: v });
                }}
                aria-label="Ticket status"
                sx={{ mb: 2 }}
              >
                <ContainedSecondaryToggleButton value="open">
                  Open
                </ContainedSecondaryToggleButton>
                <ContainedSecondaryToggleButton value="closed">
                  Closed
                </ContainedSecondaryToggleButton>
                <ContainedSecondaryToggleButton value="both">
                  Both
                </ContainedSecondaryToggleButton>
              </ToggleButtonGroup>
            </FormGroup>
            {
              <Autocomplete
                id="tags-standard"
                multiple
                options={users}
                value={filter.usernames}
                onChange={(event, value) => {
                  setFilter({ ...filter, usernames: value });
                }}
                sx={{
                  minWidth: {
                    xs: "100%",
                    sm: "250px",
                  },
                  maxWidth: "510px",
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Usernames"
                    placeholder="Favorites"
                    color="secondary"
                  />
                )}
              />
            }
            <FormGroup sx={{ alignItems: "center", mb: 4 }}>
              <FormLabel sx={{ mb: 1, mt: 2 }}>Date</FormLabel>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1 }}
              >
                <DateTimePicker
                  label="Start date"
                  value={filter.date.start}
                  onChange={(newValue: any) => {
                    setFilter({
                      ...filter,
                      date: {
                        ...filter.date,
                        start: newValue.format("YYYY-MM-DD HH:mm:ss"),
                      },
                    });
                  }}
                />
                <DateTimePicker
                  label="End date"
                  value={filter.date.end}
                  onChange={(newValue: any) => {
                    setFilter({
                      ...filter,
                      date: {
                        ...filter.date,
                        end: newValue.format("YYYY-MM-DD HH:mm:ss"),
                      },
                    });
                  }}
                />
              </Stack>
            </FormGroup>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setFilter(emptyFilter);
                  loadTickets(1, emptyFilter);
                }}
              >
                Reset filters
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => loadTickets(1, filter)}
              >
                Filter tickets
              </Button>
            </Stack>
          </FormControl>
        </Box>
      </Container>
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

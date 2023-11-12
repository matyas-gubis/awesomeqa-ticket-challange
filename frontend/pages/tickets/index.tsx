import React, { useEffect, useState } from "react";
import { Box, Grid, Pagination, Skeleton, Typography } from "@mui/material";
import MessageCard from "../../components/MessageCard";
import axios from "axios";
import Filter from "../../components/Filter";
import { emptyFilter } from "../../constants/filters";
import { Ticket } from "../../types/ticket";

const tickets = () => {
  const [tickets, setTickets] = useState<Array<Ticket>>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketPerPage, setTicketPerPage] = useState(20);
  const [filter, setFilter] = useState(emptyFilter);
  const [search, setSearch] = useState("");
  let timer;
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
        let newTickets: Array<Ticket> = [];
        result.data.tickets.forEach((ticket) =>
          newTickets.push({ ...ticket, timestamp: new Date(ticket.timestamp) })
        );
        console.log(newTickets);
        setTickets(newTickets);
        setTicketQuantity(result.data.ticket_quantity);
        if (
          currentPage > Math.ceil(result.data.ticket_quantity / ticketPerPage)
        ) {
          setCurrentPage(1);
        }
      });
  }

  return (
    <Grid container spacing={2} mt={5}>
      <Grid item lg={4}>
        <Filter
          filter={filter}
          setFilter={setFilter}
          loadTickets={loadTickets}
          pageSize={ticketPerPage}
          setPageSize={setTicketPerPage}
          search={{ search, setSearch }}
        ></Filter>
      </Grid>
      <Grid item lg={8}>
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

        <Grid
          container
          spacing={2}
          my={3}
          p={3}
          sx={{ maxHeight: "60vh", overflow: "auto" }}
        >
          {tickets
            ? tickets.map((ticket) => (
                <Grid item xs={12} key={ticket.id}>
                  <MessageCard
                    ticket={ticket}
                    ticketLoader={loadTickets}
                    search={search}
                    filter={{ filter, setFilter }}
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
          {tickets && tickets.length == 0 && (
            <Typography variant="h4" align="center" mx="auto">
              No tickets were found with the given filters.
            </Typography>
          )}
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
      </Grid>
    </Grid>
  );
};

export default tickets;

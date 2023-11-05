import React, { ChangeEvent, useEffect, useState } from "react";
import { Box, Grid, Pagination, Skeleton } from "@mui/material";
import MessageCard from "../../components/MessageCard";

const tickets = () => {
  const [tickets, setTickets] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
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
    fetchAmountOfTickets();
  }, [tickets]);

  function loadTickets(page = 1) {
    fetch(
      `http://localhost:5001/tickets/details?start=${
        pageSize * (page - 1)
      }&limit=${pageSize}`
    )
      .then((res) => res.json())
      .then((result) => {
        setTickets(result);
        console.log(result);
      });
  }

  function fetchAmountOfTickets() {
    fetch("http://localhost:5001/tickets/amount")
      .then((res) => res.json())
      .then((result) => setPageCount(result));
  }

  function handlePageTurn(event: ChangeEvent<unknown>, page: number): void {
    setCurrentPage(page);
    loadTickets(page);
  }

  return (
    <Box mt={5}>
      {tickets && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Math.round(pageCount / pageSize)}
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
            count={Math.round(pageCount / pageSize)}
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

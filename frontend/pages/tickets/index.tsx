import React, { useEffect, useState } from "react";
import { Box, Grid, Pagination, Skeleton } from "@mui/material";
import MessageCard from "../../components/MessageCard";

const tickets = () => {
  const [tickets, setTickets] = useState(null);
  useEffect(() => {
    if (tickets) return;
    loadTickets();
  }, [tickets]);

  function loadTickets() {
    fetch("http://localhost:5001/tickets/details")
      .then((res) => res.json())
      .then((result) => {
        setTickets(result);
        console.log(result);
      });
  }

  return (
    <Box>
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
          : [{}, {}, {}, {}, {}, {}].map((dummy) => (
              <Grid item xs={12}>
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
            count={tickets.length / 20}
            color="secondary"
          ></Pagination>
        </Box>
      )}
    </Box>
  );
};

export default tickets;

import React, { SyntheticEvent, useState } from "react";
import {
  Alert,
  AlertColor,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LaunchOutlinedIcon from "@mui/icons-material/LaunchOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import axios from "axios";
import { getSnackBarById } from "../../constants/snackBars";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Message } from "../../types/ticket";

const MessageCard = ({ ticket, ticketLoader, search }) => {
  const message: Message = ticket.message;
  const theme = useTheme();
  const [snackBar, setSnackBar] = useState({
    open: false,
    severity: "success" as AlertColor,
    message: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [relatedMessagesOpen, setRelatedMessagesOpen] = useState(false);

  const handleDone = () => {
    let pending = true;
    axios
      .patch(`http://localhost:5001/tickets/close/${ticket.id}`)
      .then((result) => {
        console.log(result);
        if (result.data == true) {
          pending = false;
          setSnackBar(getSnackBarById(1));
          ticketLoader();
          return;
        }
        pending = false;
        setSnackBar(getSnackBarById(2));
      });
  };

  function handleSnackBarClose(event: Event | SyntheticEvent): void {
    setSnackBar({ ...snackBar, open: false });
  }

  function handleReopen(): void {
    axios
      .patch(`http://localhost:5001/tickets/open/${ticket.id}`)
      .then((result) => {
        let pending = true;
        console.log(result);
        if (result.data == true) {
          pending = false;
          setSnackBar(getSnackBarById(5));
          ticketLoader();
          return;
        }
        pending = false;
        setSnackBar(getSnackBarById(6));
      });
  }

  function handleDeletion(): void {
    axios
      .delete(`http://localhost:5001/tickets/delete/${ticket.id}`)
      .then((result) => {
        let pending = true;
        console.log(result);
        if (result.data == true) {
          pending = false;
          setSnackBar(getSnackBarById(3));
          setDialogOpen(false);
          ticketLoader();
          return;
        }
        pending = false;
        setSnackBar(getSnackBarById(4));
      });
  }

  function handleRelatedMessagesOpen(): void {
    setRelatedMessagesOpen(!relatedMessagesOpen);
    const anchor = document.getElementById(ticket.id);

    if (anchor) {
      anchor.scrollIntoView({
        block: "start",
      });
    }
  }

  return (
    <Box
      id={ticket.id}
      key={ticket.id}
      component="section"
      sx={{
        p: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        height: "100%",
        gap: "1.25rem",
        boxSizing: "border-box",
        borderRadius: ".5rem",
        border:
          ticket.status == "open"
            ? `1px solid ${theme.palette.secondary.main}`
            : `1px solid ${theme.palette.primary.light}`,
        background: theme.palette.primary.dark,
      }}
    >
      {/* Start of header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "1.25rem",
          width: "100%",
        }}
      >
        {/* Avatar */}
        <Avatar src={message.author.avatar} sx={{ width: 48, height: 48 }} />
        {/* Name */}
        <Typography
          variant="subtitle1"
          sx={{
            my: "auto",
            color:
              ticket.status == "open" ? message.author.color : "primary.main",
          }}
        >
          {message.author.name}
        </Typography>
        {/* Timestamp */}
        <Typography
          variant="caption"
          sx={{
            my: "auto",
            color: ticket.status == "open" ? "secondary.main" : "primary.main",
          }}
        >
          {new Date(message.timestamp).toLocaleString()}
        </Typography>
        {/* Status */}
        {ticket.status == "open" ? (
          <Typography
            variant="subtitle1"
            sx={{ ml: "auto", color: "secondary.main" }}
          >
            Open
          </Typography>
        ) : (
          <Typography
            variant="subtitle1"
            sx={{ ml: "auto", color: "primary.main" }}
          >
            Closed
          </Typography>
        )}
      </Box>
      {/* End of header */}
      {/* Start of body */}

      <Typography
        variant="body1"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          fontFamily: "Roboto",
          color:
            ticket.status == "open"
              ? "primary.contrastContent"
              : "primary.main",
        }}
      >
        {message.content}
      </Typography>

      {/* End of body */}
      {/* Start of footer */}
      <Box
        sx={{
          // borderTop: `1px solid ${theme.palette.primary.light}`,
          display: "flex",
          width: "100%",
          pt: 1,
          mt: "auto",
          gap: ".5rem",
        }}
      >
        {ticket.status == "open" ? (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DoneOutlinedIcon />}
            onClick={handleDone}
          >
            Done
          </Button>
        ) : (
          // <Tooltip title="Mark as 'Closed'">
          //   <IconButton color="secondary" onClick={handleDone}>
          //     <DoneOutlinedIcon />
          //   </IconButton>
          // </Tooltip>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<MenuBookOutlinedIcon />}
            onClick={handleReopen}
          >
            Reopen
          </Button>
          // <Tooltip title="Mark as 'Open'">
          //   <IconButton color="secondary" onClick={handleReopen}>
          //     <MenuBookOutlinedIcon />
          //   </IconButton>
          // </Tooltip>
        )}
        <Button
          variant={ticket.status == "open" ? "contained" : "outlined"}
          color="secondary"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Delete
        </Button>
        {/* <Tooltip title="Delete">
          <IconButton color="secondary" onClick={handleDeleteClicked}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip> */}
        <Button
          variant={ticket.status == "open" ? "contained" : "outlined"}
          color="secondary"
          startIcon={<ArticleOutlinedIcon />}
          onClick={handleRelatedMessagesOpen}
        >
          {(relatedMessagesOpen ? "Hide" : "Show") + " context messages"}
        </Button>
        {/* <Tooltip
          title={(relatedMessagesOpen ? "Hide" : "Show") + " context messages"}
        >
          <IconButton color="secondary" onClick={handleRelatedMessagesOpen}>
            <ArticleOutlinedIcon />
          </IconButton>
        </Tooltip> */}
        <Button
          variant={ticket.status == "open" ? "contained" : "outlined"}
          color="secondary"
          startIcon={<LaunchOutlinedIcon />}
          href={message.url}
        >
          Open in Discord
        </Button>
        {/* <Tooltip title="Open in Discord">
          <IconButton color="secondary" href={message.msg_url}>
            <LaunchOutlinedIcon />
          </IconButton>
        </Tooltip> */}
      </Box>
      {/* End of footer */}
      {/* Start of related messages */}
      {relatedMessagesOpen &&
        ticket.context_messages.map((msg) => (
          <Card sx={{ width: "100%" }} key={msg.id}>
            <CardHeader
              avatar={
                <Avatar
                  src={msg.author.avatar_url}
                  sx={{ width: 30, height: 30 }}
                ></Avatar>
              }
              title={
                <Typography color={msg.author.color}>
                  msg.author.name
                </Typography>
              }
              subheader={msg.timestamp}
              action={
                <IconButton href={message.url} color="secondary">
                  <LaunchOutlinedIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {msg.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      {relatedMessagesOpen && (
        <Button
          variant={ticket.status == "open" ? "contained" : "outlined"}
          color="secondary"
          startIcon={<ArticleOutlinedIcon />}
          onClick={handleRelatedMessagesOpen}
        >
          {(relatedMessagesOpen ? "Hide" : "Show") + " context messages"}
        </Button>
      )}
      {/* End of related messages */}
      <Snackbar
        open={snackBar.open}
        autoHideDuration={5000}
        onClose={handleSnackBarClose}
      >
        <Alert severity={snackBar.severity} onClose={handleSnackBarClose}>
          {snackBar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure to remove the selected ticket?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your are about to delete a ticket. This change is{" "}
            <strong>irreversible</strong>. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setDialogOpen(false)}
          >
            Cancel deletion
          </Button>
          <Button
            variant={ticket.status == "open" ? "contained" : "outlined"}
            color="error"
            onClick={handleDeletion}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageCard;

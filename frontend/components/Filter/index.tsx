import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import {
  emptyFilter,
  getSortingOptionById,
  sortingOptions,
  ticketsPerPage,
} from "../../constants/filters";
import { Status } from "../../interfaces/filter";
import DeleteIcon from "@mui/icons-material/Delete";

const Filter = ({ filter, setFilter, loadTickets, pageSize, setPageSize }) => {
  const [usernames, setUsernames] = useState([]);
  const [sorting, setSorting] = useState("3");
  const theme = useTheme();
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
  function fetchUsernames() {
    fetch("http://localhost:5001/users/usernames")
      .then((r) => r.json())
      .then((result) => setUsernames(result))
      .catch((err) => console.warn(err));
  }
  function handleSorting(event: SelectChangeEvent): void {
    setSorting(event.target.value);
    let newFilters = {
      ...filter,
      sorting: getSortingOptionById(parseInt(event.target.value)).sorting,
    };
    setFilter(newFilters);
  }

  return (
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
              {(Object.keys(Status) as Array<keyof typeof Status>).map(
                (key) => (
                  <ContainedSecondaryToggleButton value="open" key={key}>
                    {key}
                  </ContainedSecondaryToggleButton>
                )
              )}
            </ToggleButtonGroup>
          </FormGroup>
          {
            <Autocomplete
              multiple
              options={usernames}
              value={filter.usernames}
              onChange={(event, value) =>
                setFilter({ ...filter, usernames: value })
              }
              onFocus={fetchUsernames}
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
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1 }}>
              <DateTimePicker
                label="Start date"
                value={filter.date.start}
                onChange={(newValue: any) => {
                  let newFilters = {
                    ...filter,
                    date: {
                      ...filter.date,
                      start: newValue.format("YYYY-MM-DD HH:mm:ss"),
                    },
                  };
                  setFilter(newFilters);
                }}
              />
              <DateTimePicker
                label="End date"
                value={filter.date.end}
                onChange={(newValue: any) => {
                  let newFilters = {
                    ...filter,
                    date: {
                      ...filter.date,
                      end: newValue.format("YYYY-MM-DD HH:mm:ss"),
                    },
                  };
                  setFilter(newFilters);
                }}
              />
            </Stack>
          </FormGroup>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id="sort-by-label" color="secondary">
              Sort by
            </InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by-select"
              value={sorting}
              label="Sort by"
              color="secondary"
              onChange={handleSorting}
            >
              {sortingOptions.map((opt) => (
                <MenuItem key={opt.id} value={opt.id}>
                  {opt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="tickets-per-page-label" color="secondary">
              Tickets/page
            </InputLabel>
            <Select
              labelId="tickets-per-page-label"
              id="tickets-per-page"
              value={pageSize}
              label="Tickets/page"
              color="secondary"
              onChange={(e) => setPageSize(e.target.value)}
            >
              {ticketsPerPage.map((tpp: number) => (
                <MenuItem key={tpp} value={tpp}>
                  {tpp}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setFilter(emptyFilter);
                setSorting("3");
                loadTickets(1, emptyFilter);
              }}
              startIcon={<DeleteIcon />}
              size="large"
            >
              Reset filters
            </Button>
          </Stack>
        </FormControl>
      </Box>
    </Container>
  );
};

export default Filter;

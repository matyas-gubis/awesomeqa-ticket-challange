import {
  Autocomplete,
  Box,
  Button,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import { emptyFilter } from "../../constants/filters";

const Filter = ({ filter, setFilter, users, loadTickets }) => {
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
            <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1 }}>
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
  );
};

export default Filter;

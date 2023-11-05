import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CustomButton from "../components/CustomButton";
import { menus } from "../constants/menus";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const cards = menus;

const IndexPage = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1, mt: 15, mb: 15 }}>
        <Grid container spacing={2}>
          {cards.map((card) => (
            <Grid item xs={12} md={4} key={card.id}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CustomButton title={card.name} url={card.url}>
                  {card.icon}
                </CustomButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default IndexPage;

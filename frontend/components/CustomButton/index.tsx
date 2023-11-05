import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Link from "next/link";

const CustomButton = ({ title, children, url }) => {
  const theme = useTheme();

  return (
    <Link href={url}>
      <Box
        component="section"
        sx={{
          width: "19rem",
          p: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          gap: "1.25rem",
          boxSizing: "border-box",
          borderRadius: ".5rem",
          border: `1px solid ${theme.palette.primary.light}`,
          background: theme.palette.primary.dark,
          "&:hover": {
            background: theme.palette.primary.light,
            cursor: "pointer",
          },
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            bgcolor: "primary.main",
            borderRadius: ".5rem",
            padding: "0.375rem 0.375rem 0.375rem 0.4375rem",
            justifyContent: "center",
            alignItems: "center",
            color: "primary.contrastText",
          }}
        >
          {children}
        </Box>
        <Typography
          variant="h3"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            alignSelf: "stretch",
            fontSize: "1.5rem",
            fontFamily: "Roboto",
          }}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  );
};

export default CustomButton;

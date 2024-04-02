"use client";

import { MantineColorsTuple, createTheme } from "@mantine/core";

// Deep Blue
const mainColor: MantineColorsTuple = [
  "#ebefff",
  "#d5dafc",
  "#a9b1f1",
  "#7b87e9",
  "#5362e1",
  "#3a4bdd",
  "#2d3fdc",
  "#1f32c4",
  "#182cb0",
  "#0b259c",
];

export const theme = createTheme({
  /* Put your mantine theme override here */
  primaryColor: "mainColor",
  primaryShade: 4,
  colors: {
    mainColor,
  },
});

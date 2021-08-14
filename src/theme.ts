import { createTheme } from "@material-ui/core/styles";
import { esES } from "@material-ui/core/locale";

export const theme = createTheme(
  {
    palette: {
      primary: {
        light: "#ff95ca",
        main: "#e96399",
        dark: "#b32f6b",
        contrastText: "#fff",
      },
      secondary: {
        light: "#f0abd5",
        main: "#bd7ba4",
        dark: "#8c4e75",
        contrastText: "#fff",
      },
    },
  },
  esES
);

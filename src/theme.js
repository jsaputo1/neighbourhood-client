//This is the style sheet that overwrittes the styles of the Material UI components
import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#2f90c2",
      main: "#1c658a",
      dark: "#165270",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
    toggle: {
      thumbOnColor: "yellow",
      trackOnColor: "green",
    },
  },
});

export default theme;

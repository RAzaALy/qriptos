import React from "react";
import { Router, Route } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { SnackbarProvider } from "notistack";
import history from "./Utilities/history";
import PrivateRoute from "./Utilities/private-route";
import GetKey from "./pages/GetKey";
import Welcome from "./pages/Welcome";
import CreatePassword from "./pages/CreatePassword.jsx";
import Chat from "./Chat/Chat";
import Login from "./pages/Login";
import NewChat from "./pages/NewChat";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#58a5f0",
      main: "#0277bd",
      dark: "#004c8c",
    },
    secondary: {
      light: "#ffd95a",
      main: "#f9a825",
      dark: "#c17900",
      contrastText: "#212121",
    },
    background: {
      default: "#f0f0f0",
    },
  },
  typography: {
    useNextVariants: true,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
        <Router history={history}>
          <Route path="/" exact component={Welcome} />
          <Route path="/generateKey" component={GetKey}></Route>
          <Route path="/createPassword" component={CreatePassword}></Route>
          <Route path="/login" component={Login}></Route>
          <PrivateRoute path="/chat" component={Chat} />
          <PrivateRoute path="/newChat" component={NewChat} />
        
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;

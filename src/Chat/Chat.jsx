import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import socketIOClient from "socket.io-client";
import Header from "../Layout/Header";
import ChatBox from "./ChatBox";
import Contacts from "./Contacts";
import Chats from "./Chats";
import { authenticationService } from "../Services/authenticationService";
export const socket = socketIOClient(process.env.REACT_APP_API_URL, {
  withCredentials: true,
});
const useStyles = makeStyles((theme) => ({
  paper: {
    minHeight: "calc(100vh - 64px)",
    borderRadius: 0,
  },
  sidebar: {
    zIndex: 8,
  },
  subheader: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  globe: {
    backgroundColor: theme.palette.primary.dark,
  },
  subheaderText: {
    color: theme.palette.primary.dark,
  },
}));

const Chat = () => {
  const [address] = useState(authenticationService.currentUserValue.address);
  const [scope, setScope] = useState("Chat");
  const [tab, setTab] = useState(0);
  const [user, setUser] = useState(null);

  const classes = useStyles();

  const handleChange = (e, newVal) => {
    setTab(newVal);
  };

  useEffect(() => {
    socket.emit("connect_user", { address: address }, (response) => {
      console.log(response, "responeh");
    });
    socket.on("connect_user", (res) => {
      localStorage.setItem("currentUser", JSON.stringify(res));
      setUser(res);
    });

    return () => socket.close();
  }, []);
  return (
    <React.Fragment>
      <Header />
      <Grid container>
        <Grid item md={4} className={classes.sidebar}>
          <Paper className={classes.paper} square elevation={5}>
            <Paper square>
              <Tabs
                onChange={handleChange}
                variant="fullWidth"
                value={tab}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Chats" />
                <Tab label="Contacts" />
              </Tabs>
            </Paper>
            {tab === 0 && <Chats setUser={setUser} setScope={setScope} />}
            {tab === 1 && <Contacts setUser={setUser} setScope={setScope} />}
          </Paper>
        </Grid>
        <Grid item md={8}>
          <ChatBox scope={scope} user={user} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Chat;

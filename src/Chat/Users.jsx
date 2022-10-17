import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { SearchOutlined } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useGetChats } from "../Services/chatService";
import { Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import socketIOClient from "socket.io-client";
import commonUtilites from "../Utilities/common";
import { authenticationService } from "../Services/authenticationService";
import { useViewContact, useViewProfile } from "../Services/userService";

const useStyles = makeStyles((theme) => ({
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
  list: {
    maxHeight: "calc(100vh - 112px)",
    overflowY: "auto",
  },
  avatar: {
    margin: theme.spacing(0, 3, 0, 1),
  },
  search: {
    margin: "8px",
    width: "80%",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
}));
const Users = (props) => {
  const [address] = useState(authenticationService.currentUserValue.address);
  const classes = useStyles();
  const [data, setData] = useState([])
  const [search, setSearch] = useState("");
  const [profileMenu, setProfileMenu] = useState(null);
  const [chats, setChats] = useState([]);
  const [profile, setProfile] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [newChat, setNewChat] = useState(null);

  const getChats = useGetChats();
  const getContacts = useViewContact();
  const getProfile = useViewProfile();

  useEffect(() => {
    getChats()
      .then((res) => setChats(res))
      .catch((err) => console.log(err, "error"));
    getContacts()
      .then((res) => {
        setContacts(res);
        setData(res);
      })
      .catch((err) => console.log(err, "error"));
  }, []);

  const handleChange = (e) => {
    const keyword = e.target.value;

    if (keyword !== "") {
      const results = contacts.filter((user) => {
        return user.chatWithUserId.userName
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
      });
      setContacts(results);
    } else {
      setContacts(data);
    }

    setSearch(keyword);
  };

  const viewProfile = (u, key, name) => {
    props.setUser(u);
    props.setScope(name);
    getProfile(key)
      .then((res) => setProfile(res))
      .catch((err) => console.log(err, "error"));
  };
  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_API_URL);

    socket.on("connect", () => {
      console.log("connect", socket);
    });
    socket.emit("connect_user", { address: address }, (response) => {
      console.log(response, "responeh");
    });
    socket.on("connect_user", (res) => {
      console.log("connect user", res);
    });

    return () => socket.close();
  }, []);

  return (
    <Fragment>
      <div className={classes.center}>
        <TextField
          className={classes.search}
          fullWidth
          id="standard-bare"
          variant="outlined"
          placeholder="Search..."
          // onKeyDown={keyPress}
          onChange={(e) => handleChange(e)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchOutlined />
              </IconButton>
            ),
          }}
        />
        <IconButton
          aria-haspopup="true"
          color="inherit"
          aria-controls="profile-menu"
          onClick={(e) => setProfileMenu(e.currentTarget)}
        >
          <AddIcon />
        </IconButton>
        <Menu
          id="profile-menu"
          open={Boolean(profileMenu)}
          anchorEl={profileMenu}
          onClose={() => setProfileMenu(null)}
          disableAutoFocusItem
        >
          <MenuItem
            component={RouterLink}
            onClick={() => setProfileMenu(null)}
            to="/newChat"
          >
            <PersonIcon /> Start New Chat
          </MenuItem>
          <MenuItem onClick={() => setProfileMenu(null)}>
            <GroupIcon /> Start Group Chat
          </MenuItem>
        </Menu>
      </div>
      <List className={classes.list}>
        {contacts && (
          <React.Fragment>
            {contacts.map((u) => (
              <ListItem
                className={classes.listItem}
                key={u._id}
                onClick={() =>
                  viewProfile(
                    u,
                    u.chatWithUserId.address,
                    u.chatWithUserId.userName
                  )
                }
                button
              >
                <ListItemAvatar className={classes.avatar}>
                  <Avatar>
                    {commonUtilites.getInitialsFromName(
                      u.chatWithUserId.userName
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={u.chatWithUserId.userName}
                  secondary={u.chatWithUserId.address}
                />
              </ListItem>
            ))}
          </React.Fragment>
        )}
      </List>
    </Fragment>
  );
};

export default Users;

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
import commonUtilites from "../Utilities/common";
// import Cryptr from "cryptr";
import { authenticationService } from "../Services/authenticationService";
import { socket } from "./Chat";
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
const Chats = (props) => {
  // const cryptr = new Cryptr(process.env.REACT_APP_SECRET_KEY);
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [profileMenu, setProfileMenu] = useState(null);
  const [chats, setChats] = useState([]);
  const [newChats, setNewChats] = useState(null);

  const getChats = useGetChats();

  useEffect(() => {
    getChats()
      .then((res) => {
        setChats(res);
        setData(res);
      })
      .catch((err) => console.log(err, "error"));
  }, [newChats]);

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setNewChats(data);
    });

    return () => {
      socket.removeListener("chat_message");
    };
  }, []);

  const handleChange = (e) => {
    const keyword = e.target.value;
    if (keyword !== "") {
      const results = chats.filter((user) => {
        return user.recieverId[0].userName
          .toLowerCase()
          .startsWith(keyword.toLowerCase());
      });
      setChats(results);
    } else {
      setChats(data);
    }

    setSearch(keyword);
  };

  // Returns the recipient name that does not
  // belong to the current user.
  const handleRecipient = (data) => {
    const recipients = [data.recieverId[0], data.senderId];

    for (let i = 0; i < recipients.length; i++) {
      if (
        recipients[i].userName !==
        authenticationService.currentUserValue.userName
      ) {
        return recipients[i];
      }
    }
    return null;
  };

  return (
    <Fragment>
      <div className={classes.center}>
        <TextField
          className={classes.search}
          fullWidth
          id="standard-bare"
          variant="outlined"
          placeholder="Search..."
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
        {chats && (
          <React.Fragment>
            {chats.map((c) => (
              <ListItem
                className={classes.listItem}
                key={c._id}
                button
                onClick={() => {
                  props.setUser(handleRecipient(c));
                  props.setScope(handleRecipient(c).userName);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    {commonUtilites.getInitialsFromName(
                      handleRecipient(c).userName
                    )}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={handleRecipient(c).userName}
                  secondary={
                    <React.Fragment>
                      {/* {cryptr.decrypt(c.encryptedMessage)} */}
                      {decodeURIComponent(window.atob(c.encryptedMessage))}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </React.Fragment>
        )}
      </List>
    </Fragment>
  );
};

export default Chats;

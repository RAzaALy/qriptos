import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { SearchOutlined } from "@material-ui/icons";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useGetChats } from "../Services/chatService";
import commonUtilites from "../Utilities/common";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
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

const Contacts = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [profileMenu, setProfileMenu] = useState(null);
  const [profile, setProfile] = useState();
  const [contacts, setContacts] = useState([]);
  const getContacts = useViewContact();
  const getProfile = useViewProfile();

  useEffect(() => {
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
  const viewProfile = async (key) => {
    await getProfile(key)
      .then((res) => {
        props.setUser(res);
        props.setScope(res.userName);
        setProfile(res._id);
      })
      .catch((err) => console.log(err, "error"));
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
                onClick={() => viewProfile(u.chatWithUserId.address)}
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

export default Contacts;

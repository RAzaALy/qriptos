import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { SearchOutlined } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useGetChats } from "../Services/chatService";
import { authenticationService } from "../Services/authenticationService";
import commonUtilites from "../Utilities/common";
import { Fragment } from "react";


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

const Conversations = (props) => {
  const classes = useStyles();
  const [chats, setChats] = useState([]);
  const [newChat, setNewChat] = useState(null);
  const getChats = useGetChats();

  // Returns the recipient name that does not
  // belong to the current user.
  const handleRecipient = (recipients) => {
    for (let i = 0; i < recipients.length; i++) {
      if (
        recipients[i].userName !==
        authenticationService.currentUserValue.username
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
          defaultValue="Search..."
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchOutlined />
              </IconButton>
            ),
          }}
        />
        <IconButton aria-label="delete" className={classes.add}>
          <AddIcon color="primary" />
        </IconButton>
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
                  props.setUser(handleRecipient(c.recipientObj));
                  props.setScope(handleRecipient(c.recipientObj).name);
                }}
              >
                <ListItemAvatar>
                  <Avatar>
                    {commonUtilites.getInitialsFromName(
                      handleRecipient(c.recipientObj).name
                    )}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={handleRecipient(c.recipientObj).name}
                  secondary={<React.Fragment>{c.lastMessage}</React.Fragment>}
                />
              </ListItem>
            ))}
          </React.Fragment>
        )}
      </List>
    </Fragment>
  );
};

export default Conversations;

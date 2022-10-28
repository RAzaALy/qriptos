import React, { useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import commonUtilites from "../Utilities/common";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";
import { authenticationService } from "../Services/authenticationService";

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
  listItem: {
    display: "flex",
    width: "225%",
  },
  parent: {
    display: "flex",
    justifyContent: "space-between",
  },
}));
const options = ["Delete", "Archive", "Edit"];
const ITEM_HEIGHT = 48;
const Chat = ({ chat, user, scope, onDelete, onArchive }) => {
  const [id, setId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const classes = useStyles();
  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setId(id);
  };

  const handleClose = (option) => {
    if (option === "Delete") {
      onDelete(id);
    } else if (option === "Archive") {
      onArchive(id);
    }

    setAnchorEl(null);
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
    <div key={chat._id} className={classes.parent}>
      <div>
        <ListItem
          className={classes.listItem}
          key={chat._id}
          button
          onClick={() => {
            user(handleRecipient(chat));
            scope(handleRecipient(chat).userName);
          }}
        >
          <ListItemAvatar>
            <Avatar>
              {commonUtilites.getInitialsFromName(
                handleRecipient(chat).userName
              )}
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={handleRecipient(chat).userName}
            secondary={
              <React.Fragment>
                {/* {cryptr.decrypt(c.encryptedMessage)} */}
                {decodeURIComponent(window.atob(chat.encryptedMessage))}
              </React.Fragment>
            }
          />
        </ListItem>
      </div>
      <div>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              selected={option === "Delete"}
              onClick={() => handleClose(option)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={(e) => handleClick(e, chat._id)}
        >
          <MoreVertIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;

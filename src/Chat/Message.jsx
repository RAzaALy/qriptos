import React, { useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import classnames from "classnames";
import cookie from "react-cookies";
import { googleTranslate } from "../Utilities/googleTranslate";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { authenticationService } from "../Services/authenticationService";
import commonUtilites from "../Utilities/common";
import { useEffect } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    margin: 0,
  },

  paper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: theme.palette.primary.dark,
  },
  messageContainer: {
    height: "100%",
    display: "flex",
    alignContent: "flex-end",
  },
  messagesRow: {
    maxHeight: "calc(100vh - 184px)",
    overflowY: "auto",
  },
  newMessageRow: {
    width: "100%",
    padding: theme.spacing(0, 2, 1),
  },
  messageBubble: {
    padding: 10,
    border: "1px solid white",
    backgroundColor: "white",
    borderRadius: "0 10px 10px 10px",
    boxShadow: "-3px 4px 4px 0px rgba(0,0,0,0.08)",
    marginTop: 8,
    maxWidth: "40em",
  },
  messageBubbleRight: {
    borderRadius: "10px 0 10px 10px",
  },

  avatar: {
    margin: theme.spacing(1, 1.5),
  },
  listItem: {
    display: "flex",
    width: "100%",
  },
  listItemRight: {
    flexDirection: "row-reverse",
  },
}));
const options = ["Delete", "Sealed", "Edit"];

const ITEM_HEIGHT = 48;
const Message = ({ message, onDelete, image }) => {
  const [currentUser] = useState(authenticationService.currentUserValue);
  const classes = useStyles();
  const [id, setId] = useState("");
  const [sealed, setSealed] = useState(false);
  const [translatedMessage, setTranslatedMessage] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const language = cookie.load("language")
    ? cookie.load("language")
    : { language: "en", name: "English" };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setId(id);
  };
  const translate = (string) => {
    const message = decodeURIComponent(window.atob(string));

    googleTranslate.translate(
      message,
      language.language,
      function (err, translation) {
        sealed
          ? setTranslatedMessage(string)
          : setTranslatedMessage(translation.translatedText);
      }
    );
    return translatedMessage;
  };

  const handleClose = (option) => {
    if (option === "Delete") {
      onDelete(id);
    } else if (option === "Sealed") {
      setSealed(true);
      options[1] = "UnSealed";
    } else if (option === "UnSealed") {
      setSealed(false);
      options[1] = "Sealed";
    }

    setAnchorEl(null);
  };

  return (
    <>
      <ListItem
        key={message._id}
        className={classnames(classes.listItem, {
          [`${classes.listItemRight}`]:
            message.senderId._id === currentUser._id,
        })}
        alignItems="flex-start"
      >
        <ListItemAvatar className={classes.avatar}>
          <Avatar
            alt={commonUtilites.getInitialsFromName(message.senderId.userName)}
            src={`https://secure.gravatar.com/avatar/${message.senderId._id}?s=150&d=retro`}
          />
          {/* {commonUtilites.getInitialsFromName(message.senderId.userName)}
        </Avatar> */}
        </ListItemAvatar>
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
        </div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={(e) => handleClick(e, message._id)}
        >
          <MoreVertIcon />
        </IconButton>
        <ListItemText
          classes={{
            root: classnames(classes.messageBubble, {
              [`${classes.messageBubbleRight}`]:
                message.senderId._id === currentUser._id,
            }),
          }}
          primary={message.senderId && message.senderId.userName}
          secondary={
            <React.Fragment>
              {translate(message.encryptedMessage) && translatedMessage}
            </React.Fragment>
          }
        />
      </ListItem>
    </>
  );
};

export default Message;

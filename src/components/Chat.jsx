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
const Chat = ({ chat, user, group, scope, onDelete, onArchive }) => {
 
  const [id, setId] = useState({
    deleteId: { type: "", id: null },
    archieveId: null,
    deleteGroupId: { type: "", id: null },
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
 

  const classes = useStyles();
  const handleClick = (event, chat) => {
    setAnchorEl(event.currentTarget);
    const deleteId = { type: "msg", id: id.deleteId.id };
    const deleteGroupId = {
      type: "group",
      id: chat.chatConstantId.chatRoom
        ? chat.chatConstantId.chatRoom._id
        : null,
    };
    const archieveId = chat.chatConstantId._id;
    setId({ deleteId, archieveId, deleteGroupId });
  };

  const handleClose = (option) => {
    if (option === "Delete") {
      onDelete(id.deleteId.id !== null ? id.deleteId : id.deleteGroupId);
    } else if (option === "Archive" || option === "UnArchive") {
      options[1] === "Archive"
        ? (options[1] = "UnArchive")
        : (options[1] = "Archive");
      onArchive(id.archieveId);
    } else if (option === "Choose Language") {
      console.log("open language list");
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
        id.deleteId.id = recipients[i]._id;

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
            user(chat.chatConstantId.chatRoom ? chat : handleRecipient(chat));
            group({
              type: chat.chatConstantId.chatRoom ? true : false,
              chatRoom: chat.chatConstantId.chatRoom,
            });
            scope(
              chat.chatConstantId.chatRoom
                ? chat.chatConstantId.chatRoom.groupName
                : handleRecipient(chat).userName
            );
          }}
        >
          <ListItemAvatar>
            <Avatar
              alt={commonUtilites.getInitialsFromName(
                chat.chatConstantId.chatRoom
                  ? chat.chatConstantId.chatRoom.groupName
                  : handleRecipient(chat).userName
              )}
              src={`https://secure.gravatar.com/avatar/${
                chat.chatConstantId.chatRoom
                  ? chat.chatConstantId.chatRoom._id
                  : handleRecipient(chat)._id
              }?s=150&d=retro`}
            />
            {/* {commonUtilites.getInitialsFromName(
                chat.chatConstantId.chatRoom
                  ? chat.chatConstantId.chatRoom.groupName
                  : handleRecipient(chat).userName
              )}
            </Avatar> */}
          </ListItemAvatar>

          <ListItemText
            primary={
              chat.chatConstantId.chatRoom
                ? chat.chatConstantId.chatRoom.groupName
                : handleRecipient(chat).userName
            }
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
          onClick={(e) => handleClick(e, chat)}
        >
          <MoreVertIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;

import React, { useState } from "react";
import { useRemoveGroupMember } from "../Services/chatService";
import DeleteDialog from "../components/DeleteDialog";

import {
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";
import { useGroupInfoStyles } from "../styles/muiStyles";

import { authenticationService } from "../Services/authenticationService";
const GroupInfo = ({ userData, closeModal }) => {
  const removeGroupMember = useRemoveGroupMember();
  const [user] = useState(authenticationService.currentUserValue);
  const { recieverId, chatConstantId } = userData;

  const isGroupAdmin = user._id === chatConstantId.chatRoom.createdByUser;
  const classes = useGroupInfoStyles();

  const handleRemoveUser = (userToRemoveId) => {
    // console.log({
    //   groupId: chatConstantId.chatRoom._id,
    //   memberId: userToRemoveId,
    // });

    removeGroupMember({
      groupId: chatConstantId.chatRoom._id,
      memberId: [userToRemoveId],
    })
      .then((res) => {
        // console.log(res, "res");
        closeModal();
      })
      .catch((err) => console.log(err, "error"));
  };

  const handleGroupLeave = () => {};

  return (
    <React.Fragment>
      <div>
        <div className={classes.topPart}>
          <div className={classes.groupName}>
            <Typography variant="h5" color="secondary">
              {chatConstantId.chatRoom.groupName}
            </Typography>
          </div>

          <Typography variant="subtitle1" color="secondary">
            Admin:{" "}
            <strong>{chatConstantId.chatRoom.adminId[0].userName}</strong>
          </Typography>
          {!isGroupAdmin && (
            <DeleteDialog handleDelete={handleGroupLeave} type="leave" />
          )}
        </div>

        <div className={classes.membersListWrapper}>
          <Typography
            variant="subtitle1"
            color="secondary"
            className={classes.membersHeader}
          >
            {recieverId.length} {recieverId.length > 1 ? "Members" : "Member"}
          </Typography>
          <List className={classes.membersList}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  alt={user.userName}
                  src={`https://secure.gravatar.com/avatar/${user._id}?s=150&d=retro`}
                />
              </ListItemAvatar>
              <ListItemText primary="You" />
            </ListItem>
            {userData &&
              recieverId
                .filter((u) => user._id !== u._id)
                .map((u) => (
                  <ListItem key={u._id}>
                    <ListItemAvatar>
                      <Avatar
                        alt={u.userName}
                        src={`https://secure.gravatar.com/avatar/${u._id}?s=150&d=retro`}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={u.userName} />
                    {isGroupAdmin && (
                      <ListItemSecondaryAction>
                        <DeleteDialog
                          handleDelete={() => handleRemoveUser(u._id)}
                          username={u.userName}
                        />
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
          </List>
        </div>
      </div>
    </React.Fragment>
  );
};

export default GroupInfo;

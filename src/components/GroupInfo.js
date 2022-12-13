import React, { useState } from "react";
import {
  useRemoveGroupMember,
  useLeaveGroupMember,
  useMakeAdmin,
} from "../Services/chatService";
import DeleteDialog from "../components/DeleteDialog";
import AdminDialog from "./AdminDialog";

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

const GroupInfo = ({ group, closeModal, refresh }) => {
  const removeGroupMember = useRemoveGroupMember();

  const leaveGroupMember = useLeaveGroupMember();
  const makeAdmin = useMakeAdmin();
  const [user] = useState(authenticationService.currentUserValue);

  const isGroupAdmin = user._id === group.createdByUser;
  const classes = useGroupInfoStyles();

  const handleRemoveUser = (userToRemoveId) => {
    // console.log({
    //   groupId: chatConstantId.chatRoom._id,
    //   memberId: userToRemoveId,
    // });

    removeGroupMember({
      groupId: group._id,
      memberId: [userToRemoveId],
    })
      .then((res) => {
        // console.log(res, "res");
        closeModal();
        refresh();
      })
      .catch((err) => console.log(err, "error"));
  };
  const handleMakeAdmin = (userToMakeAdminId) => {
    console.log({
      groupId: group._id,
      memberId: userToMakeAdminId,
    });

    makeAdmin({
      groupId: group._id,
      memberId: userToMakeAdminId,
    })
      .then((res) => {
        // console.log(res, "res");
        closeModal();
      })
      .catch((err) => console.log(err, "error"));
  };

  const handleGroupLeave = () => {
    leaveGroupMember({
      chatRoomId: group._id,
    })
      .then((res) => {
        // console.log(res, "res");
        closeModal();
        refresh();
      })
      .catch((err) => console.log(err, "error"));
  };

  return (
    <React.Fragment>
      <div>
        <div className={classes.topPart}>
          <div className={classes.groupName}>
            <Typography variant="h5" color="secondary">
              {group.groupName}
            </Typography>
          </div>

          <Typography variant="subtitle1" color="secondary">
            Admin: <strong>{group.adminId}</strong>
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
            {group.memberId.length}{" "}
            {group.memberId.length > 1 ? "Members" : "Member"}
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
            {group &&
              group.memberId
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
                        <AdminDialog
                          handleMakeAdmin={() => handleMakeAdmin(u._id)}
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

import React, { useState, useEffect } from "react";
import { useViewContact } from "../Services/userService";
import { socket } from "../Chat/Chat";
import {
  TextField,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useAddGroupMember } from "../Services/chatService";
import { useAddGroupMembersStyles } from "../styles/muiStyles";

const AddGroupMembers = ({ members, groupId, closeModal }) => {
  const getContacts = useViewContact();
  const addGroupMember = useAddGroupMember();
  const classes = useAddGroupMembersStyles();
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [userData, setUserData] = useState([]);

  const usersOnChange = (e, selectedOption) => {
    setUsersToAdd(selectedOption.map((o) => o.chatWithUserId._id));
  };

  const handleAddUser = (e) => {
    e.preventDefault();

    addGroupMember({ groupId, memberId: usersToAdd })
      .then((res) => {
        socket.on("group_chat_message", (data) => {
          console.log(data, "add member");
        });
        closeModal();
      })
      .catch((err) => console.log(err, "error"));
  };

  useEffect(() => {
    getContacts()
      .then((res) => {
        setUserData(res);
      })
      .catch((err) => console.log(err, "error"));
  }, []);

  return (
    <React.Fragment>
      <form onSubmit={handleAddUser}>
        <Autocomplete
          multiple
          filterSelectedOptions
          onChange={usersOnChange}
          options={
            userData
              ? userData.filter((u) => !members.includes(u.chatWithUserId._id))
              : []
          }
          getOptionLabel={(option) => option.chatWithUserId.userName}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Select Users"
              size="small"
            />
          )}
          renderOption={(option) => (
            <ListItem dense>
              <ListItemAvatar>
                <Avatar
                  alt={option.chatWithUserId.userName}
                  src={`https://secure.gravatar.com/avatar/2?s=150&d=retro`}
                />
              </ListItemAvatar>
              <ListItemText primary={option.chatWithUserId.userName} />
            </ListItem>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                avatar={
                  <Avatar
                    alt={option.chatWithUserId.userName}
                    src={`https://secure.gravatar.com/avatar/2?s=150&d=retro`}
                  />
                }
                color="secondary"
                variant="outlined"
                label={option.chatWithUserId.userName}
                {...getTagProps({ index })}
              />
            ))
          }
        />
        <Button
          size="large"
          color="primary"
          variant="contained"
          className={classes.addMemberBtn}
          fullWidth
          type="submit"
        >
          Add Members
        </Button>
      </form>
    </React.Fragment>
  );
};

export default AddGroupMembers;

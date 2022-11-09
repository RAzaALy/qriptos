import React, { useState, useEffect } from "react";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import { SearchOutlined } from "@material-ui/icons";
import AddIcon from "@material-ui/icons/Add";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";
import Menu from "@material-ui/core/Menu";
import {
  useClearChat,
  useArchiveChat,
  useClearGroupChat,
} from "../Services/chatService";
import MenuItem from "@material-ui/core/MenuItem";
import { useGetChats } from "../Services/chatService";
import { Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import Chat from "../components/Chat";
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
  listItem: {
    display: "flex",
    width: "255%",
  },
  parent: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

const Chats = (props) => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [profileMenu, setProfileMenu] = useState(null);
  const [chats, setChats] = useState([]);
  const [newChats, setNewChats] = useState(null);
  const [newGroupChats, setNewGroupChats] = useState(null);
  const clearChat = useClearChat();
  const clearGroupChat = useClearGroupChat();
  const archiveChat = useArchiveChat();
  const getChats = useGetChats();

  const deleteChat = (obj) => {
    obj.type === "msg"
      ? clearChat(obj.id)
          .then((res) => {
            reloadChats();
          })
          .catch((err) => console.log(err, "error"))
      : clearGroupChat(obj.id)
          .then((res) => {
            reloadChats();
          })
          .catch((err) => console.log(err, "error"));
  };
  const archiveCht = (id) => {
    archiveChat(id)
      .then((res) => {
        reloadChats();
      })
      .catch((err) => console.log(err, "error"));
  };
  const reloadChats = () => {
    getChats()
      .then((res) => {
        setChats(res);
        setData(res);
      })
      .catch((err) => console.log(err, "error"));
  };
  useEffect(() => {
    reloadChats();
  }, [newChats, newGroupChats]);

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setNewChats(data);
    });
    socket.on("group_chat_message", (data) => {
      setNewGroupChats(data);
    });
  }, []);

  const handleChange = (e) => {
    const keyword = e.target.value;
    if (keyword !== "") {
      const results = chats.filter((user) => {
        const name =
          user.chatConstantId.chatRoom !== null
            ? user.chatConstantId.chatRoom.groupName
                .toLowerCase()
                .startsWith(keyword.toLowerCase())
            : user.recieverId[0].userName
                .toLowerCase()
                .startsWith(keyword.toLowerCase());
        return name;
      });
      setChats(results);
    } else {
      setChats(data);
    }

    setSearch(keyword);
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
          <MenuItem
            component={RouterLink}
            onClick={() => setProfileMenu(null)}
            to="/newGroupChat"
          >
            <GroupIcon /> Start Group Chat
          </MenuItem>
        </Menu>
      </div>
      <List className={classes.list}>
        {chats && (
          <React.Fragment>
            {chats.map((c) => (
              <Chat
                key={c._id}
                chat={c}
                user={props.setUser}
                scope={props.setScope}
                group={props.setGroup}
                onDelete={deleteChat}
                onArchive={archiveCht}
              />
            ))}
          </React.Fragment>
        )}
      </List>
    </Fragment>
  );
};

export default Chats;

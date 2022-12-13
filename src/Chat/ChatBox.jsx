import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import GroupAddIcon from "@material-ui/icons/GroupAdd";

import MenuItem from "@material-ui/core/MenuItem";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import ImageIcon from "@material-ui/icons/Image";
import Paper from "@material-ui/core/Paper";
import Message from "./Message";
import DialogBox from "../components/DialogBox";
import AddGroupMembers from "../components/AddGroupMembers";
import GroupInfo from "../components/GroupInfo";
import SimplePeerFiles from 'simple-peer-files'
import {
  useDeleteMessage,
  useGetMessages,
  useGetGroupMessages,
  useUploadImage,
  useGroupInfo,
} from "../Services/chatService";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { authenticationService } from "../Services/authenticationService";
import { socket } from "./Chat";
import { FormControl, Select } from "@material-ui/core";
import cookie from "react-cookies";
import { googleTranslate } from "../Utilities/googleTranslate";
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    margin: 0,
  },
  input: {
    display: "none",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  headerRow: {
    maxHeight: 60,
    zIndex: 5,
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
  inputRow: {
    display: "flex",
    alignItems: "flex-end",
  },
  form: {
    width: "100%",
  },
  uploadImg: {
    margin: "2rem",
    width: "15rem",
    height: "10rem",
  },
  scope: {
    margin: "2rem",
  },
}));

const ChatBox = (props) => {
  const [opened, setOpened] = useState(false);
  const [file, setFile] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const spf = new SimplePeerFiles()
  const [langs, setLangs] = useState([]);
  const language = cookie.load("language")
    ? cookie.load("language")
    : { language: "en", name: "English" };

  useEffect(() => {
    googleTranslate.getSupportedLanguages("en", function (err, languageCodes) {
      setLangs(languageCodes);
    });
  }, []);
  const onLanguageChange = (e) => {
    const selectedCountry = e.target.value;
    cookie.save("language", selectedCountry, { path: "/" });
    reloadMessages();
  };
  const handleImage = (e) => {
    const img = e.target.files[0];

    try {
      uploadImage(img)
        .then((res) => {
          setFile(img);
        })
        .catch((err) => console.log(err, "error"));
    } catch (err) {}
  };
  const handleClickOpen = () => {
    setOpened(true);
  };
  const handleClosed = () => {
    setOpened(false);
  };
  const [currentUser] = useState(authenticationService.currentUserValue);
  const getMessages = useGetMessages();
  const getGroupMessages = useGetGroupMessages();
  const deleteMessage = useDeleteMessage();
  const uploadImage = useUploadImage();
  const [infoModal, setInfoModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const getGroupInfo = useGroupInfo();
  const [lastMessage, setLastMessage] = useState(null);

  let chatBottom = useRef(null);
  const classes = useStyles();
  const deleteMsg = (id) => {
    deleteMessage(id)
      .then((res) => {
        reloadMessages();
      })
      .catch((err) => console.log(err, "error"));
  };

  useEffect(() => {
    socket.on("chat_message", (data) => {
      setLastMessage(data);
    });
    socket.on("group_chat_message", (res) => {
      setLastMessage(res.encryptedMessage);
    });
  }, []);

  useEffect(() => {
    reloadMessages();
    scrollToBottom();
  }, [lastMessage, props.scope, props.user]);

  const reloadMessages = () => {
    if (props.scope !== null && props.user !== null) {
      props.user.chatConstantId !== undefined
        ? getGroupMessages(props.user.chatConstantId.chatRoom._id)
            .then((res) => {
              getGroupInfo(props.user.chatConstantId.chatRoom._id)
                .then((res) => {
                  setGroupInfo(res);
                })
                .catch((err) => console.log(err, "error"));
              // if (
              //   props.user.chatConstantId.chatRoom.createdByUser ===
              //   currentUser._id
              // ) {
              //   res.shift();
              // }

              setMessages(res);
            })
            .catch((err) => console.log(err, "error"))
        : getMessages(props.user._id)
            .then((res) => {
              setMessages(res);
            })
            .catch((err) => console.log(err, "error"));
    } else {
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    chatBottom.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const encryptedMsg = window.btoa(encodeURIComponent(newMessage));

    if (props.group.type) {
      socket.emit(
        "group_chat_message",
        {
          chatRoom: props.group.chatRoom._id,
          encryptedMessage: encryptedMsg,
          senderId: currentUser._id,
        },
        (response) => {
          console.log(response, "responeh");
        }
      );
      socket.on("group_chat_message", (res) => {
        setLastMessage(res.encryptedMessage);
      });
    } else {
      socket.emit(
        "chat_message",
        {
          address: props.user.address,
          encryptedMessage: encryptedMsg,
          senderId: currentUser._id,
        },
        (response) => {
          console.log(response, "responeh");
        }
      );
      socket.on("chat_message", (res) => {
        setLastMessage(res.message.encryptMessage);
      });
    }

    setNewMessage("");
  };
  return (
    <>
      <div>
        <Dialog
          open={opened}
          onClose={handleClosed}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Pick Emoji"}</DialogTitle>
          <DialogContent>
            <Picker
              showPreview={false}
              emoji="point_up"
              emojiSize={30}
              showEmojis={true}
              emojiTooltip={true}
              className={styles.emojiPicker}
              title="WeChat"
              onSelect={(emoji) => setNewMessage(newMessage + emoji.native)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosed} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Grid container className={classes.root}>
        <Grid item xs={12} className={classes.headerRow}>
          <Paper className={classes.paper} square elevation={2}>
            <div className={classes.rightHeaderBtns}>
              {props.group.chatRoom &&
                props.group.chatRoom.createdByUser === currentUser._id && (
                  <DialogBox
                    modalOpen={addModal}
                    setModalOpen={setAddModal}
                    title="Add Members"
                    triggerButton={
                      <IconButton
                        color="primary"
                        onClick={() => setAddModal(true)}
                        size="small"
                        style={{ marginRight: 10 }}
                      >
                        <GroupAddIcon fontSize={"medium"} />
                      </IconButton>
                    }
                  >
                    <AddGroupMembers
                      members={groupInfo?.memberId}
                      groupId={groupInfo?._id}
                      closeModal={() => setAddModal(false)}
                      refresh={() => reloadMessages()}
                    />
                  </DialogBox>
                )}
              {props.group.type && (
                <DialogBox
                  modalOpen={infoModal}
                  setModalOpen={setInfoModal}
                  title="Group Info"
                  triggerButton={
                    <IconButton
                      color="primary"
                      onClick={() => setInfoModal(true)}
                      size="small"
                    >
                      <MenuOpenIcon fontSize={"medium"} />
                    </IconButton>
                  }
                >
                  <GroupInfo
                    group={groupInfo}
                    closeModal={() => setInfoModal(false)}
                    refresh={() => reloadMessages()}
                  />
                </DialogBox>
              )}
            </div>
            <Typography className={classes.scope}>{props.scope}</Typography>
            <div>
              <FormControl className="app__dropdown">
                <Select
                  variant="outlined"
                  value={language}
                  onChange={onLanguageChange}
                >
                  <MenuItem value={language}>{language.name}</MenuItem>
                  {/* map through the countries and  show in dropdown */}
                  {langs.map((language, index) => (
                    <MenuItem value={language} key={index}>
                      {language.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            {props.group.type && groupInfo && (
              <Typography>
                ({groupInfo.memberId.length}{" "}
                {groupInfo.memberId.length > 1 ? "members" : "member"})
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Grid container className={classes.messageContainer}>
            <Grid item xs={12} className={classes.messagesRow}>
              {messages && (
                <List>
                  {messages.map((m) => (
                    <Message
                      message={m}
                      user={props.user}
                      scope={props.user}
                      key={m._id}
                      onDelete={deleteMsg}
                    />
                  ))}
                </List>
              )}
              <img
                className={file ? classes.uploadImg : ""}
                src={file ? URL.createObjectURL(file) : null}
                alt=""
              />
              <div ref={chatBottom} />
            </Grid>
            <Grid item xs={12} className={classes.inputRow}>
              <form onSubmit={handleSubmit} className={classes.form}>
                <Grid
                  container
                  className={classes.newMessageRow}
                  alignItems="flex-end"
                >
                  <Grid item xs={10}>
                    <TextField
                      id="message"
                      label="Message"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <IconButton type="submit">
                      <SendIcon />
                    </IconButton>
                    <IconButton type="button" onClick={handleClickOpen}>
                      <EmojiEmotionsIcon />
                    </IconButton>
                    <input
                      onChange={handleImage}
                      accept="image/*"
                      className={classes.input}
                      id="icon-button-file"
                      type="file"
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        color="primary"
                        className={classes.button}
                        component="span"
                      >
                        <ImageIcon />
                      </IconButton>
                    </label>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ChatBox;
const styles = {
  emojiPicker: {
    cursor: "pointer",
    zIndex: 333,
    position: "fixed",
    bottom: "3.5%",
    right: "4%",
    border: "none",
    margin: 0,
  },
};

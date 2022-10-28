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
// import Cryptr from "cryptr";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import Paper from "@material-ui/core/Paper";
import Message from "./Message";
import { useDeleteMessage, useGetMessages } from "../Services/chatService";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import { authenticationService } from "../Services/authenticationService";
import { socket } from "./Chat";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    margin: 0,
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
  

}));

const ChatBox = (props) => {
  const [opened, setOpened] = useState(false);

  const handleClickOpen = () => {
    setOpened(true);
  };
  const handleClosed = () => {
    setOpened(false);
  };
  const [currentUser] = useState(authenticationService.currentUserValue);
  const getMessages = useGetMessages();
  const deleteMessage = useDeleteMessage();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  // const cryptr = new Cryptr(process.env.REACT_APP_SECRET_KEY);
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
  }, []);
  useEffect(() => {
    reloadMessages();
    scrollToBottom();
  }, [lastMessage, props.scope, props.user]);

  const reloadMessages = () => {
    if (props.scope !== null && props.user !== null) {
      getMessages(props.user._id)
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
    // const encryptedMsg = cryptr.encrypt(newMessage);
    const encryptedMsg = window.btoa(encodeURIComponent(newMessage));

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
            <Typography color="inherit" variant="h6">
              {props.scope}
            </Typography>
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

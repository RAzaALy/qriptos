import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import { Formik } from "formik";
import * as Yup from "yup";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Container from "@material-ui/core/Container";
import Header from "../Layout/Header";
import { useViewContact } from "../Services/userService";
import { useNewGroupChat } from "../Services/chatService";
import history from "../Utilities/history";
import { authenticationService } from "../Services/authenticationService";
import { socket } from "../Chat/Chat";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    margin: theme.spacing(3),
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const NewGroupChat = () => {
  const [currentUser] = useState(authenticationService.currentUserValue);
  const [data, setData] = useState([]);
  const classes = useStyles();
  const newGroupChat = useNewGroupChat();
  const getContacts = useViewContact();
  const [checked, setChecked] = useState({});

  const handleChecked = (id) => (e) => {
    const { checked } = e.target;
    setChecked((values) => ({
      ...values,
      [id]: checked,
    }));
  };
  useEffect(() => {
    getContacts()
      .then((res) => {
        setData(res);
      })
      .catch((err) => console.log(err, "error"));
  }, []);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <Typography
          className={classes.submit}
          component="h1"
          variant="h5"
          align="center"
        >
          New Group Chat
        </Typography>
        <div className={classes.paper}>
          <Grid container>
            <Grid item>
              <Formik
                initialValues={{
                  groupName: "",
                }}
                validationSchema={Yup.object().shape({
                  groupName: Yup.string()
                    .required("groupName is Required")
                    .max(100, "groupName too long")
                    .min(4, "groupName should be at least 4 characters long"),
                })}
                onSubmit={({ groupName }, { setStatus, setSubmitting }) => {
                  const keys = Object.keys(checked);
                  const filtered = keys.filter(function (key) {
                    return checked[key];
                  });
                  const notify = `${currentUser.userName} has added you in a Group`;
                  const encryptedNotify = window.btoa(
                    encodeURIComponent(notify)
                  );

                  setStatus();
                  newGroupChat(groupName, filtered, encryptedNotify).then(
                    
                    (user) => {
                  
                      const { from } = history.location.state || {
                        from: { pathname: "/chat" },
                      };
                      history.push(from);
                    },
                    (error) => {
                      setSubmitting(false);
                      setStatus(error);
                    }
                  );
                }}
                validateOnChange={false}
                validateOnBlur={false}
              >
                {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  isValid,
                  errors,
                }) => (
                  <form onSubmit={handleSubmit} className={classes.form}>
                    <TextField
                      id="groupName"
                      className={classes.textField}
                      name="groupName"
                      label="Enter Group Name"
                      fullWidth={true}
                      variant="outlined"
                      margin="normal"
                      required={true}
                      helperText={touched.groupName ? errors.groupName : ""}
                      error={touched.groupName && Boolean(errors.groupName)}
                      value={values.groupName}
                      onChange={handleChange}
                      type="string"
                    />

                    <Button
                      type="submit"
                      fullWidth={true}
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      ADD
                    </Button>
                  </form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </div>
        <Typography
          className={classes.submit}
          component="h1"
          variant="h5"
          align="center"
        >
          Select Group of Paticipants
        </Typography>
        <div className={classes.root}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">
              Select Group of Paticipants
            </FormLabel>
            <FormGroup>
              {data.map((item, index) => (
                <FormControlLabel
                  key={item._id}
                  control={
                    <Checkbox
                      checked={checked[index]}
                      onChange={handleChecked(item.chatWithUserId._id)}
                      name={item.chatWithUserId.userName}
                    />
                  }
                  label={item.chatWithUserId.userName}
                />
              ))}
            </FormGroup>
          </FormControl>
        </div>
      </Container>
    </>
  );
};

export default NewGroupChat;

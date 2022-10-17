import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import { Formik } from "formik";
import * as Yup from "yup";
import Container from "@material-ui/core/Container";
import { useNewChat } from "../Services/userService";
import { Link as RouterLink } from "react-router-dom";
import history from "../Utilities/history";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const NewChat = () => {
  const classes = useStyles();
  const newChat = useNewChat();
 

  useEffect(() => {}, []);
  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5" align="center">
        New Chat
      </Typography>
      <div className={classes.paper}>
        <Grid container>
          <Grid item>
            <Formik
              initialValues={{
                chatKey: "",
              }}
              validationSchema={Yup.object().shape({
                chatKey: Yup.string()
                  .required("ChatKey is Required")
                  .max(100, "ChatKey too long")
                  .min(16, "ChatKey should be at least 16 characters long"),
              })}
              onSubmit={({ chatKey }, { setStatus, setSubmitting }) => {
                setStatus();
                newChat(chatKey).then(
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
                    id="chatKey"
                    className={classes.textField}
                    name="chatKey"
                    label="PassworEnter ENS or Chat Key"
                    fullWidth={true}
                    variant="outlined"
                    margin="normal"
                    required={true}
                    helperText={touched.chatKey ? errors.chatKey : ""}
                    error={touched.chatKey && Boolean(errors.chatKey)}
                    value={values.chatKey}
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
    </Container>
  );
};

export default NewChat;
